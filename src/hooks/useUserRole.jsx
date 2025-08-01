import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        data: role = 'user',
        isLoading: roleLoading,
        error,
        refetch,
        isError,
    } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/users/${user.email}/role`);
                return res.data.role || 'user';
            } catch (error) {
                console.error('Error fetching user role:', error);
                // If API fails, return default role
                return 'user';
            }
        },
        retry: 2,
        retryDelay: 1000,
        refetchOnWindowFocus: false,
    });

    // Helper functions to check specific roles
    const isAdmin = role === 'admin';
    const isRider = role === 'rider';
    const isUser = role === 'user';

    return { 
        role, 
        roleLoading: authLoading || roleLoading, 
        error,
        isError,
        refetch,
        isAdmin,
        isRider,
        isUser,
    };
};

export default useUserRole;
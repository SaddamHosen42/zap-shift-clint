import React, { Children } from 'react';
import { Navigate } from 'react-router';
import useUserRole from '../hooks/useUserRole';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { isAdmin,roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return <span className="loading loading-spinner loading-xl"></span>
    }

    if (!user || !isAdmin) {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }

    return children;
};

export default AdminRoute;
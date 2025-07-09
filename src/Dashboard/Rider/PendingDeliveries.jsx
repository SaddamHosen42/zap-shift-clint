import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../components/Loading';
import { 
    FaBox, 
    FaSearch, 
    FaTruck, 
    FaMapMarkerAlt,
    FaUser,
    FaClock,
    FaCheckCircle,
    FaFilter,
    FaRoute,
    FaDollarSign,
    FaPlay,
    FaFlag
} from 'react-icons/fa';

const PendingDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Load parcels assigned to the current rider
    const { data: parcels = [], isLoading, error } = useQuery({
        queryKey: ["riderParcels"],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/parcels?email=${user.email}`);
            return res.data;
        },
    });

    // Calculate summary statistics
    const totalAssigned = parcels.length;
    const readyForPickup = parcels.filter(p => p.delivery_status === "rider_assigned").length;
    const inTransit = parcels.filter(p => p.delivery_status === "in_transit").length;
    const totalValue = parcels.reduce((sum, parcel) => sum + Number(parcel.cost), 0);

    // Filter parcels based on search term and status
    const filteredParcels = parcels.filter(parcel => {
        const matchesSearch = 
            parcel.tracking_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parcel.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parcel.receiver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parcel.receiver_center?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parcel.type?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = 
            statusFilter === "all" ||
            parcel.delivery_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Mutation for updating parcel status
    const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: async ({ parcel, status }) => {
            const res = await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
                status,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["riderParcels"]);
        },
    });

    const handleStatusUpdate = (parcel, newStatus) => {
        const statusConfig = {
            in_transit: {
                title: "🚚 Confirm Pickup",
                emoji: "📦",
                action: "Pick Up",
                description: "You are about to mark this parcel as picked up",
                bgGradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                buttonColor: "#3b82f6",
                successTitle: "🎉 Pickup Confirmed!",
                successMessage: "Parcel has been marked as picked up and is now in transit"
            },
            delivered: {
                title: "✅ Confirm Delivery",
                emoji: "🎯",
                action: "Deliver",
                description: "You are about to mark this parcel as delivered",
                bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                buttonColor: "#10b981",
                successTitle: "🎊 Delivery Complete!",
                successMessage: "Parcel has been successfully delivered to the customer"
            }
        };

        const config = statusConfig[newStatus];

        Swal.fire({
            title: config.title,
            html: `
                <div class="text-center p-4">
                    <div class="relative mb-6">
                        <div class="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white/20">
                            <div class="text-5xl">${config.emoji}</div>
                        </div>
                        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div class="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                ${parcel.type?.toUpperCase() || 'PARCEL'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-white/80">📦 Parcel:</span>
                                <span class="font-semibold text-white">${parcel.title}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-white/80">🏷️ Tracking ID:</span>
                                <span class="font-mono text-white bg-white/20 px-2 py-1 rounded">${parcel.tracking_id}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-white/80">👤 Receiver:</span>
                                <span class="font-semibold text-white">${parcel.receiver_name}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-white/80">📍 Location:</span>
                                <span class="font-semibold text-white">${parcel.receiver_center}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-white/80">💰 Value:</span>
                                <span class="font-bold text-yellow-300">৳${parcel.cost}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <p class="text-white/90 text-lg font-medium mb-2">${config.description}</p>
                        <p class="text-white/70 text-sm">This action will update the parcel status and notify the customer</p>
                    </div>
                </div>
            `,
            icon: null,
            showCancelButton: true,
            confirmButtonText: `${config.emoji} ${config.action} Parcel`,
            cancelButtonText: "❌ Cancel",
            confirmButtonColor: config.buttonColor,
            cancelButtonColor: "#ef4444",
            background: config.bgGradient,
            color: "#fff",
            width: "450px",
            customClass: {
                popup: "rounded-3xl shadow-2xl border-0 backdrop-blur-sm",
                confirmButton: "rounded-xl px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300",
                cancelButton: "rounded-xl px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300",
                title: "text-2xl font-bold mb-0",
                htmlContainer: "p-0"
            },
            buttonsStyling: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showClass: {
                popup: 'animate__animated animate__zoomIn animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__zoomOut animate__faster'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus({ parcel, status: newStatus })
                    .then(async () => {
                        const config = statusConfig[newStatus];
                        Swal.fire({
                            title: config.successTitle,
                            html: `
                                <div class="text-center p-4">
                                    <div class="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                                        <div class="text-4xl">${newStatus === 'in_transit' ? '🚚' : '🎉'}</div>
                                    </div>
                                    
                                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
                                        <p class="text-white font-semibold text-lg mb-2">${config.successMessage}</p>
                                        <div class="text-sm text-white/80">
                                            <p><strong>Parcel:</strong> ${parcel.title}</p>
                                            <p><strong>Tracking ID:</strong> ${parcel.tracking_id}</p>
                                            <p><strong>Status:</strong> ${newStatus === 'in_transit' ? 'In Transit 🚛' : 'Delivered ✅'}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center justify-center space-x-2 text-white/90">
                                        <span class="text-2xl">${newStatus === 'in_transit' ? '📱' : '💫'}</span>
                                        <span class="text-sm">Customer has been notified</span>
                                    </div>
                                </div>
                            `,
                            icon: null,
                            confirmButtonText: "👍 Great!",
                            confirmButtonColor: config.buttonColor,
                            background: config.bgGradient,
                            color: "#fff",
                            width: "400px",
                            customClass: {
                                popup: "rounded-3xl shadow-2xl border-0",
                                confirmButton: "rounded-xl px-8 py-3 font-bold shadow-lg",
                                title: "text-2xl font-bold mb-0",
                                htmlContainer: "p-0"
                            },
                            timer: 3000,
                            timerProgressBar: true,
                            showClass: {
                                popup: 'animate__animated animate__bounceIn animate__faster'
                            }
                        });

                        // log tracking
                        // let trackDetails = `Picked up by ${user.displayName}`
                        // if (newStatus === 'delivered') {
                        //     trackDetails = `Delivered by ${user.displayName}`
                        // }
                        // await logTracking({
                        //         tracking_id: parcel.tracking_id,
                        //         status: newStatus,
                        //         details: trackDetails,
                        //         updated_by: user.email,
                        //     });
                    })
                    .catch(() => {
                        Swal.fire({
                            title: "❌ Operation Failed",
                            html: `
                                <div class="text-center p-4">
                                    <div class="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                                        <div class="text-4xl">⚠️</div>
                                    </div>
                                    
                                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
                                        <p class="text-white font-semibold text-lg mb-2">Failed to update parcel status</p>
                                        <div class="text-sm text-white/80">
                                            <p>Please check your internet connection and try again.</p>
                                            <p class="mt-2 text-yellow-300">If the problem persists, contact support.</p>
                                        </div>
                                    </div>
                                    
                                    <div class="flex items-center justify-center space-x-2 text-white/90">
                                        <span class="text-2xl">📞</span>
                                        <span class="text-sm">Need help? Contact support</span>
                                    </div>
                                </div>
                            `,
                            icon: null,
                            confirmButtonText: "🔄 Try Again",
                            confirmButtonColor: "#ef4444",
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            color: "#fff",
                            width: "400px",
                            customClass: {
                                popup: "rounded-3xl shadow-2xl border-0",
                                confirmButton: "rounded-xl px-8 py-3 font-bold shadow-lg",
                                title: "text-2xl font-bold mb-0",
                                htmlContainer: "p-0"
                            },
                            showClass: {
                                popup: 'animate__animated animate__shakeX animate__faster'
                            }
                        });
                    });
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
                <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h3>
                    <p className="text-gray-600 mb-6">Failed to load pending deliveries. Please check your connection.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FaTruck className="text-3xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    Pending Deliveries
                                </h1>
                                <p className="text-gray-600 text-lg">Manage your assigned deliveries and update their status</p>
                            </div>
                        </div>
                        <div className="hidden lg:block text-8xl opacity-10 text-blue-500">
                            <FaTruck />
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Assigned</p>
                                    <p className="text-3xl font-bold">{totalAssigned}</p>
                                </div>
                                <FaBox className="text-3xl text-blue-200" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Ready for Pickup</p>
                                    <p className="text-3xl font-bold">{readyForPickup}</p>
                                </div>
                                <FaClock className="text-3xl text-orange-200" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">In Transit</p>
                                    <p className="text-3xl font-bold">{inTransit}</p>
                                </div>
                                <FaRoute className="text-3xl text-purple-200" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Total Value</p>
                                    <p className="text-3xl font-bold">৳{totalValue.toFixed(2)}</p>
                                </div>
                                <FaDollarSign className="text-3xl text-green-200" />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by tracking ID, title, receiver, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
                        
                        <div className="relative">
                            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white appearance-none"
                            >
                                <option value="all">All Status</option>
                                <option value="rider_assigned">Ready for Pickup</option>
                                <option value="in_transit">In Transit</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deliveries Table/Cards */}
            {filteredParcels.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-gray-100">
                    <div className="text-8xl mb-6 opacity-20">📦</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        {searchTerm || statusFilter !== "all" ? "No Matching Deliveries" : "No Pending Deliveries"}
                    </h3>
                    <p className="text-gray-600 text-lg mb-8">
                        {searchTerm || statusFilter !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "All assigned deliveries are complete! Great job! 🎉"}
                    </p>
                    {(searchTerm || statusFilter !== "all") && (
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                            }}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                        >
                            🔄 Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">📦 Parcel Details</th>
                                    <th className="px-6 py-4 text-left font-semibold">👤 Receiver Info</th>
                                    <th className="px-6 py-4 text-left font-semibold">📍 Destination</th>
                                    <th className="px-6 py-4 text-left font-semibold">💰 Value</th>
                                    <th className="px-6 py-4 text-left font-semibold">📊 Status</th>
                                    <th className="px-6 py-4 text-left font-semibold">🎯 Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParcels.map((parcel, index) => (
                                    <tr key={parcel._id} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                                    📦
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-lg">{parcel.title}</p>
                                                    <p className="text-sm text-gray-500">ID: {parcel.tracking_id}</p>
                                                    <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">
                                                        {parcel.type}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {parcel.receiver_name?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{parcel.receiver_name}</p>
                                                    <p className="text-sm text-gray-500">Customer</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-2">
                                                <FaMapMarkerAlt className="text-red-500" />
                                                <div>
                                                    <p className="font-medium text-gray-800">{parcel.receiver_center}</p>
                                                    <p className="text-sm text-gray-500">Delivery Center</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">
                                                    ৳{parcel.cost}
                                                </div>
                                                <div className="text-xs text-gray-500">Package Value</div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-2">
                                                {parcel.delivery_status === "rider_assigned" && (
                                                    <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 px-3 py-2 rounded-full border border-orange-200">
                                                        <FaClock className="text-orange-600" />
                                                        <span className="font-semibold text-sm">Ready for Pickup</span>
                                                    </div>
                                                )}
                                                {parcel.delivery_status === "in_transit" && (
                                                    <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-3 py-2 rounded-full border border-purple-200">
                                                        <FaTruck className="text-purple-600" />
                                                        <span className="font-semibold text-sm">In Transit</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-6">
                                            {parcel.delivery_status === "rider_assigned" && (
                                                <button
                                                    className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                                    onClick={() => handleStatusUpdate(parcel, "in_transit")}
                                                    disabled={isUpdating}
                                                >
                                                    <FaPlay className="group-hover:animate-pulse" />
                                                    <span>{isUpdating ? "Updating..." : "Mark Picked Up"}</span>
                                                </button>
                                            )}
                                            {parcel.delivery_status === "in_transit" && (
                                                <button
                                                    className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                                    onClick={() => handleStatusUpdate(parcel, "delivered")}
                                                    disabled={isUpdating}
                                                >
                                                    <FaFlag className="group-hover:animate-bounce" />
                                                    <span>{isUpdating ? "Updating..." : "Mark Delivered"}</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Results Summary */}
            {filteredParcels.length > 0 && (
                <div className="mt-6 text-center text-gray-600">
                    Showing {filteredParcels.length} of {totalAssigned} assigned deliveries
                    {(searchTerm || statusFilter !== "all") && (
                        <span className="ml-2 text-blue-600 font-medium">
                            (filtered)
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default PendingDeliveries;
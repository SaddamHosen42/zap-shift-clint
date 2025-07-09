import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';
import { 
    FaSearch, 
    FaMapMarkerAlt, 
    FaCheckCircle, 
    FaClock, 
    FaTruck, 
    FaBox,
    FaRoute,
    FaCalendarAlt,
    FaUser,
    FaShippingFast,
    FaFlag,
    FaPlay,
    FaArrowLeft,
    FaEye
} from 'react-icons/fa';

const TrackParcel = () => {
    const [selectedParcelId, setSelectedParcelId] = useState(null);
    const [showTracking, setShowTracking] = useState(false);
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    // Get user's parcels
    const { data: userParcels = [], isLoading: isParcelsLoading, error: parcelsError } = useQuery({
        queryKey: ['userParcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        },
    });

    // Get tracking data for selected parcel
    const selectedParcel = userParcels.find(p => p._id === selectedParcelId);
    const { data: trackingData = [], isLoading: isTrackingLoading, error: trackingError } = useQuery({
        queryKey: ['tracking', selectedParcel?.tracking_id],
        enabled: !!selectedParcel?.tracking_id && showTracking,
        queryFn: async () => {
            const res = await axiosSecure.get(`/trackings/${selectedParcel.tracking_id}`);
            return res.data;
        },
    });

    const handleTrackParcel = (parcel) => {
        setSelectedParcelId(parcel._id);
        setShowTracking(true);
    };

    const handleBackToList = () => {
        setShowTracking(false);
        setSelectedParcelId(null);
    };

    const getStatusIcon = (status) => {
        const icons = {
            'pending': <FaClock className="text-white text-xl" />,
            'confirmed': <FaCheckCircle className="text-white text-xl" />,
            'rider_assigned': <FaUser className="text-white text-xl" />,
            'in_transit': <FaTruck className="text-white text-xl" />,
            'delivered': <FaFlag className="text-white text-xl" />,
            'cancelled': <FaCheckCircle className="text-white text-xl" />
        };
        return icons[status] || <FaBox className="text-white text-xl" />;
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800',
            'confirmed': 'from-blue-100 to-blue-200 border-blue-300 text-blue-800',
            'rider_assigned': 'from-purple-100 to-purple-200 border-purple-300 text-purple-800',
            'in_transit': 'from-orange-100 to-orange-200 border-orange-300 text-orange-800',
            'delivered': 'from-green-100 to-green-200 border-green-300 text-green-800',
            'cancelled': 'from-red-100 to-red-200 border-red-300 text-red-800'
        };
        return colors[status] || 'from-gray-100 to-gray-200 border-gray-300 text-gray-800';
    };

    const formatStatus = (status) => {
        const statusMap = {
            'pending': 'Order Pending',
            'confirmed': 'Order Confirmed',
            'rider_assigned': 'Rider Assigned',
            'in_transit': 'In Transit',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status.replace('_', ' ').toUpperCase();
    };

    if (isParcelsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Loading />
            </div>
        );
    }

    if (parcelsError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
                <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
                    <div className="text-6xl mb-4">❌</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h3>
                    <p className="text-gray-600 mb-6">Failed to load your parcels. Please check your connection.</p>
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
                                <FaRoute className="text-3xl text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {showTracking ? 'Parcel Tracking' : 'Track Your Parcels'}
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    {showTracking 
                                        ? `Tracking details for ${selectedParcel?.tracking_id}` 
                                        : 'Select a parcel to view its tracking information'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:block text-8xl opacity-10 text-blue-500">
                            <FaShippingFast />
                        </div>
                    </div>

                    {/* Back Button */}
                    {showTracking && (
                        <button
                            onClick={handleBackToList}
                            className="flex items-center space-x-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <FaArrowLeft className="text-gray-600 text-sm" />
                            </div>
                            <span className="text-lg">Back to Parcels List</span>
                        </button>
                    )}
                </div>
            </div>

            {!showTracking ? (
                /* Parcels List */
                <>
                    {userParcels.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-gray-100">
                            <div className="text-8xl mb-6 opacity-20">📦</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Parcels Found</h3>
                            <p className="text-gray-600 text-lg mb-8">
                                You haven't sent any parcels yet. Create your first parcel to start tracking!
                            </p>
                            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 mx-auto">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-blue-600 text-xl">📦</span>
                                </div>
                                <span className="text-lg">Send Your First Parcel</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userParcels.map((parcel) => (
                                <div key={parcel._id} className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 hover:shadow-3xl transition-all duration-300">
                                    {/* Parcel Header */}
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                            <FaBox className="text-2xl text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800">{parcel.title}</h3>
                                            <p className="text-sm text-gray-500">ID: {parcel.tracking_id}</p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${getStatusColor(parcel.delivery_status)} px-4 py-2 rounded-full border-2 mb-4`}>
                                        {getStatusIcon(parcel.delivery_status)}
                                        <span className="font-semibold text-sm">
                                            {formatStatus(parcel.delivery_status)}
                                        </span>
                                    </div>

                                    {/* Parcel Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 text-lg">📍</span>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">From: <span className="text-gray-900 font-semibold">{parcel.sender_center}</span></span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                <span className="text-red-600 text-lg">🎯</span>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">To: <span className="text-gray-900 font-semibold">{parcel.receiver_center}</span></span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <FaUser className="text-blue-600 text-sm" />
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Receiver: <span className="text-gray-900 font-semibold">{parcel.receiver_name}</span></span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 text-lg font-bold">৳</span>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Cost: <span className="text-green-700 font-bold text-lg">৳{parcel.cost}</span></span>
                                        </div>
                                        {parcel.booking_date && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <FaCalendarAlt className="text-purple-600 text-sm" />
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">
                                                    Booked: <span className="text-gray-900 font-semibold">{new Date(parcel.booking_date).toLocaleDateString()}</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Track Button */}
                                    <button
                                        onClick={() => handleTrackParcel(parcel)}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-3"
                                    >
                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <FaEye className="text-blue-600 text-sm" />
                                        </div>
                                        <span className="text-lg">Track This Parcel</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                /* Tracking Details */
                <>
                    {/* Loading State */}
                    {isTrackingLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loading />
                        </div>
                    )}

                    {/* Error State */}
                    {trackingError && (
                        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-red-100">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">❌</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Tracking Error</h3>
                            <p className="text-gray-600 text-lg mb-8">
                                Unable to fetch tracking information for this parcel.
                            </p>
                            <button
                                onClick={handleBackToList}
                                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 mx-auto"
                            >
                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-red-600 text-lg">🔄</span>
                                </div>
                                <span>Back to Parcels</span>
                            </button>
                        </div>
                    )}

                    {/* No Tracking Data */}
                    {!isTrackingLoading && !trackingError && trackingData.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-gray-100">
                            <div className="text-8xl mb-6 opacity-20">📦</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Tracking Information Yet</h3>
                            <p className="text-gray-600 text-lg mb-8">
                                Tracking information for this parcel is not available yet. It may take a few minutes after booking.
                            </p>
                            <div className="space-y-3 text-sm text-gray-500 mb-8 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <span className="text-blue-500">•</span>
                                    <span>Tracking updates will appear here once processing begins</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-green-500">•</span>
                                    <span>You'll receive notifications for major status changes</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-purple-500">•</span>
                                    <span>Contact support if you have any concerns</span>
                                </div>
                            </div>
                            <button
                                onClick={handleBackToList}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 mx-auto"
                            >
                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <FaArrowLeft className="text-blue-600 text-sm" />
                                </div>
                                <span>Back to Parcels</span>
                            </button>
                        </div>
                    )}

                    {/* Tracking Results */}
                    {!isTrackingLoading && !trackingError && trackingData.length > 0 && (
                        <div className="space-y-8">
                            {/* Parcel Info Header */}
                            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                        <FaBox className="text-2xl text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800">Tracking ID: {selectedParcel?.tracking_id}</h3>
                                        <p className="text-gray-600">Real-time delivery updates</p>
                                    </div>
                                </div>
                                
                                {/* Current Status */}
                                {trackingData.length > 0 && (
                                    <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 rounded-full shadow-lg">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                                            {React.cloneElement(getStatusIcon(trackingData[trackingData.length - 1].status), {
                                                className: "text-green-600 text-xl"
                                            })}
                                        </div>
                                        <span className="font-bold text-lg text-white">
                                            Current Status: {formatStatus(trackingData[trackingData.length - 1].status)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <FaCalendarAlt className="text-blue-600 text-2xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">Delivery Timeline</h3>
                                </div>

                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                                    
                                    {/* Timeline Items */}
                                    <div className="space-y-8">
                                        {trackingData.map((update, index) => (
                                            <div key={index} className="relative flex items-start space-x-6">
                                                {/* Timeline Dot */}
                                                <div className={`relative z-10 w-12 h-12 bg-gradient-to-br ${
                                                    index === trackingData.length - 1 
                                                        ? 'from-green-500 to-emerald-600' 
                                                        : 'from-blue-500 to-purple-600'
                                                } rounded-full flex items-center justify-center shadow-lg`}>
                                                    {getStatusIcon(update.status)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className={`p-6 rounded-xl border-2 ${
                                                        index === trackingData.length - 1 
                                                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                                                            : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                                                    }`}>
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="text-xl font-bold text-gray-800">
                                                                {formatStatus(update.status)}
                                                            </h4>
                                                            {index === trackingData.length - 1 && (
                                                                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                                    Current
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        {update.details && (
                                                            <p className="text-gray-700 mb-3 text-lg">{update.details}</p>
                                                        )}
                                                        
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                                                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <FaCalendarAlt className="text-blue-600 text-xs" />
                                                                </div>
                                                                <span className="font-medium">
                                                                    {new Date(update.timestamp).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                                                    <FaClock className="text-green-600 text-xs" />
                                                                </div>
                                                                <span className="font-medium">
                                                                    {new Date(update.timestamp).toLocaleTimeString('en-US', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            {update.updated_by && (
                                                                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                                                                    <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                                                                        <FaUser className="text-white text-xs" />
                                                                    </div>
                                                                    <span className="font-medium">Updated by: {update.updated_by}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border border-blue-200">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <span className="text-3xl text-white">❓</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
                                    <p className="text-gray-600 mb-6">
                                        If you have any questions about your delivery or need assistance, don't hesitate to contact us.
                                    </p>
                                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <span className="text-blue-600 text-lg">📞</span>
                                            </div>
                                            <span>Contact Support</span>
                                        </button>
                                        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <span className="text-purple-600 text-lg">💬</span>
                                            </div>
                                            <span>Live Chat</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TrackParcel;

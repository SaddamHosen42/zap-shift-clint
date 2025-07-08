import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-parcels", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const navigate = useNavigate();

  const handlePay = (id) => {
    console.log("Proceed to payment for:", id);
    navigate(`/dashboard/payment/${id}`);
  };

  const handleView = (id) => {
    console.log("Viewing parcel:", id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Parcel has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          refetch();
        }
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to delete parcel", "error");
      }
    }
  };

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2 flex items-center">
            <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4 text-black">
              📦
            </span>
            My Parcels
          </h1>
          <p className="text-lg text-gray-600">Manage and track your parcel deliveries</p>
          {parcels?.length > 0 && (
            <div className="mt-4 inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Total Parcels: {parcels.length}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium text-gray-600">Loading your parcels...</span>
              </div>
            </div>
          </div>
        ) : parcels.length > 0 ? (
          /* Parcels Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {parcels.map((parcel, index) => (
              <div 
                key={parcel._id} 
                className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary truncate max-w-[200px]" title={parcel.title}>
                        {parcel.title}
                      </h3>
                      <span className="text-sm text-gray-500 capitalize">{parcel.type}</span>
                    </div>
                  </div>
                  
                  {/* Payment Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    parcel.payment_status === "paid" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {parcel.payment_status === "paid" ? "✓ Paid" : "⏳ Unpaid"}
                  </span>
                </div>

                {/* Card Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Created</span>
                    <span className="font-medium text-sm">{formatDate(parcel.creation_date).split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Cost</span>
                    <span className="font-bold text-lg text-primary">৳{parcel.cost}</span>
                  </div>
                  {parcel.recipientName && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 text-sm">Recipient</span>
                      <span className="font-medium text-sm">{parcel.recipientName}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  {parcel.payment_status === "unpaid" && (
                    <button
                      onClick={() => handlePay(parcel._id)}
                      className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z"/>
                      </svg>
                      Pay Now
                    </button>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(parcel._id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      View
                    </button>
                    
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 rounded-xl transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L7.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l1.293 1.293a1 1 0 001.414-1.414L10.414 12l1.293-1.293z" clipRule="evenodd"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-200 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Parcels Found</h3>
            <p className="text-gray-500 mb-6">You haven't booked any parcels yet. Start by sending your first parcel!</p>
            <button 
              onClick={() => navigate('/dashboard/send-parcel')}
              className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              Send Your First Parcel
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {parcels?.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Parcels</p>
                  <p className="text-2xl font-bold text-secondary">{parcels.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Paid Parcels</p>
                  <p className="text-2xl font-bold text-green-600">
                    {parcels.filter(p => p.payment_status === 'paid').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l6-6z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Unpaid Parcels</p>
                  <p className="text-2xl font-bold text-red-600">
                    {parcels.filter(p => p.payment_status === 'unpaid').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Cost</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ৳{parcels.reduce((sum, p) => sum + p.cost, 0).toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParcels;

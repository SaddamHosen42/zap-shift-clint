import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Loading from "../../components/Loading";
import { 
  FaBox, 
  FaSearch, 
  FaMoneyBillWave, 
  FaTruck, 
  FaCheckCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFilter,
  FaClock,
  FaDollarSign
} from "react-icons/fa";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const email = user?.email;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: parcels = [], isLoading, error } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/rider/completed-parcels?email=${email}`
      );
      return res.data;
    },
  });

  const calculateEarning = (parcel) => {
    const cost = Number(parcel.cost);
    if (parcel.sender_center === parcel.receiver_center) {
      return cost * 0.8;
    } else {
      return cost * 0.3;
    }
  };

  // Calculate summary statistics
  const totalDeliveries = parcels.length;
  const totalEarnings = parcels.reduce((sum, parcel) => sum + calculateEarning(parcel), 0);
  const cashedOut = parcels.filter(p => p.cashout_status === "cashed_out").length;
  const pendingCashout = totalDeliveries - cashedOut;

  // Filter parcels based on search term and status
  const filteredParcels = parcels.filter(parcel => {
    const matchesSearch = 
      parcel.tracking_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.sender_center?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiver_center?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "cashed_out" && parcel.cashout_status === "cashed_out") ||
      (statusFilter === "pending" && parcel.cashout_status !== "cashed_out");

    return matchesSearch && matchesStatus;
  });

  // Mutation for cashout
  const { mutateAsync: cashout, isPending: isCashingOut } = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["completedDeliveries"]);
    },
  });

  const handleCashout = (parcelId) => {
    Swal.fire({
      title: "💰 Confirm Cashout",
      html: `
        <div class="text-center">
          <div class="text-4xl mb-4">💰</div>
          <p class="text-gray-600">You are about to cash out this delivery earnings.</p>
          <p class="text-sm text-blue-600 mt-2">This action cannot be undone.</p>
        </div>
      `,
      icon: null,
      showCancelButton: true,
      confirmButtonText: "💳 Cash Out",
      cancelButtonText: "❌ Cancel",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      customClass: {
        popup: "rounded-2xl shadow-2xl border-0",
        confirmButton: "rounded-lg px-6 py-3 font-semibold",
        cancelButton: "rounded-lg px-6 py-3 font-semibold"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        cashout(parcelId)
          .then(() => {
            Swal.fire({
              title: "🎉 Success!",
              text: "Your earnings have been cashed out successfully!",
              icon: "success",
              confirmButtonColor: "#10b981",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              customClass: {
                popup: "rounded-2xl shadow-2xl border-0"
              }
            });
          })
          .catch(() => {
            Swal.fire({
              title: "❌ Error",
              text: "Failed to cash out. Please try again.",
              icon: "error",
              confirmButtonColor: "#ef4444",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              customClass: {
                popup: "rounded-2xl shadow-2xl border-0"
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
          <p className="text-gray-600 mb-6">Failed to load delivery data. Please check your connection.</p>
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
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                🚚 Completed Deliveries
              </h1>
              <p className="text-gray-600 text-lg">Track your delivery earnings and cash out your payments</p>
            </div>
            <div className="hidden md:block text-6xl opacity-10 text-blue-500">
              <FaTruck />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Deliveries</p>
                  <p className="text-3xl font-bold">{totalDeliveries}</p>
                </div>
                <FaBox className="text-3xl text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold">৳{totalEarnings.toFixed(2)}</p>
                </div>
                <FaDollarSign className="text-3xl text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Cashed Out</p>
                  <p className="text-3xl font-bold">{cashedOut}</p>
                </div>
                <FaCheckCircle className="text-3xl text-emerald-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending Cashout</p>
                  <p className="text-3xl font-bold">{pendingCashout}</p>
                </div>
                <FaClock className="text-3xl text-orange-200" />
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tracking ID, title, or location..."
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
                <option value="cashed_out">Cashed Out</option>
                <option value="pending">Pending Cashout</option>
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
            {searchTerm || statusFilter !== "all" ? "No Matching Deliveries" : "No Completed Deliveries"}
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria" 
              : "Complete your first delivery to see it here"}
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
                  <th className="px-6 py-4 text-left font-semibold">📦 Parcel Info</th>
                  <th className="px-6 py-4 text-left font-semibold">📍 Route</th>
                  <th className="px-6 py-4 text-left font-semibold">📅 Timeline</th>
                  <th className="px-6 py-4 text-left font-semibold">💰 Earnings</th>
                  <th className="px-6 py-4 text-left font-semibold">💳 Cashout</th>
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
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-500">📍</span>
                          <span className="text-sm font-medium text-gray-700">From: {parcel.sender_center}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-red-500">🎯</span>
                          <span className="text-sm font-medium text-gray-700">To: {parcel.receiver_center}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-blue-500" />
                          <div>
                            <p className="text-xs text-gray-500">Picked</p>
                            <p className="text-sm font-medium">
                              {parcel.picked_at
                                ? new Date(parcel.picked_at).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaCheckCircle className="text-green-500" />
                          <div>
                            <p className="text-xs text-gray-500">Delivered</p>
                            <p className="text-sm font-medium">
                              {parcel.delivered_at
                                ? new Date(parcel.delivered_at).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Fee: ৳{parcel.cost}</div>
                        <div className="text-2xl font-bold text-green-600">
                          ৳{calculateEarning(parcel).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {parcel.sender_center === parcel.receiver_center ? '80% of fee' : '30% of fee'}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6">
                      {parcel.cashout_status === "cashed_out" ? (
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full border border-green-200">
                          <FaCheckCircle className="text-green-600" />
                          <span className="font-semibold">Cashed Out</span>
                        </div>
                      ) : (
                        <button
                          className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                          onClick={() => handleCashout(parcel._id)}
                          disabled={isCashingOut}
                        >
                          <FaMoneyBillWave className="group-hover:animate-bounce" />
                          <span>{isCashingOut ? "Processing..." : "Cash Out"}</span>
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
          Showing {filteredParcels.length} of {totalDeliveries} deliveries
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

export default CompletedDeliveries;

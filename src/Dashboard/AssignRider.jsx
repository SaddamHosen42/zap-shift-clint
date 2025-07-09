import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaMotorcycle,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaBox,
} from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import useTrackingLogger from "../hooks/useTrackingLogger";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const { user } = useAuth();
  const { logTracking } = useTrackingLogger();
  const queryClient = useQueryClient();

  const {
    data: parcels = [],
    isLoading,
    error: parcelsError,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(
          "/parcels?payment_status=paid&delivery_status=not_collected"
        );
        // Sort oldest first
        return res.data.sort(
          (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
        );
      } catch (error) {
        console.error("Error fetching parcels:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  const { mutateAsync: assignRider, isLoading: isAssigning } = useMutation({
    mutationFn: async ({ parcelId, rider }) => {
      try {
        setSelectedRider(rider);
        const res = await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
          riderId: rider._id,
          riderName: rider.name,
          riderEmail: rider.email,
        });
        return res.data;
      } catch (error) {
        console.error("Error assigning rider:", error);
        throw error;
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["assignableParcels"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Rider assigned successfully!",
        confirmButtonText: "OK",
      });
      // track rider assigned
      await logTracking({
        tracking_id: selectedParcel.tracking_id,
        status: "rider_assigned",
        details: `Assigned to ${selectedRider.name}`,
        updated_by: user.email,
      });
      document.getElementById("assignModal").close();
    },
    onError: (error) => {
      console.error("Assignment error:", error);
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text:
          error.response?.data?.message ||
          "Failed to assign rider. Please try again.",
        confirmButtonText: "OK",
      });
    },
  });

  // Step 2: Open modal and load matching riders
  const openAssignModal = async (parcel) => {
    setSelectedParcel(parcel);
    setLoadingRiders(true);
    setRiders([]);

    try {
      const res = await axiosSecure.get("/riders/available", {
        params: {
          district: parcel.sender_center, // match with rider.district
        },
      });
      setRiders(res.data || []);
    } catch (error) {
      console.error("Error fetching riders:", error);
      setRiders([]);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Riders",
        text:
          error.response?.data?.message ||
          "Unable to load available riders. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoadingRiders(false);
      document.getElementById("assignModal").showModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Assign Rider
              </h1>
              <p className="text-gray-600 text-lg">
                Manage parcel assignments to delivery riders
              </p>
            </div>
            <div className="flex items-center space-x-6">
              {/* Total Parcels Card - Inline with Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">📦</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">
                      Total Parcels
                    </p>
                    <p className="text-2xl font-bold">{parcels.length}</p>
                  </div>
                </div>
              </div>

              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <FaMotorcycle className="text-3xl text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Parcels Section */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading parcels...</p>
          </div>
        ) : parcelsError ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Error Loading Parcels
            </h3>
            <p className="text-red-500 mb-4">
              {parcelsError.response?.data?.message ||
                "Unable to load parcels. Please check your connection and try again."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        ) : parcels.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Parcels Available
            </h3>
            <p className="text-gray-500">
              No parcels are available for assignment at the moment.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white">
                Available Parcels
              </h2>
              <p className="text-green-100">
                Click "Assign Rider" to assign a delivery rider
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Tracking ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Parcel Info
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parcels.map((parcel, index) => (
                    <tr
                      key={parcel._id}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {parcel.tracking_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                            <FaBox className="text-white text-sm" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {parcel.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {parcel.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <FaMapMarkerAlt className="text-green-500 mr-1" />
                            From: {parcel.sender_center}
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-red-500 mr-1" />
                            To: {parcel.receiver_center}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-green-600">
                          ৳{parcel.cost}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(parcel.creation_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openAssignModal(parcel)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          <FaMotorcycle className="mr-2" />
                          Assign Rider
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enhanced Assign Rider Modal */}
        <dialog id="assignModal" className="modal">
          <div className="modal-box max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 -m-6 mb-6 p-6 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white mb-2">
                Assign Rider
              </h3>
              <p className="text-green-100">
                Parcel:{" "}
                <span className="font-semibold">{selectedParcel?.title}</span>
              </p>
            </div>

            {loadingRiders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading available riders...</p>
              </div>
            ) : riders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMotorcycle className="text-2xl text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Available Riders
                </h3>
                <p className="text-red-500">
                  No riders are available in this district at the moment.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 font-medium">
                    Found {riders.length} available rider(s) in{" "}
                    {selectedParcel?.sender_center}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {riders.map((rider) => (
                    <div
                      key={rider._id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-lg" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {rider.name}
                            </h4>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaPhone className="mr-1" />
                              {rider.phone}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaMotorcycle className="mr-1" />
                              {rider.bike_brand} - {rider.bike_registration}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            assignRider({
                              parcelId: selectedParcel._id,
                              rider,
                            })
                          }
                          disabled={isAssigning}
                          className={`transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium py-2 px-4 rounded-lg ${
                            isAssigning
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                          }`}
                        >
                          {isAssigning ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                              Assigning...
                            </>
                          ) : (
                            "Assign"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-action mt-6 pt-6 border-t border-gray-200">
              <form method="dialog">
                <button className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-lg px-6 py-2">
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default AssignRider;

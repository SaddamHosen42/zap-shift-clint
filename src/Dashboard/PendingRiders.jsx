import { useState } from "react";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes, FaUserCheck, FaMotorcycle, FaIdCard, FaPhone } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../components/Loading";

const PendingRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const axiosSecure = useAxiosSecure();

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['pending-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/pending");
            return res.data;
        }
    })

    if (isPending) {
        return <Loading/>;
    }

    const handleDecision = async (id, action,email) => {
        const confirm = await Swal.fire({
            title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            const status= action === "approve" ? "active" : "rejected"
            await axiosSecure.patch(`/riders/${id}/status`, {
                status,
                email
            });

            refetch();

            Swal.fire("Success", `Rider ${action}d successfully`, "success");

        } catch (error) {
            console.error("Error updating rider status:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Could not update rider status. Please try again.",
                confirmButtonText: "OK"
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Pending Riders</h1>
                            <p className="text-gray-600 text-lg">Review and approve rider applications</p>
                        </div>
                        <div className="flex items-center space-x-6">
                            {/* Total Applications Card */}
                            <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">📋</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium opacity-90">Applications</p>
                                        <p className="text-2xl font-bold">{riders.length}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                                <FaUserCheck className="text-3xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Riders Section */}
                {riders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUserCheck className="text-2xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Applications</h3>
                        <p className="text-gray-500">There are no rider applications pending approval at the moment.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6">
                            <h2 className="text-2xl font-bold text-white">Rider Applications</h2>
                            <p className="text-orange-100">Review applications and approve qualified riders</p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Rider Info
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Applied
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {riders.map((rider, index) => (
                                        <tr key={rider._id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                                                        <span className="text-white font-semibold text-lg">
                                                            {rider.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                                                        <div className="text-sm text-gray-500">{rider.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center mb-1">
                                                        <FaPhone className="text-blue-500 mr-2" />
                                                        {rider.phone}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <FaIdCard className="text-green-500 mr-2" />
                                                        Age: {rider.age}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <div className="font-medium">{rider.region}</div>
                                                    <div className="text-gray-500">{rider.district}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    {new Date(rider.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setSelectedRider(rider)}
                                                        className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="mr-1" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecision(rider._id, "approve", rider.email)}
                                                        className="inline-flex items-center px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                                        title="Approve"
                                                    >
                                                        <FaCheck className="mr-1" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecision(rider._id, "reject")}
                                                        className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                                                        title="Reject"
                                                    >
                                                        <FaTimes className="mr-1" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Enhanced Modal for viewing rider details */}
                {selectedRider && (
                    <dialog id="riderDetailsModal" className="modal modal-open">
                        <div className="modal-box max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100">
                            <div className="bg-gradient-to-r from-orange-500 to-pink-600 -m-6 mb-6 p-6 rounded-t-2xl">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Rider Application Details
                                </h3>
                                <p className="text-orange-100">
                                    Review complete information for {selectedRider.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FaUserCheck className="mr-2 text-orange-500" />
                                        Personal Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium">{selectedRider.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium">{selectedRider.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium">{selectedRider.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Age:</span>
                                            <span className="font-medium">{selectedRider.age}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">NID:</span>
                                            <span className="font-medium">{selectedRider.nid}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle & Location */}
                                <div className="bg-blue-50 p-6 rounded-xl">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <FaMotorcycle className="mr-2 text-blue-500" />
                                        Vehicle & Location
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Bike Brand:</span>
                                            <span className="font-medium">{selectedRider.bike_brand}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Registration:</span>
                                            <span className="font-medium">{selectedRider.bike_registration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Region:</span>
                                            <span className="font-medium">{selectedRider.region}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">District:</span>
                                            <span className="font-medium">{selectedRider.district}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Applied:</span>
                                            <span className="font-medium">{new Date(selectedRider.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            {selectedRider.note && (
                                <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                                    <h4 className="font-semibold text-gray-800 mb-2">Additional Notes:</h4>
                                    <p className="text-gray-700">{selectedRider.note}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                                <button
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                                    onClick={() => setSelectedRider(null)}
                                >
                                    Close
                                </button>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            handleDecision(selectedRider._id, "approve", selectedRider.email);
                                            setSelectedRider(null);
                                        }}
                                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                                    >
                                        <FaCheck className="inline mr-2" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDecision(selectedRider._id, "reject");
                                            setSelectedRider(null);
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
                                    >
                                        <FaTimes className="inline mr-2" />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </dialog>
                )}
            </div>
        </div>
    );
};

export default PendingRiders;
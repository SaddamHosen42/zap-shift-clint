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
    <div className="container mt-10 w-[80%] mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-primary">
        📦 My Parcels
      </h1>

      {/* ✅ Make table scrollable on small screens */}

      <div className="overflow-x-auto mt-10">
        <table className="table w-full text-sm md:text-base border">
          <thead className="bg-primary text-gray-700 font-semibold">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  <span className="loading loading-spinner text-primary"></span>
                </td>
              </tr>
            ) : parcels.length > 0 ? (
              parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td className="max-w-[140px] truncate">{parcel.title}</td>
                  <td className="capitalize">{parcel.type}</td>
                  <td>{formatDate(parcel.creation_date)}</td>
                  <td>৳{parcel.cost}</td>
                  <td>
                    <span
                      className={`badge px-3 py-1 text-white ${
                        parcel.payment_status === "paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {parcel.payment_status}
                    </span>
                  </td>
                  <td className="space-x-2 flex justify-between items-center mt-3 lg:mt-0">
                    <button
                      onClick={() => handleView(parcel._id)}
                      className="btn btn-xs btn-outline"
                    >
                      View
                    </button>
                    {parcel.payment_status === "unpaid" && (
                      <button
                        onClick={() => handlePay(parcel._id)}
                        className="btn btn-xs btn-primary text-black"
                      >
                        Pay
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(parcel._id)}
                      className="btn btn-xs btn-error text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  🚫 No parcels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;

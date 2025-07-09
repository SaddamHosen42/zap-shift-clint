import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useLoaderData, useNavigate } from "react-router";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { calculateDeliveryCost } from "../../utils/calculateCost";
import useTrackingLogger from "../../hooks/useTrackingLogger";

const generateTrackingID = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`;
};

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();
  const navigate = useNavigate();
  const { logTracking } = useTrackingLogger();

  // Extract unique regions
  const uniqueRegions = [...new Set(serviceCenters.map((w) => w.region))];
  // Get districts by region
  const getDistrictsByRegion = (region) =>
    serviceCenters.filter((w) => w.region === region).map((w) => w.district);

  const parcelType = watch("type");
  const senderRegion = watch("sender_region");
  const receiverRegion = watch("receiver_region");

  const onSubmit = (data) => {
    const weight = parseFloat(data.weight) || 0;
    // console.log(weight);

    const isSameDistrict = data.sender_center === data.receiver_center;

    const { baseCost, extraCost, totalCost, breakdown } = calculateDeliveryCost(
      data.type,
      weight,
      isSameDistrict
    );

    Swal.fire({
      title: "Delivery Cost Breakdown",
      icon: "info",
      html: `
      <div class="text-left text-base space-y-2">
        <p><strong>Parcel Type:</strong> ${data.type}</p>
        <p><strong>Weight:</strong> ${weight} kg</p>
        <p><strong>Delivery Zone:</strong> ${
          isSameDistrict ? "Within Same District" : "Outside District"
        }</p>
        <hr class="my-2"/>
        <p><strong>Base Cost:</strong> ৳${baseCost}</p>
        ${
          extraCost > 0
            ? `<p><strong>Extra Charges:</strong> ৳${extraCost}</p>`
            : ""
        }
        <div class="text-gray-500 text-sm">${breakdown}</div>
        <hr class="my-2"/>
        <p class="text-xl font-bold text-green-600">Total Cost: ৳${totalCost}</p>
      </div>
    `,
      showDenyButton: true,
      confirmButtonText: "💳 Proceed to Payment",
      denyButtonText: "✏️ Continue Editing",
      confirmButtonColor: "#16a34a",
      denyButtonColor: "#d3d3d3",
      customClass: {
        popup: "rounded-xl shadow-md px-6 py-6",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const tracking_id = generateTrackingID();
        const parcelData = {
          ...data,
          cost: totalCost,
          created_by: user.email,
          payment_status: "unpaid",
          delivery_status: "not_collected",
          creation_date: new Date().toISOString(),
          tracking_id: tracking_id,
        };

        //console.log("Ready for payment:", parcelData);

        axiosSecure.post("/parcels", parcelData).then(async (res) => {
          console.log(res.data);
          if (res.data.insertedId) {
            Swal.fire({
              title: "Redirecting...",
              text: "Proceeding to payment gateway.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            // Log the tracking event
            await logTracking({
              tracking_id: parcelData.tracking_id,
              status: "parcel_created",
              details: `Created by ${user.displayName}`,
              updated_by: user.email,
            });

            navigate(`/dashboard/payment/${res.data.insertedId}`);
            reset(); // Reset form after successful submission
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to send parcel. Please try again.",
              icon: "error",
            });
          }
        });
      }
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 max-w-7xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold text-primary">Send a Parcel</h2>
          <p className="text-gray-500">
            Please provide accurate delivery details
          </p>
        </div>

        {/* Parcel Info */}
        <section className="bg-white p-6 rounded-2xl shadow space-y-5 border">
          <h3 className="text-2xl font-semibold text-primary">
            📦 Parcel Info
          </h3>

          {/* Parcel Name */}
          <div>
            <label className="label font-medium">Parcel Name</label>
            <input
              {...register("title", { required: true })}
              placeholder="e.g., Books, Electronics..."
              className="input input-bordered w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">Parcel name is required</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="label font-medium">Type</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="document"
                  {...register("type", { required: true })}
                  className="radio"
                />
                Document
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="non-document"
                  {...register("type", { required: true })}
                  className="radio"
                />
                Non-Document
              </label>
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm">Parcel type is required</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="label font-medium">Weight (kg)</label>
            <input
              type="number"
              {...register("weight")}
              disabled={parcelType !== "non-document"}
              placeholder="Enter weight (only for non-documents)"
              className={`input input-bordered w-full ${
                parcelType !== "non-document"
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>
        </section>

        {/* Sender and Receiver Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sender Info */}
          <section className="bg-white p-6 rounded-2xl shadow space-y-4 border">
            <h3 className="text-2xl font-semibold text-primary">
              📤 Sender Info
            </h3>
            <div className="space-y-4">
              <input
                {...register("sender_name", { required: true })}
                className="input input-bordered w-full"
                placeholder="Full Name"
              />
              <input
                {...register("sender_contact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Phone Number"
              />
              <select
                {...register("sender_region", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <select
                {...register("sender_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {getDistrictsByRegion(senderRegion).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <input
                {...register("sender_address", { required: true })}
                className="input input-bordered w-full"
                placeholder="Street Address"
              />
              <textarea
                {...register("pickup_instruction", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Special Pickup Instructions"
              />
            </div>
          </section>

          {/* Receiver Info */}
          <section className="bg-white p-6 rounded-2xl shadow space-y-4 border">
            <h3 className="text-2xl font-semibold text-primary">
              📥 Receiver Info
            </h3>
            <div className="space-y-4">
              <input
                {...register("receiver_name", { required: true })}
                className="input input-bordered w-full"
                placeholder="Full Name"
              />
              <input
                {...register("receiver_contact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Phone Number"
              />
              <select
                {...register("receiver_region", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <select
                {...register("receiver_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {getDistrictsByRegion(receiverRegion).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <input
                {...register("receiver_address", { required: true })}
                className="input input-bordered w-full"
                placeholder="Street Address"
              />
              <textarea
                {...register("delivery_instruction", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Special Delivery Instructions"
              />
            </div>
          </section>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-8">
          <button className="btn btn-primary text-black px-8 text-lg font-semibold">
            📨 Submit Parcel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;

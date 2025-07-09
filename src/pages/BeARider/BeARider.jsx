import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import { useLoaderData } from "react-router";
import riderImg from "../../assets/agent-pending.png";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [selectedRegion, setSelectedRegion] = useState("");

  const regions = [...new Set(serviceCenters.map((s) => s.region))];
  const districts = serviceCenters
    .filter((s) => s.region === selectedRegion)
    .map((s) => s.district);

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user?.displayName || "",
      email: user?.email || "",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    console.log("Rider Application:", riderData);

    try {
      const res = await axiosSecure.post("/riders", riderData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your application is pending approval.",
        });
        reset();
      }
    } catch (error) {
      console.error("Error submitting rider application:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Unable to submit your application. Please try again later or contact support.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Be a Rider</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Tell us about yourself
              </h2>
              <p className="text-gray-600">
                Fill out the application form to become a delivery rider
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* User Info Section */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white text-sm">
                    ✓
                  </span>
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user?.displayName || ""}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your age"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                      errors.age
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    {...register("age", { required: true, min: 18 })}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">
                      You must be 18 or older
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                      errors.phone
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    {...register("phone", { required: true })}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      Phone number is required
                    </p>
                  )}
                </div>
              </div>

              {/* National ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National ID Card Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your NID number"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    errors.nid
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-green-500"
                  }`}
                  {...register("nid", { required: true })}
                />
                {errors.nid && (
                  <p className="text-red-500 text-sm mt-1">NID is required</p>
                )}
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Region
                  </label>
                  <select
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white ${
                      errors.region
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    {...register("region", { required: true })}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="">Select your region</option>
                    {regions.map((region, idx) => (
                      <option key={idx} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="text-red-500 text-sm mt-1">
                      Region is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <select
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white ${
                      errors.district
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    } ${!selectedRegion ? "opacity-50" : ""}`}
                    {...register("district", { required: true })}
                    disabled={!selectedRegion}
                  >
                    <option value="">Select district</option>
                    {districts.map((district, idx) => (
                      <option key={idx} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">
                      District is required
                    </p>
                  )}
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-blue-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-sm">
                    🏍️
                  </span>
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bike Brand & Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Yamaha FZ-S"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white ${
                        errors.bike_brand
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      {...register("bike_brand", { required: true })}
                    />
                    {errors.bike_brand && (
                      <p className="text-red-500 text-sm mt-1">
                        Bike brand is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., DHK-1234"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white ${
                        errors.bike_registration
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      {...register("bike_registration", { required: true })}
                    />
                    {errors.bike_registration && (
                      <p className="text-red-500 text-sm mt-1">
                        Registration number is required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which warehouse you want to work?
                </label>
                <textarea
                  placeholder="Tell us about your experience, availability, or any additional information..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all duration-300 resize-none h-24"
                  {...register("note")}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Submit Application
              </button>
            </form>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex flex-col items-center justify-center text-center lg:sticky lg:top-8">
            <div className="w-full max-w-md mb-8">
              <div className="relative">
                {/* Rider Illustration */}
                <img src={riderImg} alt="RiderImg" />
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-6 w-full max-w-sm">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Earn Well</h3>
                    <p className="text-sm text-gray-600">
                      Competitive pay rates
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Flexible Hours
                    </h3>
                    <p className="text-sm text-gray-600">Work when you want</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Grow Career</h3>
                    <p className="text-sm text-gray-600">Training & support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeARider;

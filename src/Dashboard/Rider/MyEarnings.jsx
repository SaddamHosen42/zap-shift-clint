import React, { useState } from "react";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isAfter,
} from "date-fns";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading";
import {
  FaDollarSign,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendar,
  FaChartLine,
  FaTruck,
  FaBox,
  FaWallet,
  FaCoins,
  FaFilter,
} from "react-icons/fa";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;
  const [viewMode, setViewMode] = useState("overview"); // 'overview', 'detailed'

  const {
    data: parcels = [],
    isLoading,
    error,
  } = useQuery({
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
    return parcel.sender_center === parcel.receiver_center
      ? cost * 0.8
      : cost * 0.3;
  };

  // Filtered earnings
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);

  let total = 0,
    totalCashedOut = 0,
    totalPending = 0,
    today = 0,
    week = 0,
    month = 0,
    year = 0;

  // Additional stats
  let totalDeliveries = parcels.length;
  let cashedOutCount = 0;
  let pendingCount = 0;

  parcels.forEach((p) => {
    const earning = calculateEarning(p);
    const deliveredAt = new Date(p.delivered_at);
    total += earning;
    if (p.cashout_status === "cashed_out") {
      totalCashedOut += earning;
      cashedOutCount++;
    } else {
      totalPending += earning;
      pendingCount++;
    }

    if (isAfter(deliveredAt, todayStart)) today += earning;
    if (isAfter(deliveredAt, weekStart)) week += earning;
    if (isAfter(deliveredAt, monthStart)) month += earning;
    if (isAfter(deliveredAt, yearStart)) year += earning;
  });

  const averagePerDelivery = totalDeliveries > 0 ? total / totalDeliveries : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Connection Error
          </h3>
          <p className="text-gray-600 mb-6">
            Failed to load earnings data. Please check your connection.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaWallet className="text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-4xl pb-1 font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    My Earnings
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Track your delivery earnings and financial performance
                  </p>
                </div>
              </div>
              <div className="hidden lg:block text-8xl opacity-10 text-green-500">
                <FaChartLine />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 mb-6">
              <FaFilter className="text-gray-400" />
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("overview")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === "overview"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setViewMode("detailed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === "detailed"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                >
                  📈 Detailed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-green-100 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FaDollarSign className="text-2xl text-white" />
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">
                  ৳{total.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              From {totalDeliveries} deliveries • ৳
              {averagePerDelivery.toFixed(2)} average
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-blue-100 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-white" />
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Cashed Out</p>
                <p className="text-3xl font-bold text-blue-600">
                  ৳{totalCashedOut.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {cashedOutCount} deliveries •{" "}
              {totalDeliveries > 0
                ? ((cashedOutCount / totalDeliveries) * 100).toFixed(1)
                : 0}
              % of total
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-orange-100 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <FaClock className="text-2xl text-white" />
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Pending Cashout</p>
                <p className="text-3xl font-bold text-orange-600">
                  ৳{totalPending.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {pendingCount} deliveries • Available for cashout
            </div>
          </div>
        </div>

        {/* Time-based Earnings */}
        {viewMode === "overview" && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <FaCalendar className="text-2xl text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">
                Earnings Timeline
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <FaCalendarDay className="text-2xl text-green-600" />
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Today</p>
                    <p className="text-2xl font-bold text-green-700">
                      ৳{today.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${total > 0 ? (today / total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <FaCalendarWeek className="text-2xl text-blue-600" />
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      This Week
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      ৳{week.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${total > 0 ? (week / total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <FaCalendar className="text-2xl text-purple-600" />
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      This Month
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      ৳{month.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${total > 0 ? (month / total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <FaChartLine className="text-2xl text-teal-600" />
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      This Year
                    </p>
                    <p className="text-2xl font-bold text-teal-700">
                      ৳{year.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-teal-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Performance Stats */}
        {viewMode === "detailed" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <FaBox className="text-2xl text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Delivery Performance
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <FaTruck className="text-blue-600" />
                    <span className="font-medium text-gray-700">
                      Total Deliveries
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalDeliveries}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <FaCoins className="text-green-600" />
                    <span className="font-medium text-gray-700">
                      Average per Delivery
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{averagePerDelivery.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <FaMoneyBillWave className="text-purple-600" />
                    <span className="font-medium text-gray-700">
                      Cashout Rate
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {totalDeliveries > 0
                      ? ((cashedOutCount / totalDeliveries) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <FaChartLine className="text-2xl text-green-600" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Financial Breakdown
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      Cashout Progress
                    </span>
                    <span className="text-sm text-gray-500">
                      ৳{totalCashedOut.toFixed(2)} / ৳{total.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          total > 0 ? (totalCashedOut / total) * 100 : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {total > 0
                      ? ((totalCashedOut / total) * 100).toFixed(1)
                      : 0}
                    % of total earnings cashed out
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      Pending Amount
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      ৳{totalPending.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Available for immediate cashout
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Earnings State */}
        {totalDeliveries === 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="text-8xl mb-6 opacity-20">💰</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No Earnings Yet
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Complete your first delivery to start earning!
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <FaTruck className="text-2xl" />
              <span>Start delivering to see your earnings here</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEarnings;

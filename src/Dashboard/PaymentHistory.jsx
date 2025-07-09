import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Loading from "../components/Loading";

const formatDate = (iso) => new Date(iso).toLocaleString();

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2 flex items-center">
            <span className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4 text-black">
              💳
            </span>
            Payment History
          </h1>
          <p className="text-lg text-gray-600">
            Track all your parcel delivery payments
          </p>
          {payments?.length > 0 && (
            <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Total Payments: {payments.length}
            </div>
          )}
        </div>

        {/* Payment Cards */}
        {payments?.length > 0 ? (
          <div className="grid gap-6">
            {payments.map((payment, index) => (
              <div
                key={payment.transactionId}
                className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Payment Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-secondary">
                          Payment #{index + 1}
                        </h3>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Completed
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 block">Parcel ID</span>
                          <span
                            className="font-medium text-gray-800"
                            title={payment.parcelId}
                          >
                            {payment.parcelId?.length > 15
                              ? `${payment.parcelId.substring(0, 15)}...`
                              : payment.parcelId}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">
                            Payment Date
                          </span>
                          <span className="font-medium text-gray-800">
                            {formatDate(payment.paid_at_string)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Method</span>
                          <span className="font-medium text-gray-800 capitalize">
                            {payment.paymentMethod?.[0] || "Card"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Amount & Transaction */}
                  <div className="lg:text-right">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {payment.amount} Tk
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <span className="text-xs text-gray-500 block mb-1">
                        Transaction ID
                      </span>
                      <code
                        className="text-sm font-mono text-gray-700 cursor-pointer hover:text-primary transition-colors"
                        title={payment.transactionId}
                        onClick={() =>
                          navigator.clipboard.writeText(payment.transactionId)
                        }
                      >
                        {payment.transactionId?.length > 20
                          ? `${payment.transactionId.substring(0, 20)}...`
                          : payment.transactionId}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(payment.transactionId)
                    }
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy Transaction ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-200 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No Payment History
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't made any payments yet. Start by booking a parcel
              delivery!
            </p>
            <button className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
              Book Your First Parcel
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {payments?.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Payments</p>
                  <p className="text-2xl font-bold text-secondary">
                    {payments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}{" "}
                    Tk
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Last Payment</p>
                  <p className="text-lg font-bold text-purple-600">
                    {payments.length > 0
                      ? formatDate(payments[0].paid_at_string).split(",")[0]
                      : "N/A"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
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

export default PaymentHistory;

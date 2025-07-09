import React from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../logo/logo";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaHome,
  FaMoneyCheckAlt,
  FaMotorcycle,
  FaSearchLocation,
  FaTasks,
  FaUserCheck,
  FaUserClock,
  FaUserEdit,
  FaUserShield,
  FaWallet,
  FaSignOutAlt,
  FaBars,
  FaUser,
} from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const DashboardLayout = () => {
  const { isAdmin, roleLoading, isRider } = useUserRole();
   const { user, logOut } = useAuth();

  const handleLogOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            Swal.fire({
              title: "Logged Out!",
              text: "You have been successfully logged out.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: "Error!",
              text: "Something went wrong during logout.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Modern Mobile Navbar */}
        <div className="navbar bg-white shadow-lg lg:hidden border-b">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-ghost btn-circle"
            >
              <FaBars className="h-5 w-5 text-gray-600" />
            </label>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          </div>
          <div className="flex-none flex items-center space-x-3">
            {/* User Profile in Mobile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {user?.photoURL || user?.photo ? (
                  <img
                    src={user?.photoURL || user?.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.querySelector(
                        ".mobile-fallback-icon"
                      ).style.display = "block";
                    }}
                  />
                ) : null}
                <FaUser
                  className={`mobile-fallback-icon text-gray-500 text-sm ${
                    user?.photoURL || user?.photo ? "hidden" : "block"
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.displayName ||
                  user?.name ||
                  user?.email?.split("@")[0] ||
                  "User"}
              </span>
            </div>
            <button
              onClick={handleLogOut}
              className="btn btn-ghost btn-circle text-red-500 hover:bg-red-50"
            >
              <FaSignOutAlt className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page content with better background */}
        <div className="flex-1 bg-gray-50 min-h-screen">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        {/* Beautiful Modern Sidebar */}
        <div className="bg-white min-h-full w-80 shadow-2xl">
          {/* Sidebar Header */}
          <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700">
            <div className="mb-4">
              <Logo />
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden border-2 border-white border-opacity-30">
                {user?.photoURL || user?.photo ? (
                  <img
                    src={user?.photoURL || user?.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.querySelector(
                        ".fallback-icon"
                      ).style.display = "block";
                    }}
                  />
                ) : null}
                <FaUser
                  className={`fallback-icon text-white text-2xl ${
                    user?.photoURL || user?.photo ? "hidden" : "block"
                  }`}
                />
              </div>
              <h3 className="text-white font-bold text-xl">
                {user?.displayName ||
                  user?.name ||
                  user?.email?.split("@")[0] ||
                  "User"}
              </h3>
              <p className="text-blue-100 text-sm">
                Welcome to your dashboard!
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
            <nav className="space-y-2">
              {/* Main Navigation */}
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }
                `}
              >
                <FaHome className="text-lg" />
                <span className="font-medium">Dashboard</span>
              </NavLink>

              <NavLink
                to="/dashboard/myParcels"
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-700 border-l-4 border-orange-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }
                `}
              >
                <FaBoxOpen className="text-lg" />
                <span className="font-medium">My Parcels</span>
              </NavLink>

              <NavLink
                to="/dashboard/paymentHistory"
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }
                `}
              >
                <FaMoneyCheckAlt className="text-lg" />
                <span className="font-medium">Payment History</span>
              </NavLink>

              <NavLink
                to="/dashboard/track"
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }
                `}
              >
                <FaSearchLocation className="text-lg" />
                <span className="font-medium">Track Package</span>
              </NavLink>

              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }
                `}
              >
                <FaUserEdit className="text-lg" />
                <span className="font-medium">Update Profile</span>
              </NavLink>

              {/* Rider Navigation */}
              {isRider && !roleLoading && (
                <>
                  <div className="my-6">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
                      Rider Dashboard
                    </h4>
                    <div className="space-y-2">
                      <NavLink
                        to="/dashboard/pending-deliveries"
                        className={({ isActive }) => `
                          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-orange-50 text-orange-700 border-l-4 border-orange-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }
                        `}
                      >
                        <FaTasks className="text-lg" />
                        <span className="font-medium">Pending Deliveries</span>
                      </NavLink>

                      <NavLink
                        to="/dashboard/completed-deliveries"
                        className={({ isActive }) => `
                          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-green-50 text-green-700 border-l-4 border-green-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }
                        `}
                      >
                        <FaCheckCircle className="text-lg" />
                        <span className="font-medium">
                          Completed Deliveries
                        </span>
                      </NavLink>

                      <NavLink
                        to="/dashboard/my-earnings"
                        className={({ isActive }) => `
                          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-yellow-50 text-yellow-700 border-l-4 border-yellow-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }
                        `}
                      >
                        <FaWallet className="text-lg" />
                        <span className="font-medium">My Earnings</span>
                      </NavLink>
                    </div>
                  </div>
                </>
              )}

              {/* Admin Navigation */}
              {isAdmin && !roleLoading && (
                <>
                  <div className="my-6">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
                      Admin Panel
                    </h4>
                    <div className="space-y-2">
                      <NavLink
                        to="/dashboard/active-riders"
                        className={({ isActive }) => `
                          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }
                        `}
                      >
                        <FaUserCheck className="text-lg" />
                        <span className="font-medium">Active Riders</span>
                      </NavLink>

                      <NavLink
                        to="/dashboard/pending-riders"
                        className={({ isActive }) => `
                          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-amber-50 text-amber-700 border-l-4 border-amber-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }
                        `}
                      >
                        <FaUserClock className="text-lg" />
                        <span className="font-medium">Pending Riders</span>
                      </NavLink>

                      <NavLink
                        to="/dashboard/make-admin"
                        className={({ isActive }) => `
                          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-red-50 text-red-700 border-l-4 border-red-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }
                        `}
                      >
                        <FaUserShield className="text-lg" />
                        <span className="font-medium">Make Admin</span>
                      </NavLink>

                      <NavLink
                        to="/dashboard/assign-rider"
                        className={({ isActive }) => `
                          flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                          }
                        `}
                      >
                        <FaMotorcycle className="text-lg" />
                        <span className="font-medium">Assign Rider</span>
                      </NavLink>
                    </div>
                  </div>
                </>
              )}
            </nav>

            {/* Logout Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t">
              <button
                onClick={handleLogOut}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 group"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

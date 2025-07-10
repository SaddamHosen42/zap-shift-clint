import React from "react";
import { Link, NavLink } from "react-router";
import Logo from "../../logo/logo";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          }`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/coverage"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          }`
        }
      >
        Coverage
      </NavLink>
      <NavLink
        to="/sendParcel"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          }`
        }
      >
        Send Parcel
      </NavLink>
      {user && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isActive
                ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`
          }
        >
          Dashboard
        </NavLink>
      )}
      <NavLink
        to="/beARider"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          }`
        }
      >
        Be a Rider
      </NavLink>
      <NavLink
        to="/about-us"
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          }`
        }
      >
        About Us
      </NavLink>
    </>
  );

  // Mobile nav links with icons and styling
  const mobileNavLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
              isActive
                ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`
          }
          onClick={() =>
            (document.getElementById("mobile-drawer").checked = false)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Home</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage"
          className={({ isActive }) =>
            `flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
              isActive
                ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`
          }
          onClick={() =>
            (document.getElementById("mobile-drawer").checked = false)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Coverage</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/sendParcel"
          className={({ isActive }) =>
            `flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
              isActive
                ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`
          }
          onClick={() =>
            (document.getElementById("mobile-drawer").checked = false)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Send Parcel</span>
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`
              }
              onClick={() =>
                (document.getElementById("mobile-drawer").checked = false)
              }
            >
              <svg
                className="w-4 h-4 mr-3 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span>Dashboard</span>
            </NavLink>
          </li>
        </>
      )}
      <li>
        <NavLink
          to="/beARider"
          className={({ isActive }) =>
            `flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
              isActive
                ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`
          }
          onClick={() =>
            (document.getElementById("mobile-drawer").checked = false)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Be a Rider</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about-us"
          className={({ isActive }) =>
            `flex items-center space-x-3 text-lg font-medium transition-all duration-300 ${
              isActive
                ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            }`
          }
          onClick={() =>
            (document.getElementById("mobile-drawer").checked = false)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>About Us</span>
        </NavLink>
      </li>
    </>
  );
  console.log("user in navbar", user);

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
    <div className="drawer">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <div className="navbar bg-base-100 shadow-sm mx-auto">
          <div className="navbar-start">
            {/* Mobile hamburger menu */}
            <label
              htmlFor="mobile-drawer"
              className="btn btn-ghost lg:hidden drawer-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <div className="">
              <Logo></Logo>
            </div>
          </div>
          <div className="navbar-center hidden lg:flex">
            <div className="flex items-center space-x-2">{navLinks}</div>
          </div>
          <div className="navbar-end">
            {user ? (
              <div className="dropdown dropdown-end mr-3">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-12 rounded-full border-2 border-primary">
                    <img
                      alt="Profile"
                      src={
                        user.photoURL ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white rounded-2xl z-[1] mt-3 w-64 p-4 shadow-xl border border-gray-200"
                >
                  {/* User Info Section */}
                  <div className="px-2 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full border-2 border-primary">
                        <img
                          alt="Profile"
                          src={
                            user.photoURL ||
                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                          }
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {user.displayName || "User"}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <li>
                      <NavLink
                        to="/dashboard"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogOut}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Logout
                      </button>
                    </li>
                  </div>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Drawer sidebar for mobile */}
      <div className="drawer-side z-50">
        <label htmlFor="mobile-drawer" className="drawer-overlay"></label>
        <div className="min-h-full w-80 bg-white p-4">
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-8">
            <Logo />
            <label htmlFor="mobile-drawer" className="btn btn-circle btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </label>
          </div>

          {/* Navigation links */}
          <ul className="menu space-y-2">{mobileNavLinks}</ul>

          {/* User section in drawer */}
          {user ? (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <NavLink
                to="/login"
                className="flex items-center justify-center w-full px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() =>
                  (document.getElementById("mobile-drawer").checked = false)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

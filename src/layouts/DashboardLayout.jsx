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
} from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const { isAdmin, roleLoading, isRider } = useUserRole();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
        {/* Page content here */}
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-[#E6F2F3] text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <Logo></Logo>
          <li>
            <NavLink to="/dashboard">
              <FaHome className="inline-block mr-2" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/myParcels"
              className={({ isActive }) => (isActive ? " underline " : "")}
            >
              <FaBoxOpen className="inline-block mr-2" />
              My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className={({ isActive }) => (isActive ? " underline " : "")}
            >
              <FaMoneyCheckAlt className="inline-block mr-2" />
              Payment History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/track"
              className={({ isActive }) => (isActive ? " underline " : "")}
            >
              <FaSearchLocation className="inline-block mr-2" />
              Track a Package
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => (isActive ? " underline " : "")}
            >
              <FaUserEdit className="inline-block mr-2" />
              Update Profile
            </NavLink>
          </li>

          {/* Rider link */}
          {isRider && !roleLoading && (
            <>
              <li>
                <NavLink
                  to="/dashboard/pending-deliveries"
                  className={({ isActive }) => (isActive ? " underline " : "")}
                >
                  <FaTasks className="inline-block mr-2" />
                  Pending Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/completed-deliveries"
                  className={({ isActive }) => (isActive ? " underline " : "")}
                >
                  <FaCheckCircle className="inline-block mr-2" />
                  Completed Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/my-earnings"
                  className={({ isActive }) => (isActive ? " underline " : "")}
                >
                  <FaWallet className="inline-block mr-2" />
                  My Earnings
                </NavLink>
              </li>
            </>
          )}

          {/* Admin link */}
          {isAdmin && !roleLoading && (
            <>
              <li>
                <NavLink
                  to="/dashboard/active-riders"
                  className={({ isActive }) => (isActive ? " underline " : "")}
                >
                  <FaUserCheck className="inline-block mr-2" />
                  Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/pending-riders"
                  className={({ isActive }) => (isActive ? " underline " : "")}
                >
                  <FaUserClock className="inline-block mr-2" />
                  Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/make-admin"
                  className={({ isActive }) => (isActive ? " underline " : "")}
                >
                  <FaUserShield className="inline-block mr-2" />
                  Make Admin
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/assign-rider"
                  className={({ isActive }) => (isActive ? " underline " : "")}
                >
                  <FaMotorcycle className="inline-block mr-2" />
                  Assign Rider
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;

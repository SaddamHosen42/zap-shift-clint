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
          isActive ? " underline text-primary" : ""
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/coverage"
        className={({ isActive }) =>
          isActive ? " underline text-primary" : ""
        }
      >
        Coverage
      </NavLink>
      <NavLink
        to="/sendParcel"
        className={({ isActive }) =>
          isActive ? " underline text-primary" : ""
        }
      >
        Send Parcel
      </NavLink>
      <NavLink
        to="/about-us"
        className={({ isActive }) =>
          isActive ? " underline text-primary" : ""
        }
      >
        About Us
      </NavLink>
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
    <div className="navbar bg-base-100 shadow-sm mx-auto ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>
        <div className="">
          <Logo></Logo>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu-horizontal gap-4 font-semibold">{navLinks}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <>
            <span className="text-lg font-semibold me-4">
              {user.displayName}
            </span>
            <button
              onClick={handleLogOut}
              className="btn btn-primary text-black"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary text-black">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;

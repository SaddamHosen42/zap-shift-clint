import React from "react";
import { Outlet } from "react-router";
import Logo from "../logo/logo";
import authlmage from "../assets/authimage.png";
const AuthLayout = () => {
  return (
    <div className="flex justify-between">
      <div className="px-3 md:w-1/2 mx-auto">
        <div className="m-10"><Logo></Logo></div>
        <Outlet></Outlet>
      </div>
      <div className="bg-[#FAFDF0] w-1/2 min-h-screen  items-center justify-center hidden md:flex">
        <img src={authlmage}  />
      </div>
    </div>
  );
};

export default AuthLayout;

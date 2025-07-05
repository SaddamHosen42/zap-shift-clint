import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router";
const Logo = () => {
  return (
    <Link to="/">
      <div className="flex">
        <img src={logo} className="h-13" />
        <h1 className="text-2xl font-extrabold mt-6 -ms-5">Profast</h1>
      </div>
    </Link>
  );
};

export default Logo;

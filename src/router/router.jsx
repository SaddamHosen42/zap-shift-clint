import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Coverage from "../pages/Coverage/Coverage";
import AboutUs from "../pages/about-us/AboutUs";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children:[
        {
            index: true,
            Component:Home
        },
        {
          path:"coverage",
          loader:()=> fetch('./warehouses.json'),
          Component:Coverage
        },
        {
          path:"about-us",
          Component:AboutUs
        }
    ]
  },
  {
    path:"/",
    Component: AuthLayout,
    children:[
        {
          path: "login",
          Component:Login
        },
        {
          path: "register",
          Component: Register
        },
    ]
  },
]);

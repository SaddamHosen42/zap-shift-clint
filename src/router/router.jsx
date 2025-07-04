import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    children:[
        {
            index: true,
            Component:Home
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

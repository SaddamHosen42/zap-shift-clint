import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import RootLayout from "../layouts/RootLayout";

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
]);

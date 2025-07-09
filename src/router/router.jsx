import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Coverage from "../pages/Coverage/Coverage";
import AboutUs from "../pages/about-us/AboutUs";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../pages/SendParcel/SendParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../Dashboard/MyParcels";
import Payment from "../Dashboard/payment/Payment";
import PaymentHistory from "../Dashboard/PaymentHistory";
import BeARider from "../pages/BeARider/BeARider";
import PendingRiders from "../Dashboard/PendingRiders";
import ActiveRiders from "../Dashboard/ActiveRiders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "coverage",
        loader: () => fetch("./warehouses.json"),
        element: <Coverage />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "sendParcel",
        loader: () => fetch("./warehouses.json"),
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
      },
      {
        path: "beARider",
        loader: () => fetch("./warehouses.json"),
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path: "payment/:parcelId",
        element: <Payment />,
      },
      {
        path: "paymentHistory",
        element: <PaymentHistory />,
      },
      {
        path:"pending-riders",
        element:<PendingRiders/>,
      },
      {
        path:"active-riders",
        element:<ActiveRiders/>,
      }
    ],
  },
]);

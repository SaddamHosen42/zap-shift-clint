import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { createUser, setUser, logInWithGoogle, updateUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    console.log(data);
    // Handle registration logic here

    createUser(data.email, data.password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        updateUser({ displayName: data.name, photoURL: data.photo[0] })
          .then(() => {
            setUser({
              ...user,
              displayName: data.name,
              photoURL: data.photo[0],
            });
            navigate(location.state || "/");
            Swal.fire({
              icon: "success",
              title: "Your account is created.",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((error) => {
            console.error("Error updating user profile:", error);
            setErrorMessage(error.message);
            Swal.fire({
              icon: "error",
              title: "Failed to update profile",
              text: error.message,
            });
            setUser(user);
          });
        reset(); // Reset the form after successful registration
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        setErrorMessage(error.message);
        // Show an error message to the user
        Swal.fire({
          icon: "error",
          title: "Registration failed",
          text: error.message,
        });
      });
  };
  const handleGoogleSignIn = () => {
    logInWithGoogle()
      .then((result) => {
        const user = result.user;
        navigate(location.state || "/");
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          text: `Welcome, ${user.displayName}!`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
    setErrorMessage("");
  };

  return (
    <div className="flex justify-center  items-center mb-12">
      <div className="card bg-base-100 w-sm md:w-[500px]  mx-auto mt-2">
        <h1 className="text-3xl font-bold ms-5">Create an Account</h1>
        <p className="ms-5">Register with Profast</p>
        <div className="card-body">
             {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          <form className="fieldset" onSubmit={handleSubmit(onSubmit)}>
            {/* photo url */}
            <label className="label text-lg">Photo</label>
            <input
              type="file"
              {...register("photo")}
              accept="image/*"
              className="file-input file-input-ghost"
            />

            {/* name */}
            <label className="label text-lg">Name</label>
            <input
              type="text"
              className="input w-full"
              {...register("name", { required: true })}
              placeholder="Your Name"
              required
            />

            {/* email */}
            <label className="label text-lg">Email</label>
            <input
              type="email"
              className="input w-full"
              {...register("email", { required: true })}
              placeholder="Email"
              required
            />
            {/* password */}
            <label className="label text-lg">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input w-full"
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                placeholder="Password"
                required
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  Password must be at least 6 characters long
                </span>
              )}
              <button
                type="button"
                className="btn btn-xs absolute right-2 top-2 text-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="btn bg-amber-400 text-white hover:bg-amber-500 mt-4 text-lg"
            >
              Register
            </button>
            <div className="mt-4 text-center text-lg">
              <p>
               Already have an account?{" "}
                <span>
                  <Link to="/login" className="text-amber-400 ">
                    Login
                  </Link>
                </span>
              </p>
            </div>
            <div className="divider text-lg">OR</div>
            <button
               onClick={handleGoogleSignIn}
              className="btn border-amber-500 text-lg bg-amber-400 hover:bg-amber-500"
            >
              <svg
                aria-label="Google logo"
                width="25"
                height="25"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Login with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

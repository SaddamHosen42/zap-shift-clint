import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

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
  const [profilePic, setProfilePic] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    // Handle registration logic here

    createUser(data.email, data.password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        updateUser({ displayName: data.name, photoURL: profilePic })
          .then(() => {
            setUser({
              ...user,
              displayName: data.name,
              photoURL: profilePic,
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
  
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setImageUploading(true);
    // console.log(image)

    const formData = new FormData();
    formData.append("image", image);

    try {
      const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_upload_key
      }`;
      const res = await axios.post(imagUploadUrl, formData);

      setProfilePic(res.data.data.url);
      //console.log(res.data.data.url);
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Image upload failed",
        text: "Please try again with a different image.",
      });
    } finally {
      setImageUploading(false);
    }
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
            <div className="flex items-center space-x-4">
              <input
                type="file"
                onChange={handleImageUpload}
                className="file-input file-input-ghost flex-1"
                accept="image/*"
                disabled={imageUploading}
              />
              {imageUploading ? (
                <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center bg-gray-100">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : profilePic ? (
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full border-2 border-primary">
                    <img
                      src={profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 border-dashed flex items-center justify-center bg-gray-50">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              )}
            </div>
            {imageUploading && (
              <p className="text-sm text-blue-600 mt-1">
                📤 Uploading image...
              </p>
            )}
            {profilePic && !imageUploading && (
              <p className="text-sm text-green-600 mt-1">
                ✓ Photo uploaded successfully!
              </p>
            )}

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
              className="btn btn-primary text-black mt-4 text-lg"
            >
              Register
            </button>
            <div className="mt-4 text-center text-lg">
              <p>
                Already have an account?{" "}
                <span>
                  <Link to="/login" className="text-primary">
                    Login
                  </Link>
                </span>
              </p>
            </div>
            <div className="divider text-lg">OR</div>
            <button
              onClick={handleGoogleSignIn}
              className="btn bg-white text-black border-[#e5e5e5]"
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

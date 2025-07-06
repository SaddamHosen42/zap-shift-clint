import Lottie from "lottie-react";
import React from "react";
import loadingAnimation from "../lottie-animation/loading.json";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-[200px] h-[200px] mx-auto">
      <Lottie animationData={loadingAnimation} loop={true}></Lottie>
    </div>
  );
};

export default Loading;

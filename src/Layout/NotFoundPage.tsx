import React from "react";
import { useNavigate } from "react-router";
import notfoundImage from "../assets/not-found.jpg"; // update path

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col md:flex-row overflow-hidden">
      {/* Custom CSS */}
      <style>
        {`
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-80px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(80px); }
            to { opacity: 1; transform: translateX(0); }
          }

          .slide-in-left {
            animation: slideInLeft 1s ease-out forwards;
          }
          .slide-in-right {
            animation: slideInRight 1s ease-out forwards;
          }
          .slide-in-right-delay {
            animation: slideInRight 1.3s ease-out forwards;
          }
          .slide-in-right-delay2 {
            animation: slideInRight 1.6s ease-out forwards;
          }

          /* Neon shimmer effect for 404 */
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .shimmer-text {
            background: linear-gradient(
              90deg,
              #a3e635 0%,
              #d9f99d 50%,
              #a3e635 100%
            );
            background-size: 200% auto;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            animation: shimmer 3s linear infinite;
          }

          .clip-path-jagged {
            clip-path: polygon(100% 0, 0% 100%, 100% 100%);
          }
        `}
      </style>

      {/* Left side illustration */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center bg-white p-6">
        <img
          src={notfoundImage}
          alt="404"
          className="w-4/5 max-w-md mx-auto animate-pulse"
        />
        {/* Jagged divider effect */}
        <div className="hidden md:block absolute right-0 top-0 h-full w-8 bg-[#0B234A] clip-path-jagged"></div>
      </div>

      {/* Right side text */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-[#0B234A] text-center text-lime-200 px-8 py-12 overflow-hidden">
        <h1 className="text-6xl font-extrabold mb-6 shimmer-text slide-in-left">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-4 slide-in-right">
          Lost in Space 🚀
        </h2>
        <p className="text-lg text-gray-300 max-w-md mb-8 leading-relaxed slide-in-right-delay">
          Looks like this page drifted off into the void.  
          <span className="italic text-lime-400">
            Don’t worry, we’ll beam you back home.
          </span>
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-lime-400 text-black rounded-lg font-semibold shadow-md hover:bg-lime-300 hover:scale-105 transform transition slide-in-right-delay2"
        >
          Take me home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

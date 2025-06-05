import React from "react";
import { assets } from "../assets/assets";

// This is the header section users see when they first land
const Header = () => {
  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      {/* Profile-like header image */}
      <img
        src={assets.header_img}
        alt="Header"
        className="w-36 rounded-full mb-6"
      />

      {/* Greeting text with a waving hand image */}
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hi there!
        <img
          className="w-8 aspect-square"
          src={assets.hand_wave}
          alt="wave emoji"
        />
      </h1>

      {/* Main welcome title */}
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome aboard
      </h2>

      {/* Intro message — this is what caused the error before (p inside p) */}
      <p className="mb-8 max-w-md">
        Get started with a secure and reliable authentication system. Log in or
        register to access your account and explore all features.
      </p>

      {/* CTA button */}
      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
        Get Started
      </button>
    </div>
  );
};

export default Header;

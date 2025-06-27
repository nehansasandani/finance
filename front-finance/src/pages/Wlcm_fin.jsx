import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "../img/finance.jpg";
import dataSvg from "../img/data.svg";

const FinanceWelcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between text-white">
        {/* Navbar */}
        <nav className="bg-black bg-opacity-50 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Finance Tracker</h1>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md transition duration-300 hover:bg-gray-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md transition duration-300 hover:bg-yellow-600"
              >
                Register
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-grow items-center justify-center">
          <div className="bg-black bg-opacity-60 p-10 rounded-lg shadow-lg text-center w-11/12 md:w-2/3 lg:w-1/2">
            <img src={dataSvg} alt="Finance Data" className="mb-4 w-32 mx-auto" />
            <h2 className="text-4xl font-bold">Manage Your Finances with Ease</h2>
            <p className="text-lg text-gray-200 mt-3">
              Keep track of your income and expenses effortlessly with our powerful financial dashboard.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md transition duration-300 hover:bg-blue-700"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/about")}
                className="bg-gray-700 text-white py-3 px-6 rounded-lg shadow-md transition duration-300 hover:bg-gray-900"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black bg-opacity-50 text-white text-center py-4">
          <p>&copy; 2025 Finance Tracker | All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default FinanceWelcome;

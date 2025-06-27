import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { userAuth, userLoading, userAppErr, userServerErr } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    // If user is not authenticated, navigate to login page
    if (!userAuth) {
      navigate("/login");
    }
  }, [userAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300">
      <div className="max-w-3xl w-full bg-blue-100 shadow-md rounded-lg p-6">
        {userLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : userAppErr || userServerErr ? (
          <div className="alert alert-danger text-center text-red-500 p-4 mb-4 border border-red-500 rounded">
            {userAppErr || userServerErr}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
              Welcome to your Profile
            </h1>

            {/* Display the image */}
            <div className="text-center mb-6">
              <img
                src="/finmem2.jpg" // Assuming the image is in the public folder
                alt="Finance Team Member"
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />
            </div>

            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-700">
                <strong>Name:</strong> {userAuth?.firstname} {userAuth?.lastname}
              </p>
              <p className="text-lg font-medium text-gray-700">
                <strong>Email:</strong> {userAuth?.email}
              </p>

              {/* Conditionally display post based on isAdmin */}
              <div className="bg-red-600 p-4 rounded-md shadow-md mt-4 text-center">
                {userAuth?.isAdmin === true ? (
                  <p className="text-3xl font-bold text-white">
                    <strong>Post:</strong> Finance Manager
                  </p>
                ) : (
                  <p className="text-3xl font-bold text-white">
                    <strong>Post:</strong> Finance Team Member
                  </p>
                )}
              </div>

              {/* New Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => navigate("/expenses")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                  View Expenses History
                </button>

                <button
                  onClick={() => navigate("/income")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                >
                  View Income History
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

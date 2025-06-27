import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createPettyAction,
  resetSuccess,
  fetchPettyTotal,
} from "../../redux/slices/petty/pettySlices";

// Form validation schema
const formSchema = Yup.object({
  paidTo: Yup.string().required("Paid To is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
});

const PettyCash = () => {
  const dispatch = useDispatch();

  const { userAuth } = useSelector((state) => state.user);
  const { pettyLoading, pettyError, pettyCreated, pettyTotal, pettyTotalLoading } = useSelector(
    (state) => state.petty
  );

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      paidTo: "",
      category: "",
      description: "",
      amount: "",
      user: "", // Hidden, populated in useEffect
    },
    onSubmit: (values, { resetForm }) => {
      dispatch(createPettyAction(values));
      resetForm();
    },
    validationSchema: formSchema,
  });

  // Auto-fill user ID when available
  useEffect(() => {
    if (userAuth) {
      formik.setFieldValue("user", userAuth._id);
    }
  }, [userAuth]);

  // Reset success message and fetch updated total after 3 seconds
  useEffect(() => {
    if (pettyCreated) {
      setTimeout(() => {
        dispatch(resetSuccess());
        dispatch(fetchPettyTotal()); // Refresh total after successful entry
      }, 3000);
    }
  }, [pettyCreated, dispatch]);

  // Fetch total petty cash if user is authenticated
  useEffect(() => {
    if (userAuth?.token) {
      dispatch(fetchPettyTotal());
    }
  }, [dispatch, userAuth?.token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-4">
          <img src="/petty.jpg" alt="Petty Cash" className="w-20 h-20" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Add Petty Cash
        </h2>

        {/* Total Petty Cash Balance */}
        {userAuth?.token && pettyTotal !== undefined && (
          <div className="text-center bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            {pettyTotalLoading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-blue-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-blue-600">Loading...</span>
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-blue-700">
                  💰 Total Petty Cash Balance: Rs. {Number(pettyTotal).toFixed(2)}
                </p>
                <button
                  onClick={() => dispatch(fetchPettyTotal())}
                  className="mt-2 text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Refresh Balance
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Paid To Field */}
          <div>
            <label className="block text-gray-700 font-medium">Paid To</label>
            <input
              type="text"
              name="paidTo"
              value={formik.values.paidTo}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border bg-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter name"
            />
            {formik.touched.paidTo && formik.errors.paidTo && (
              <div className="text-red-500">{formik.errors.paidTo}</div>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formik.values.category}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border bg-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter category"
            />
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-500">{formik.errors.category}</div>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-gray-700 font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border bg-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter amount"
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-500">{formik.errors.amount}</div>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formik.values.description}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border bg-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter description"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500">{formik.errors.description}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            disabled={pettyLoading}
          >
            {pettyLoading ? "Submitting..." : "Submit Petty Cash"}
          </button>
        </form>

        {/* Error & Success Messages */}
        {pettyError && <div className="text-red-500 mt-4">{pettyError}</div>}
        {pettyCreated && (
          <div className="text-green-500 mt-4">
            ✅ Petty cash entry created successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default PettyCash;   
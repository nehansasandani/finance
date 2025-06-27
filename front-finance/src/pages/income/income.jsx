import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createIncomeAction, resetSuccess } from "../../redux/slices/income/incomeSlices";

const Income = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state?.user || {}); // ✅ Safe Access
  const incomeState = useSelector((state) => state?.income || {}); // ✅ Safe Access

  const userAuth = userState?.userAuth || null;
  const { incomeLoading, incomeError, incomeSuccess } = incomeState;

  // ✅ Debugging: Log Redux State
  console.log("Redux User State:", userState);
  console.log("Redux Income State:", incomeState);
  console.log("Income Success:", incomeSuccess); // ✅ Check if this updates

  // ✅ State for Success Message
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      amount: "",
      user: userAuth?._id || "", // ✅ Safe Access
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive"),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log("Submitting Income Data:", values);
      dispatch(createIncomeAction(values));
      resetForm();
    },
  });

  useEffect(() => {
    if (userAuth) {
      formik.setFieldValue("user", userAuth._id);
    }
  }, [userAuth]);

  useEffect(() => {
    if (incomeSuccess) {
      console.log("✅ Income successfully submitted!"); // ✅ Debugging log
      setSuccessMessage("✅ Income data submitted successfully!");

      setTimeout(() => {
        setSuccessMessage(""); // ✅ Clear message after 3 seconds
        dispatch(resetSuccess());
      }, 3000);
    }
  }, [incomeSuccess, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add New Income
        </h2>

        {/* Show Error Message if userAuth is missing */}
        {!userAuth && (
          <div className="text-red-500 text-center mb-4">
            ⚠️ Error: User not authenticated!
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border bg-blue-100 rounded-md"
            />
            {formik.errors.title && formik.touched.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border bg-blue-100 rounded-md"
            />
            {formik.errors.amount && formik.touched.amount && (
              <div className="text-red-500 text-sm">{formik.errors.amount}</div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border bg-blue-100 rounded-md"
            />
            {formik.errors.description && formik.touched.description && (
              <div className="text-red-500 text-sm">{formik.errors.description}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md"
            disabled={incomeLoading}
          >
            {incomeLoading ? "Submitting..." : "Submit Income"}
            
          </button>
          

        </form>

        {incomeError && <div className="text-red-500 mt-4">{incomeError}</div>}
        
        {/* ✅ Show Success Message */}
        {successMessage && (
          <div className="text-green-500 mt-4 text-center">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Income;

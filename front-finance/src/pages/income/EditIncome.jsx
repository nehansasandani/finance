import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import moneySVG from "../../img/money.svg";

// Yup validation schema
const formSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .typeError("Amount must be a number"),
});

const EditIncome = () => {
  const { id } = useParams(); // Get the income ID from URL
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    fetchIncomeData();
  }, [id]);

  const fetchIncomeData = async () => {
    const userToken = localStorage.getItem("token");
    const isAdmin = JSON.parse(localStorage.getItem("isAdmin")); // Get isAdmin from localStorage

    if (!userToken) {
      setServerError("Unauthorized: No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/income/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch income data");
      }

      const data = await response.json();
      setInitialValues({
        title: data.title || "",
        description: data.description || "",
        amount: data.amount || "",
      });
    } catch (error) {
      setServerError(error.message);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true, // Allow reinitialization when data is fetched
    onSubmit: async (values) => {
      setLoading(true);
      const userToken = localStorage.getItem("token");
      const isAdmin = JSON.parse(localStorage.getItem("isAdmin")); // Get isAdmin from localStorage

      if (!userToken) {
        setServerError("Unauthorized: No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/api/income/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Failed to update income");

        alert("Income updated successfully!");
        setLoading(false); // Stop loading after update
      } catch (error) {
        setServerError(error.message);
        setLoading(false);
      }
    },
  });

  return (
    <section className="py-5 bg-secondary vh-100">
      <div className="container text-center">
        <center>
          <img className="img-fluid mb-4" src={moneySVG} alt="SVG Income" width="200" />
        </center>
        <div className="row mb-4">
          <div className="col-12 col-md-8 col-lg-5 mx-auto">
            <div className="p-4 shadow-sm rounded bg-white">
              <form onSubmit={formik.handleSubmit}>
                <h2 className="mb-4 fw-light">Update Income</h2>
                {serverError && <div className="text-danger mb-3">{serverError}</div>}

                {/* Title Field */}
                <div className="mb-3 input-group">
                  <input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                    type="text"
                    placeholder="Enter Title"
                  />
                  {formik.touched.title && formik.errors.title && (
                    <div className="text-danger">{formik.errors.title}</div>
                  )}
                </div>

                {/* Description Field */}
                <div className="mb-3 input-group">
                  <input
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                    type="text"
                    placeholder="Enter Description"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-danger">{formik.errors.description}</div>
                  )}
                </div>

                {/* Amount Field */}
                <div className="mb-3 input-group">
                  <input
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control"
                    type="number"
                    placeholder="Enter Amount"
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="text-danger">{formik.errors.amount}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary mb-4 w-100" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditIncome;

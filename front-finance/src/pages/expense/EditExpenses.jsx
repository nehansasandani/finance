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

const EditContent = () => {
  const { id } = useParams(); // Get the expense ID from URL
  const [expLoading, setExpLoading] = useState(false);
  const [expServerErr, setExpServerErr] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    fetchExpenseData();
  }, [id]);

  const fetchExpenseData = async () => {
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      setExpServerErr("Unauthorized: No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/expenses/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in again.");
      }

      if (!response.ok) {
        throw new Error("Failed to fetch expense data");
      }

      const data = await response.json();
      setInitialValues({
        title: data.title || "",
        description: data.description || "",
        amount: data.amount || "",
      });
    } catch (error) {
      setExpServerErr(error.message);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formSchema,
    enableReinitialize: true, // Allow the form to reinitialize if data is fetched
    onSubmit: async (values) => {
      setExpLoading(true);
      const userToken = localStorage.getItem("token");

      if (!userToken) {
        setExpServerErr("Unauthorized: No token found. Please log in.");
        setExpLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/api/expenses/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Failed to update expense");

        alert("Expense updated successfully!");
        setExpLoading(false); // Stop loading after update
      } catch (error) {
        setExpServerErr(error.message);
        setExpLoading(false);
      }
    },
  });

  return (
    <section className="py-5 bg-secondary vh-100">
      <div className="container text-center">
        <center>
          <img className="img-fluid mb-4" src={moneySVG} alt="SVG Expenses" width="200" />
        </center>
        <div className="row mb-4">
          <div className="col-12 col-md-8 col-lg-5 mx-auto">
            <div className="p-4 shadow-sm rounded bg-white">
              <form onSubmit={formik.handleSubmit}>
                <h2 className="mb-4 fw-light">Update Expense</h2>
                {expServerErr && <div className="text-danger mb-3">{expServerErr}</div>}

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

                <button type="submit" className="btn btn-primary mb-4 w-100" disabled={expLoading}>
                  {expLoading ? "Updating..." : "Update"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditContent;

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUserAction } from "../../redux/slices/users/userSlices";
import { useNavigate } from "react-router-dom";

// Form validation
const formSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .matches(/^[a-zA-Z0-9._%+-]+@finmem\.gmail\.com$/, "Unauthorized email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .required("Password is required"),
  firstname: Yup.string()
    .matches(/^[A-Za-z]+$/, "First name must contain only alphabetic characters (A-Z, a-z)")
    .required("First name is required"),
  lastname: Yup.string()
    .matches(/^[A-Za-z]+$/, "Last name must contain only alphabetic characters (A-Z, a-z)")
    .required("Last name is required"),
});

const Register_fin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userLoading, userAppErr, userServerErr, isLogin, userAuth } = useSelector((state) => state.user);

  // State for success message
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize form
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    },
    onSubmit: (values) => {
      dispatch(registerUserAction(values));
    },
    validationSchema: formSchema,
  });

  useEffect(() => {
    if (isLogin) {
      console.log("User information:", userAuth);
      setSuccessMessage("Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Wait for 2 seconds before redirecting
    }
  }, [isLogin, userAuth, navigate]);

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <section className="position-relative py-5 overflow-hidden vh-100">
      <div className="d-none d-md-block position-absolute top-0 start-0 bg-dark w-75 h-100"></div>
      <div className="d-md-none position-absolute top-0 start-0 bg-primary w-100 h-100"></div>
      <div className="container position-relative mx-auto">
        <div className="row align-items-center">
          <div className="col-12 col-lg-5 mb-5">
            <div>
              <h2 className="display-5 fw-bold mb-4 text-white">
                Keep Track of your income and expenses flow
              </h2>
              <hr className="text-warning w-100" />
            </div>
          </div>
          <div className="col-12 col-lg-5 ms-auto ">
            <div className="p-5 bg-light rounded text-center">
              <span className="text-muted">New User</span>
              <h3 className="fw-bold mb-5">Register</h3>
              {userAppErr || userServerErr ? (
                <div className="alert alert-danger" role="alert">
                  {userAppErr || userServerErr}
                </div>
              ) : null}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}
              <form onSubmit={formik.handleSubmit}>
                <input
                  value={formik.values.firstname}
                  onBlur={formik.handleBlur("firstname")}
                  onChange={formik.handleChange("firstname")}
                  className="form-control mb-2"
                  type="text"
                  placeholder="First Name"
                />
                {/* Err */}
                <div className="text-danger mb-2">
                  {formik.touched.firstname && formik.errors.firstname}
                </div>
                <input
                  value={formik.values.lastname}
                  onBlur={formik.handleBlur("lastname")}
                  onChange={formik.handleChange("lastname")}
                  className="form-control mb-2"
                  type="text"
                  placeholder="Last Name"
                />
                {/* Err */}
                <div className="text-danger mb-2">
                  {formik.touched.lastname && formik.errors.lastname}
                </div>
                <input
                  value={formik.values.email}
                  onBlur={formik.handleBlur("email")}
                  onChange={formik.handleChange("email")}
                  className="form-control mb-2"
                  type="email"
                  placeholder="Email"
                />
                {/* Err */}
                <div className="text-danger mb-2">
                  {formik.touched.email && formik.errors.email}
                </div>
                <input
                  value={formik.values.password}
                  onBlur={formik.handleBlur("password")}
                  onChange={formik.handleChange("password")}
                  className="form-control mb-2"
                  type="password"
                  placeholder="Password"
                />
                {/* Err */}
                <div className="text-danger mb-2">
                  {formik.touched.password && formik.errors.password}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary py-2 w-100 mb-4"
                  disabled={userLoading}
                >
                  {userLoading ? "Loading..." : "Register"}
                </button>
              </form>
              {/* Sign In Button */}
              <p className="mt-3">
                Already have an account?{" "}
                <button
                  className="btn btn-link"
                  onClick={navigateToLogin}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register_fin;
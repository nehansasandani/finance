import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { loginUserAction } from "../../redux/slices/users/userSlices";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Form validation
const formSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login_fin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { userLoading, userAppErr, userServerErr, isLogin, userAuth } = useSelector((state) => state.user);

  // Initialize form
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      dispatch(loginUserAction(values));
    },
    validationSchema: formSchema,
  });

  useEffect(() => {
    if (isLogin) {
      console.log("User information:", userAuth);
      navigate("/home_fin"); 
    }
  }, [isLogin, userAuth, navigate]);

  return (
    <section
      style={{ height: "100vh" }}
      className="position-relative py-5 overflow-hidden bg-warning"
    >
      <div className="d-none d-md-block position-absolute top-0 start-0 bg-dark w-75 h-100"></div>
      <div className="d-md-none position-absolute top-0 start-0 bg-primary w-100 h-100"></div>
      <div className="container position-relative mx-auto">
        <div className="row align-items-center">
          <div className="col-12 col-lg-5 mb-5">
            <div>
              <h2 className="display-5 fw-bold mb-4 text-white">
                Keep Track of what you are spending
              </h2>
              <hr className="text-warning w-100" />
            </div>
          </div>
          <div className="col-12 col-lg-5 ms-auto">
            <div className="p-5 bg-light rounded text-center">
              <span className="text-muted">Sign In</span>
              <h3 className="fw-bold mb-5">Login to your account</h3>
              {userAppErr || userServerErr ? (
                <div className="alert alert-danger" role="alert">
                  {userAppErr || userServerErr}
                </div>
              ) : null}
              <form onSubmit={formik.handleSubmit}>
                <input
                  value={formik.values.email}
                  onBlur={formik.handleBlur("email")}
                  onChange={formik.handleChange("email")}
                  className="form-control mb-2"
                  type="email"
                  placeholder="E-mail address"
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
                  {userLoading ? "Loading..." : "Login"}
                </button>
              </form>

              {/* Sign Up link */}
              <p className="mt-4 text-muted">
                Don't you have an account?{" "}
                <button
                  className="btn btn-link text-primary p-0"
                  onClick={() => navigate("/register")} // Navigate to register page
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login_fin;

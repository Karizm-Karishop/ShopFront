/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearState } from '../../Redux/Slices/ConfirmToChangePasswordSlice';
import { RootState } from '../../Redux/store';
import React from "react";

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ConfirmToChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.confirmPasswordReset);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = (values: FormValues) => {
    dispatch(resetPassword({
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword
    })).then((response:any) => {
      if (response.type.endsWith('fulfilled')) {
        navigate('/login');
      }
    });
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center h-[90vh] p-4">
      <div className="w-full max-w-md p-6 border border-gray-300 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Change Password
        </h1>

        {error && <div className="text-red text-center mb-4">{error}</div>}

        <Formik
          initialValues={{
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="newPassword" className="mb-1 text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Field
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="border border-gray-400 p-2 pl-10 rounded-md w-full"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red text-sm mt-1"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="confirmPassword" className="mb-1 text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="border border-gray-400 p-2 pl-10 rounded-md w-full"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full py-2 bg-[#1C4A93] text-white rounded-md hover:bg-blue-700 transition-transform transform active:scale-95"
              >
                {loading ? "Submitting..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ConfirmToChangePassword;
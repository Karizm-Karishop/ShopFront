/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { RootState } from '../Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP, clearState } from '../Redux/Slices/twoFactorSlice';

interface MyFormValues {
  otp: string[];
}

const validationSchema = yup.object({
  otp: yup
    .array()
    .of(
      yup
        .string()
        .required("Required")
        .matches(/^[0-9]$/, "Must be a digit")
    )
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits"),
});

function TwoFactorAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { loading, error } = useSelector((state: RootState) => state.twoFactorAuth);

  const handleSubmit = (
    values: MyFormValues,
    actions: FormikHelpers<MyFormValues>
  ) => {
    const otpCode = values.otp.join("");
    dispatch(verifyOTP(otpCode)).then((response:any) => {
      if (response.type.endsWith('fulfilled')) {
        navigate("/change-password");
      }
      actions.setSubmitting(false);
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number,
    setFieldValue: FormikHelpers<MyFormValues>["setFieldValue"]
  ) => {
    const { value } = event.target;

    if (value === "") {
      setFieldValue(`otp[${idx}]`, "");
      if (idx > 0 && inputRefs.current[idx - 1]) {
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (/^[0-9]$/.test(value)) {
      setFieldValue(`otp[${idx}]`, value);
      if (idx < 5 && inputRefs.current[idx + 1]) {
        inputRefs.current[idx + 1]?.focus();
      }
    }
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
          Two-Factor Authentication
        </h1>

        {error && <div className="text-red text-center mb-4">{error}</div>}

        <Formik
          initialValues={{ otp: ["", "", "", "", "", ""] }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex justify-center gap-2">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Field
                    key={idx}
                    name={`otp[${idx}]`}
                    type="text"
                    maxLength={1}
                    innerRef={(el: HTMLInputElement) =>
                      (inputRefs.current[idx] = el)
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, idx, setFieldValue)
                    }
                    className={`w-12 h-12 text-center text-2xl border rounded focus:outline-none focus:ring-2 focus:ring-[#1C4A93] ${
                      touched.otp && errors.otp
                        ? "border-red"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full py-2 bg-[#1C4A93] text-white rounded-md hover:bg-blue-700 transition-transform transform active:scale-95"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-gray-500">
          Didn't receive a code?{" "}
          
           <a href="/forgot-password"
            className="text-blue-600 hover:underline text-[#1C4A93] font-bold"
          >
            Resend Code
          </a>
        </p>

        <p
          className="mt-4 text-center text-blue-600 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          &larr; Back to Login
        </p>
      </div>
    </div>
  );
}

export default TwoFactorAuth;
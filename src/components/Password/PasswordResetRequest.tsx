/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { Formik, Field, ErrorMessage, Form, FormikHelpers } from 'formik';
import { FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../Redux/Slices/PasswordResetRequestSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
interface MyFormValues {
  email: string;
}

const validationSchema: yup.ObjectSchema<MyFormValues> = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required!'),
});

function PasswordResetRequestForm() {
  const navigate = useNavigate();
 const dispatch = useDispatch();

  const { loading } = useSelector((state: RootState) => state.requestPasswordReset);

  const handleSubmit = async (
    values: MyFormValues,
    actions: FormikHelpers<MyFormValues>
  ) => {
    try {
      await dispatch(requestPasswordReset(values.email) as any).unwrap();
      navigate('/two-factor-auth');
    } catch (error) {
      actions.setSubmitting(false);
    }
  };
    
    
  return (
    <div className="flex justify-center items-center h-[90vh] sm:h-screen bg-white m-2">
      <div className="w-[80%] md:w-[60%] lg:w-[40%] p-5 shadow-lg border-[1px] border-gray-300 rounded-md ">

        <h1 data-testid="title" className="text-center font-bold text-3xl mb-5">
          Forgot Password
        </h1>
        <Formik
          initialValues={{
            email: ''
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <div className="flex flex-col relative">
                <label htmlFor="email" className="flex flex-col">
                  Enter your email
                  <div className="flex items-center border border-gray-400 p-2 rounded-md">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="w-full focus:outline-none"
                    />
                  </div>
                </label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red text-xs mt-1 p-1 rounded-md"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                aria-label="Submit Form"
                className="w-full flex justify-center py-2 sm:py-4 bg-[#1C4A93] text-white rounded-md hover:bg-blue-[#1C4A93] cursor-pointer"
              >
                {isSubmitting || loading ? (
                  <BeatLoader color="#ffffff" size={8} />
                ) : (
                  'Submit'
                )}
              </button>

              <div>
                <p className="text-center text-gray-600 text-xs sm:text-sm">
                  Don’t have an account?{' '}
                  <Link to="/signup" className="text-[#1C4A93] font-bold">
                    Sign up
                  </Link>
                </p>
              </div>

            </Form>
          )}
        </Formik>

          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-300 h-px"></div>
            <p className="font-light">OR</p>
            <div className="w-full bg-gray-300 h-px"></div>
          </div>

        <Link
          to="/login"
          className="text-primary font-light mt-4 block text-center"
        >
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
}
export default PasswordResetRequestForm;
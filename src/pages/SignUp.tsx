import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Field, ErrorMessage, Form, FormikHelpers } from 'formik';
import BeatLoader from 'react-spinners/BeatLoader';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // icons for fields
import { RootState, AppDispatch } from '../Redux/store';
import { useDispatch,useSelector } from 'react-redux';
import { Mail } from 'lucide-react';
import { registerUser } from '../Redux/Slices/SignUpSlice';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'artist' | 'client';
}

function SignUp() {
  const dispatch: AppDispatch =useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signUpState = useSelector((state: RootState) => state.signUp);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);


  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    dispatch(registerUser(values))
      .then(() => {
        actions.setSubmitting(false);
        setShowEmailVerificationModal(true);
      })
      .catch(() => {
        actions.setSubmitting(false);
      });
  };

  const renderEmailVerificationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        <Mail className="h-16 w-16 text-[#1C4A93] mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification email to {signUpState.email}. 
          Please check your inbox and click the verification link to complete your registration.
        </p>
        <button 
          onClick={() => {
            setShowEmailVerificationModal(false);
            navigate('/login');
          }}
          className="w-full py-2 bg-[#1C4A93] text-white rounded-md hover:bg-[#1C4A93] transition-colors"
        >
          OK, I'll Check My Email
        </button>
      </div>
    </div>
  );

  const renderField = (
    id: string,
    name: string,
    label: string,
    type: string = 'text',
    icon: React.ReactNode
  ) => {
    if (type === 'radio' || type === 'checkbox') {
      return (
        <label htmlFor={id} key={id} className="flex items-center">
          <Field
            id={id}
            type={type}
            name={name}
            value={id}
            className="mr-2 border border-gray-200"
          />
          {label}
        </label>
      );
    }

    return (
      <div key={id} className="flex flex-col">
        <label htmlFor={id} className="text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </span>
          <Field
            id={id}
            type={
              name === 'password'
                ? showPassword
                  ? 'text'
                  : 'password'
                : name === 'confirmPassword'
                ? showConfirmPassword
                  ? 'text'
                  : 'password'
                : type
            }
            name={name}
            className="border border-gray-400 p-2 pl-10 rounded-md w-full"
          />
          {type === 'password' && (
            <span
              onClick={
                name === 'password'
                  ? togglePasswordVisibility
                  : toggleConfirmPasswordVisibility
              }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
            >
              {name === 'password' && (showPassword ? <FaEyeSlash /> : <FaEye />)}
              {name === 'confirmPassword' &&
                (showConfirmPassword ? <FaEyeSlash /> : <FaEye />)}
            </span>
          )}
        </div>
      </div>
    );
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .notOneOf(['test@test.com'], 'That email is not allowed'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    userType: Yup.string().required('User type is required'),
  });

  return (
    <div className="flex justify-center items-center h-[90vh] sm:h-screen bg-white m-2">
      {showEmailVerificationModal && renderEmailVerificationModal()}
      <div className="w-[80%] md:w-[60%] lg:w-[40%] p-5 shadow-lg border-[1px] border-gray-300 rounded-md">
        <h1 className="text-center font-bold text-3xl mb-4">Sign Up</h1>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'artist',
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4" role="form">
              <div className="flex gap-3">
                <div className="flex flex-col w-1/2">
                  {renderField('firstName', 'firstName', 'Add your first name', 'text', <FaUser />)}
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red text-xs mt-1 p-1 rounded-md"
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  {renderField('lastName', 'lastName', 'Add your last name', 'text', <FaUser />)}
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red text-xs mt-1 p-1 rounded-md"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                {renderField('email', 'email', 'Enter your email', 'text', <FaEnvelope />)}
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red text-xs mt-1 p-1 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                {renderField('password', 'password', 'Enter your password', 'password', <FaLock />)}
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red text-xs mt-1 p-1 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                {renderField('confirmPassword', 'confirmPassword', 'Confirm your password', 'password', <FaLock />)}
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red text-xs mt-1 p-1 rounded-md"
                />
              </div>

              <div className="flex flex-col items-left justify-between text-gray-600 text-sm md:text-md">
                {renderField('client', 'userType', 'I am a client', 'radio', null)}
                {renderField('artist', 'userType', 'I am an artist', 'radio', null)}
                <ErrorMessage
                  name="userType"
                  component="div"
                  className="text-red-400 text-xs mt-1 bg-red p-1 rounded-md"
                />
              </div>

              <div className="text-xs sm:text-sm text-gray-600">
                {renderField('agreeCheckbox', 'agreeCheckbox', 'By signing up, I agree with the Terms of Use & Privacy Policy.', 'checkbox', null)}
              </div>
              {signUpState.loading && (
                <div className="flex justify-center"></div>
              )}
              {signUpState.error && (
                <p className="text-red-500 text-center mt-2">
                  {signUpState.error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || signUpState.loading}
                aria-label="Submit Form"
                className="w-full flex justify-center py-2 sm:py-4 bg-[#1C4A93] text-white"
              >
                {isSubmitting || signUpState.loading ? (
                  <BeatLoader color="#ffffff" size={8} />
                ) : (
                  'Sign Up'
                )}
              </button>

              <div>
                <p className="text-center text-gray-600 text-xs sm:text-sm md:text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#1C4A93] font-bold">
                    Login
                  </Link>
                </p>
              </div>

              <div className="flex flex-col items-center text-xs sm:text-sm md:text-lg">
                <p className="font-light">OR</p>
                <div className="flex items-center justify-center">
                  <Link
                    to="#"
                    className="bg-[#1C4A93] w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform transform active:scale-95 hover:scale-105"
                  >
                    <p className="text-white font-bold">G</p>
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignUp;

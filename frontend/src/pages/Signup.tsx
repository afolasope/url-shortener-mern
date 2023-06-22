import axios from 'axios';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import Cookies from 'universal-cookie';
import ms from 'ms';
import { axiosInstance } from '../config/config';

interface RegisterAccountI {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email address')
    .required('Email address is required'),
  password: Yup.string().required('Password is required'),
});

const cookies = new Cookies();

export default function Signup() {
  const initialValues: RegisterAccountI = {
    email: '',
    password: '',
  };

  const navigate = useNavigate();

  const signup = async (value: RegisterAccountI) => {
    const XUserId = cookies.get('x-user-id');
    const res = axiosInstance.post('/auth/signup', value, {
      headers: {
        'x-user-id': XUserId ? XUserId : '',
      },
    });
    return res;
  };

  const { mutate: mutateSignup } = useMutation(signup, {
    onSuccess: ({ data }) => {
      const XUserCookies = cookies.get('x-user-id');
      if (XUserCookies) {
        cookies.remove('x-user-id', { path: '/' });
      }
      cookies.set('access_token', data.message, {
        expires: new Date(new Date().setMilliseconds(ms('1d') - 100000)),
        httpOnly: false,
        path: '/',
      });
      navigate('/dashboard');
    },
  });

  const handleSubmit = async (
    fields: RegisterAccountI,
    { setSubmitting }: FormikHelpers<RegisterAccountI>
  ) => {
    setSubmitting(false);

    return mutateSignup(fields);
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* <Link href={ROUTES.HOMEPAGE}>
            <img
              className="mx-auto h-12 w-auto"
              src="https://res.cloudinary.com/dp8g2jwak/image/upload/v1675610418/quickshippy/logo-white_xo3fck.svg"
              alt={COMPANY.NAME}
            />
          </Link> */}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-3 px-4 shadow sm:rounded-md sm:px-10">
            <h2 className="py-3 mb-4 text-left text-3xl font-bold tracking-tight text-gray-900 max-w-xs">
              Create an account to get started
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <Field
                      autoComplete="email"
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-shippy-blue focus:outline-none focus:ring-shippy-blue sm:text-sm"
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <Field
                      autoComplete="email"
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-shippy-blue focus:outline-none focus:ring-shippy-blue sm:text-sm"
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Password"
                    />
                  </div>
                </div>
                <div>
                  <button
                    className="border bg-blue-600 flex w-full justify-center rounded-md  border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-shippy-blue focus:ring-offset-2"
                    type="submit"
                  >
                    Signup
                  </button>
                </div>
              </Form>
            </Formik>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
              {/* <GoogleLogin
                setIsLoadingSocialLogin={setIsLoadingSocialLogin}
                label="Register with your Google account"
                onLogin={onLogin}
              /> */}
            </div>
            <p className="pt-4 pb-8 text-shippy-gray-tx text-left">
              Already have an account? <a href="/login">Login</a>
              {/* <Link href={ROUTES.LOGIN}>
                <span className="ml-1 text-shippy-blue">Login</span>
              </Link> */}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

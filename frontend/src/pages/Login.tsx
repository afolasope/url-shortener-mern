import axios from 'axios';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
import * as Yup from 'yup';
import ms from 'ms';

interface LoginAccountI {
  email: string;
  password: string;
}

export const Login = () => {
  const cookies = new Cookies();

  const initialValues: LoginAccountI = {
    email: '',
    password: '',
  };

  const validate = Yup.object().shape({
    email: Yup.string()
      .email('Invalid Email address')
      .required('Email address is required'),
    password: Yup.string().min(8).required('Password is required'),
  });

  const navigate = useNavigate();

  const login = async (value: LoginAccountI) => {
    const res = axios.post('http://localhost:8000/auth/login', value);
    return res;
  };

  const { mutate: mutateLogin } = useMutation(login, {
    onSuccess: ({ data }) => {
      cookies.set('access_token', data.accessToken, {
        expires: new Date(new Date().setMilliseconds(ms('1d') - 100000)),
        httpOnly: false,
        path: '/',
      });
      navigate('/dashboard');
    },
  });

  const handleSubmit = (
    fields: LoginAccountI,
    { setSubmitting }: FormikHelpers<LoginAccountI>
  ) => {
    setSubmitting(false);

    return mutateLogin(fields);
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
              Log into your QuickShippy account
            </h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validate}
              onSubmit={handleSubmit}
            >
              {(formik) => (
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
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      render={(msg) => (
                        <div className="text-shippy-red">{msg}</div>
                      )}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <Field
                      autoComplete="email"
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-shippy-blue focus:outline-none focus:ring-shippy-blue sm:text-sm"
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                    {/* <PasswordField
                        label="Password"
                        name="password"
                        id="password"
                      /> */}
                    <ErrorMessage
                      name="password"
                      render={(msg) => (
                        <div className="text-shippy-red">{msg}</div>
                      )}
                    />
                  </div>

                  <div>
                    <button
                      className="bg-blue-600 flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-shippy-blue focus:ring-offset-2"
                      disabled={!formik.isValid}
                      type="submit"
                    >
                      Login
                      {/* {isLoading ? 'Processing...' : 'Login'} */}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-6">
              <div className="relative">
                {/* <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div> */}
              </div>
            </div>
            <div className="flex justify-between pt-4 pb-8">
              {/* <Link href={ROUTES.REGISTER}> */}
              <p>
                Don't have an account? <a href="/signup">Register</a>
              </p>
              {/* </Link> */}
              {/* <Link href={ROUTES.FORGOT_PASSWORD}>
                <p className="text-shippy-blue">I forgot my password</p>
              </Link>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

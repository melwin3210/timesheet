'use client';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { z } from 'zod';
import { loginUser, clearError } from '../store/authSlice';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
});

export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = (values) => {
    dispatch(clearError());
    dispatch(loginUser(values));
  };

  const validate = (values) => {
    try {
      loginSchema.parse(values);
      return {};
    } catch (err) {
      return err.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Timesheet System
          </h2>
        </div>
        <Formik
          initialValues={{ username: '', password: '' }}
          validate={validate}
          onSubmit={handleSubmit}
        >
          <Form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Field
                  name="username"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
                <ErrorMessage name="username" component="div" className="text-red-600 text-sm mt-1" />
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </Form>
        </Formik>
        <div className="text-sm text-gray-600 mt-4">
          <p>Demo accounts:</p>
          <p>Manager: manager / manager123</p>
          <p>Associate: associate1 / associate123</p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import AnimatedFormInput from '../components/AnimatedFormInput';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setLoginSuccess(true);

        // Redirect after success
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-[#0056a4] rounded-full flex items-center justify-center text-white fade-in">
            <svg width="24" height="24" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 0C10.0736 0 0 10.0736 0 22.5C0 34.9264 10.0736 45 22.5 45C34.9264 45 45 34.9264 45 22.5C45 10.0736 34.9264 0 22.5 0Z" fill="white"/>
              <path d="M22.5 0C19.1842 0 15.9366 0.879735 13.0554 2.53237C10.1742 4.18501 7.7519 6.55032 6.00962 9.40061C4.26734 12.2509 3.26696 15.4913 3.1084 18.8354C2.94983 22.1795 3.63783 25.5005 5.11286 28.4662L22.5 22.5L22.5 0Z" fill="#0072CE"/>
              <path d="M22.5 0C25.8158 0 29.0634 0.879735 31.9446 2.53237C34.8258 4.18501 37.2481 6.55032 38.9904 9.40061C40.7327 12.2509 41.733 15.4913 41.8916 18.8354C42.0502 22.1795 41.3622 25.5005 39.8871 28.4662L22.5 22.5L22.5 0Z" fill="#DB3E6F"/>
              <path d="M39.8871 28.4662C38.4121 31.4319 36.1324 33.9358 33.3031 35.7134C30.4738 37.4909 27.1926 38.4699 23.8406 38.5457C20.4886 38.6215 17.1663 37.7913 14.2611 36.1382C11.3558 34.4851 8.9696 32.0848 7.37134 29.1848L22.5 22.5L39.8871 28.4662Z" fill="#672D87"/>
              <path d="M7.37135 29.1848C5.77309 26.2848 5.00291 22.9566 5.1488 19.6066C5.29469 16.2566 6.35078 13.0275 8.20991 10.2731L22.5 22.5L7.37135 29.1848Z" fill="#0DB14B"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 fade-in">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 fade-in delay-100">
          Or{' '}
          <Link href="/register" className="font-medium text-[#0056a4] hover:text-[#004483]">
            register for a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md fade-in-up delay-200">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loginSuccess ? (
            <div className="text-center py-8 fade-in">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Login successful!</h3>
              <p className="mt-1 text-sm text-gray-500">Redirecting you to the dashboard...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatedFormInput
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                required
                error={errors.email}
                success={email !== '' && !errors.email}
                autoComplete="email"
              />

              <AnimatedFormInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                required
                error={errors.password}
                success={password !== '' && !errors.password}
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-[#0056a4] focus:ring-[#0056a4] border-gray-300 rounded"
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-[#0056a4] hover:text-[#004483]">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0056a4] hover:bg-[#004483] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4] transition-colors btn-pulse ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="fade-in-right delay-100">
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover-scale"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </a>
              </div>

              <div className="fade-in-left delay-200">
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover-scale"
                >
                  <span className="sr-only">Sign in with Microsoft</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

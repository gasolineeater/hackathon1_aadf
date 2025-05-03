'use client';

import { useState } from 'react';
import Link from 'next/link';
import AnimatedFormInput from '../components/AnimatedFormInput';
import MultiStepForm from '../components/MultiStepForm';

export default function RegisterPage() {
  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Account Information
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Personal Information
    firstName: '',
    lastName: '',
    companyName: '',
    
    // Step 3: Company Details
    companyType: '',
    industry: '',
    vatNumber: '',
    
    // Step 4: Contact Information
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Registration success state
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Update form data
  const updateFormData = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  // Validate step 1
  const validateStep1 = () => {
    const stepErrors: Record<string, string> = {};
    
    // Email validation
    if (!formData.email) {
      stepErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      stepErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      stepErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      stepErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      stepErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Validate step 2
  const validateStep2 = () => {
    const stepErrors: Record<string, string> = {};
    
    // First name validation
    if (!formData.firstName) {
      stepErrors.firstName = 'First name is required';
    }
    
    // Last name validation
    if (!formData.lastName) {
      stepErrors.lastName = 'Last name is required';
    }
    
    // Company name validation
    if (!formData.companyName) {
      stepErrors.companyName = 'Company name is required';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Validate step 3
  const validateStep3 = () => {
    const stepErrors: Record<string, string> = {};
    
    // Company type validation
    if (!formData.companyType) {
      stepErrors.companyType = 'Company type is required';
    }
    
    // Industry validation
    if (!formData.industry) {
      stepErrors.industry = 'Industry is required';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Validate step 4
  const validateStep4 = () => {
    const stepErrors: Record<string, string> = {};
    
    // Phone validation
    if (!formData.phone) {
      stepErrors.phone = 'Phone number is required';
    }
    
    // Address validation
    if (!formData.address) {
      stepErrors.address = 'Address is required';
    }
    
    // City validation
    if (!formData.city) {
      stepErrors.city = 'City is required';
    }
    
    // Country validation
    if (!formData.country) {
      stepErrors.country = 'Country is required';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Handle form completion
  const handleFormComplete = () => {
    if (validateStep4()) {
      // Simulate API call
      setTimeout(() => {
        setRegistrationSuccess(true);
        
        // Redirect after success
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }, 1500);
    }
  };

  // Form steps
  const steps = [
    {
      title: 'Account',
      content: (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <AnimatedFormInput
            id="email"
            label="Email address"
            type="email"
            value={formData.email}
            onChange={(value) => updateFormData('email', value)}
            required
            error={errors.email}
            success={formData.email !== '' && !errors.email}
          />
          <AnimatedFormInput
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => updateFormData('password', value)}
            required
            error={errors.password}
            success={formData.password !== '' && !errors.password}
          />
          <AnimatedFormInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => updateFormData('confirmPassword', value)}
            required
            error={errors.confirmPassword}
            success={formData.confirmPassword !== '' && !errors.confirmPassword}
          />
        </div>
      ),
    },
    {
      title: 'Personal',
      content: (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <AnimatedFormInput
            id="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={(value) => updateFormData('firstName', value)}
            required
            error={errors.firstName}
            success={formData.firstName !== '' && !errors.firstName}
          />
          <AnimatedFormInput
            id="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => updateFormData('lastName', value)}
            required
            error={errors.lastName}
            success={formData.lastName !== '' && !errors.lastName}
          />
          <AnimatedFormInput
            id="companyName"
            label="Company Name"
            value={formData.companyName}
            onChange={(value) => updateFormData('companyName', value)}
            required
            error={errors.companyName}
            success={formData.companyName !== '' && !errors.companyName}
          />
        </div>
      ),
    },
    {
      title: 'Company',
      content: (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
          <div className="mb-4">
            <label htmlFor="companyType" className="block text-sm font-medium text-gray-700 mb-1">
              Company Type <span className="text-red-500">*</span>
            </label>
            <select
              id="companyType"
              value={formData.companyType}
              onChange={(e) => updateFormData('companyType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                errors.companyType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select company type</option>
              <option value="corporation">Corporation</option>
              <option value="llc">Limited Liability Company (LLC)</option>
              <option value="partnership">Partnership</option>
              <option value="soleProprietorship">Sole Proprietorship</option>
              <option value="nonprofit">Non-Profit Organization</option>
            </select>
            {errors.companyType && (
              <p className="text-red-500 text-xs mt-1">{errors.companyType}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => updateFormData('industry', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                errors.industry ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="construction">Construction</option>
              <option value="other">Other</option>
            </select>
            {errors.industry && (
              <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
            )}
          </div>
          
          <AnimatedFormInput
            id="vatNumber"
            label="VAT Number (optional)"
            value={formData.vatNumber}
            onChange={(value) => updateFormData('vatNumber', value)}
          />
        </div>
      ),
    },
    {
      title: 'Contact',
      content: (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <AnimatedFormInput
            id="phone"
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => updateFormData('phone', value)}
            required
            error={errors.phone}
            success={formData.phone !== '' && !errors.phone}
          />
          <AnimatedFormInput
            id="address"
            label="Address"
            value={formData.address}
            onChange={(value) => updateFormData('address', value)}
            required
            error={errors.address}
            success={formData.address !== '' && !errors.address}
          />
          <div className="grid grid-cols-2 gap-4">
            <AnimatedFormInput
              id="city"
              label="City"
              value={formData.city}
              onChange={(value) => updateFormData('city', value)}
              required
              error={errors.city}
              success={formData.city !== '' && !errors.city}
            />
            <AnimatedFormInput
              id="country"
              label="Country"
              value={formData.country}
              onChange={(value) => updateFormData('country', value)}
              required
              error={errors.country}
              success={formData.country !== '' && !errors.country}
            />
          </div>
        </div>
      ),
    },
  ];

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
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 fade-in delay-100">
          Or{' '}
          <Link href="/login" className="font-medium text-[#0056a4] hover:text-[#004483]">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md fade-in-up delay-200">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {registrationSuccess ? (
            <div className="text-center py-8 fade-in">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Registration successful!</h3>
              <p className="mt-1 text-sm text-gray-500">Redirecting you to the login page...</p>
            </div>
          ) : (
            <MultiStepForm
              steps={steps}
              onComplete={handleFormComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

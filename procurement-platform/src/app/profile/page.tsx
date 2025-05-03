'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import MicroButton from '../components/MicroButton';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const { isAdmin, isEvaluator, isVendor } = useRoleAccess();

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user data
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
      setOrganization(user.user_metadata?.organization || '');

      // Fetch additional user data from the database
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }

          setUserProfile(data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await updateProfile({
        fullName,
        organization,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Loading profile...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Profile</h1>


          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your personal and account details.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {isAdmin && 'Administrator'}
                    {isEvaluator && 'Evaluator'}
                    {isVendor && 'Vendor / Bidder'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userProfile?.updated_at ? new Date(userProfile.updated_at).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Edit Profile</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your profile information.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <div className="mt-1">
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <MicroButton
                    type="button"
                    variant="outline"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </MicroButton>

                  <MicroButton
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Save Changes
                  </MicroButton>
                </div>
              </form>
            </div>
          </div>

          {/* Additional sections for vendor-specific or evaluator-specific information */}
          {isVendor && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Vendor Information</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your vendor profile details.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500">
                  To update your vendor profile with additional information such as industry, expertise, and certifications, please contact the administrator.
                </p>

                <div className="mt-4">
                  <MicroButton
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = '/procurement'}
                  >
                    View Available Tenders
                  </MicroButton>
                </div>
              </div>
            </div>
          )}

          {isEvaluator && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Evaluator Information</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your evaluation assignments.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500">
                  You are assigned to evaluate proposals for the following tenders:
                </p>

                <div className="mt-4">
                  <MicroButton
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = '/admin/evaluation'}
                  >
                    Go to Evaluation Dashboard
                  </MicroButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import MicroButton from '@/app/components/MicroButton';

export default function VerificationSuccess() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if email is verified
          const isEmailVerified = session.user.email_confirmed_at != null;
          setIsVerified(isEmailVerified);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkVerificationStatus();
    
    // Redirect to sign in after 5 seconds if verified
    const redirectTimer = setTimeout(() => {
      if (isVerified) {
        router.push('/auth/signin');
      }
    }, 5000);
    
    return () => clearTimeout(redirectTimer);
  }, [isVerified, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056a4]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="AADF Logo"
                width={60}
                height={60}
                className="h-12 w-auto"
              />
              <span className="ml-2 text-2xl font-bold text-[#0056a4]">AADF</span>
            </div>
          </Link>
        </div>
        
        {isVerified ? (
          <>
            <div className="mt-6 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Email Verified!</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <p className="mt-2 text-center text-sm text-gray-500">
                Redirecting you to the sign in page in a few seconds...
              </p>
            </div>
            
            <div className="mt-6">
              <MicroButton
                variant="primary"
                fullWidth
                onClick={() => router.push('/auth/signin')}
              >
                Sign In Now
              </MicroButton>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-yellow-100 p-3">
                  <svg className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Verification Pending</h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Your email verification is still pending. Please check your email and click the verification link.
              </p>
            </div>
            
            <div className="mt-6 space-y-3">
              <MicroButton
                variant="outline"
                fullWidth
                onClick={() => router.push('/auth/signin')}
              >
                Back to Sign In
              </MicroButton>
              
              <MicroButton
                variant="secondary"
                fullWidth
                onClick={async () => {
                  try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user?.email) {
                      await supabase.auth.resend({
                        type: 'signup',
                        email: user.email,
                      });
                      alert('Verification email has been resent. Please check your inbox.');
                    }
                  } catch (error) {
                    console.error('Error resending verification email:', error);
                    alert('Failed to resend verification email. Please try again.');
                  }
                }}
              >
                Resend Verification Email
              </MicroButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

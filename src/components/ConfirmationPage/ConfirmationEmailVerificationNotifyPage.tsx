import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

const ConfirmationEmailVerificationNotifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get('status');
    
    if (status === 'success') {
      setVerificationStatus('success');
    } else {
      setVerificationStatus('error');
    }
  }, [searchParams]);

  const handleProceed = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {verificationStatus === 'success' && (
          <div>
            <CheckCircle2 className="h-16 w-16 text-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified Successfully!</h2>
            <p className="text-gray-600 mb-6">Your email has been confirmed. You can now log in to your account.</p>
            <button 
              onClick={handleProceed}
              className="w-full py-2 bg-green text-white rounded-md hover:bg-green transition-colors"
            >
              Proceed to Login
            </button>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div>
            <XCircle className="h-16 w-16 text-red mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">There was an issue verifying your email. Please try again or contact support.</p>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full py-2 bg-red text-white rounded-md hover:bg-red transition-colors"
            >
              Return to Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationEmailVerificationNotifyPage;
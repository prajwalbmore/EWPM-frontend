import { useNavigate } from 'react-router-dom';
import { Shield, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full">
        <div className="card text-center py-8 sm:py-12 px-4 sm:px-6 border border-gray-100 shadow-xl">
          {/* Icon */}
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            403
          </h1>
          
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
            Access Denied
          </h2>

          {/* Message */}
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            You don't have permission to access this resource. 
            Please contact your administrator if you believe this is an error.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Go Back
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;


import React from 'react';
import { Link } from 'react-router';

const Forbidden = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="mb-8">
                    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                </div>

                {/* Error Content */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Forbidden</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Sorry, you don't have permission to access this page. This area is restricted to authorized users only.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <Link
                            to="/" 
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block"
                        >
                            Go to Home
                        </Link>
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-300"
                        >
                            Go Back
                        </button>
                    </div>
                </div>

                {/* Additional Help */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm mb-4">
                        Need help? Contact our support team
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a 
                            href="mailto:support@zapshift.com" 
                            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                        >
                            📧 Email Support
                        </a>
                        <span className="text-gray-300">|</span>
                        <a 
                            href="tel:+8801234567890" 
                            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                        >
                            📞 Call Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;
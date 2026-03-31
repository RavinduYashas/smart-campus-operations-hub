import React from 'react';
import { LogIn } from 'lucide-react';

const Login = () => {
    const handleGoogleLogin = () => {
        // Redirect to the Spring Boot OAuth2 endpoint
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center transform transition duration-500 hover:scale-105">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 p-4 rounded-full shadow-lg">
                        <LogIn className="text-white h-10 w-10" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Smart Campus</h1>
                <p className="text-gray-500 mb-8 text-lg font-medium">Operations Hub Login</p>
                
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google Logo"
                        className="w-6 h-6 mr-3"
                    />
                    Sign in with Google
                </button>

                <p className="mt-8 text-sm text-gray-400">
                    Use your university Google account to securely access the hub.
                </p>
            </div>
        </div>
    );
};

export default Login;

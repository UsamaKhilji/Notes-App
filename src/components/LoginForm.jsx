import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const LoginForm = () => {
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // If loading, show a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-500">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center animate-fade-in">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="absolute -top-4 left-2 text-blue-500 text-sm transform -translate-y-4 opacity-0 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="absolute -top-4 left-2 text-blue-500 text-sm transform -translate-y-4 opacity-0 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 animate-bounce-slow"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
          <span className="mx-2 text-gray-500">|</span>
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

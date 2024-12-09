import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const SignUpForm = () => {
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="max-w-md w-full p-8 bg-white shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-500">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center animate-fade-in">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="email"
              className="absolute -top-4 left-2 text-purple-500 text-sm transform -translate-y-4 opacity-0 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="absolute -top-4 left-2 text-purple-500 text-sm transform -translate-y-4 opacity-0 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="absolute -top-4 left-2 text-purple-500 text-sm transform -translate-y-4 opacity-0 transition-all duration-300 focus-within:opacity-100 focus-within:translate-y-0"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 animate-bounce-slow"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;

import React, { useState } from "react";
import {
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const ForgotPassword = () => {
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const navigate = useNavigate();

  // If loading, show a loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          sendVerificationCode();
        },
      },
      auth
    );
  };

  const sendVerificationCode = async (e) => {
    e.preventDefault();
    setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      alert("Verification code sent to your phone.");
    } catch (error) {
      alert("Failed to send verification code: " + error.message);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    const credential = auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );

    try {
      await auth.signInWithCredential(credential);
      alert("Phone number verified. You can now reset your password.");
      navigate("/login");
    } catch (error) {
      alert("Error verifying code: " + error.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/expired-action-code") {
        alert(
          "The password reset link has expired. Please request a new link."
        );
      } else if (error.code === "auth/invalid-action-code") {
        alert("The password reset link is invalid. Please try again.");
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-500">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Send Reset Email
          </button>
        </form>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">
          Or Recover via Phone
        </h2>
        <form onSubmit={sendVerificationCode}>
          <div id="recaptcha-container"></div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Send Verification Code
          </button>
        </form>

        <form onSubmit={verifyCode} className="mt-4">
          <div className="mb-4">
            <label htmlFor="verificationCode" className="block text-gray-600">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Verify Code
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

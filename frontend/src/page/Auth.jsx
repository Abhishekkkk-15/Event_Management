import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
// import {useDispatch} from 'react-redux';
import { loginSuccess } from "../store/slice/user.slice";
import { useDispatch,useSelector } from "react-redux";
import { LOGIN_MUTATION } from "../graphql/mutation/user";


export default function Login() {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ variables: { input: { email, password } } }); 
      console.log("Login Successful:", response.data.login);
      dispatch(loginSuccess(response.data.login));
      setTimeout(() => {
        
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {location?.state ? "Login First" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-600 mb-6">Login to continue exploring!</p>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              value={password}
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-2 mb-4">
              {error.message}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 flex justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 00-9.516 6.41A8 8 0 014 12z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <Link to="/forget-password" className="text-purple-500 hover:text-purple-600 text-sm transition">
            Forgot Password?
          </Link>
        </div>

        {/* Or Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-4 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signUp" className="text-purple-500 hover:text-purple-600 transition">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_MUTATION } from "../graphql/mutation/user";
import { loginSuccess } from "../store/slice/user.slice";
import loginImage from "../assets/login-image.webp"; // Add your image here

export default function Login() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ variables: { input: { email, password } } });
      dispatch(loginSuccess(response.data.login));
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 h-screen bg-gray-100">
        <img src={loginImage} alt="Login" className="object-cover w-full h-full" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {location?.state ? "Login First" : "Welcome Back"}
          </h2>
          <p className="text-center text-gray-600">Login to continue exploring!</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700" htmlFor="email">Email</label>
              <input id="email" type="email" value={email} placeholder="Enter your email" 
                     onChange={(e) => setEmail(e.target.value)} 
                     className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" required />
            </div>

            <div>
              <label className="block font-medium text-gray-700" htmlFor="password">Password</label>
              <input id="password" type="password" value={password} placeholder="Enter your password" 
                     onChange={(e) => setPassword(e.target.value)} 
                     className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" required />
            </div>

            {error && <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-2">{error.message}</div>}

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <div className="text-center">
            <Link to="/forget-password" className="text-blue-500 hover:text-blue-600 text-sm">Forgot Password?</Link>
          </div>

          <div className="flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">Don't have an account? <Link to="/signUp" className="text-blue-500 hover:text-blue-600">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

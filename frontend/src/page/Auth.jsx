import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_MUTATION } from "../graphql/mutation/user";
import { loginSuccess } from "../store/slice/user.slice";
import loginImage from "../assets/login-image.webp"; // Add your image here
import { CiSearch } from "react-icons/ci";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { showError, showSuccess } from "../utils/toast";

export default function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        variables: { input: { email, password } },
      });
      dispatch(loginSuccess(response.data.login));
      setTimeout(() => navigate("/"), 3000);
      showSuccess("Login successfully")
    } catch (err) {
      showError(error.message)
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center w-full ">
      {/* Login Form Container (Centered) */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
        <div className="w-full flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-[#C1C1C1]">
            {location?.state ? "Login First" : "Welcome Back"}
          </h2>
          <p className="text-[#FEFEFE]">Login to continue exploring!</p>

          <form
            onSubmit={handleLogin}
            className="space-y-4 w-[80%] flex flex-col items-center gap-6"
          >
            <div className="w-full flex flex-col items-center justify-center gap-3">
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="email"
                >
                  E-mail
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <input
                    type="text"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="email@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  className="block font-medium text-[#FEFEFE] float-start"
                  htmlFor="password"
                >
                  Password
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" , paddingRight:"10px"}}
                >
                  <input
                    type={showPassword ? "password":"text"}
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE] "
                    placeholder="********"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#FEFEFE]  focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                <div className="text-end w-full" style={{ marginTop: "7px" }}>
                  <Link
                    to="/forget-password"
                    className="text-[#C1C1C1] text-sm"
                  >
                    <span className="text-[#C1C1C1] text-sm">
                      Forgot Password?
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* {error && (
              <div className="bg-red-100 text-red-800 border-l-4 border-red-500 p-2 w-full text-center">
                {error.message}
              </div>
            )} */}

            <div
              className=" bg-[#F2F862] h-12 w-[100%] rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={(e) => handleLogin(e)}
            >
              <button className="bg-[#F2F862] ">Login</button>
            </div>
          </form>

          <div className="flex items-center w-full my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-[#C1C1C1]">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <div className="text-center w-full">
            <p className="text-sm text-[#C1C1C1]">
              Don't have an account?{" "}
              <Link to="/signUp" className="text-blue-500 hover:text-blue-600">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

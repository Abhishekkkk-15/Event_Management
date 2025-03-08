import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { showError, showSuccess } from "../utils/toast";
import { SIGN_UP_MUTATION } from "../graphql/mutation/user";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";
import { LOGIN_MUTATION } from "../graphql/mutation/user";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slice/user.slice";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [signUp, { loading, error, data }] = useMutation(SIGN_UP_MUTATION);
  const [login, { loading:loadingInlogin, error:errorInLogin }] = useMutation(LOGIN_MUTATION);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showError("All fields are required!");
      return;
    }
    if (!isValidEmail(email)) {
      showError("Invalid email format!");
      return;
    }
    try {
      const { data } = await signUp({
        variables: {
          user: { name, email, password },
        },
      });
      if (data) {
        showSuccess("SignUp Successfully");
      }
      const response = await login({
        variables: { input: { email:data?.signUp?.email, password } },
      });
      dispatch(loginSuccess(response.data.login));
      navigate('/')
    } catch (err) {
      showError(err.message);
      console.error("Error signing up:", err.message);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center w-full px-4">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-[#C1C1C1]">Create an Account</h2>
        <p className="text-[#FEFEFE]">Sign up to get started!</p>
        <div className="w-full flex flex-col items-center justify-center text-center gap-4">
          <form
            onSubmit={handleSubmit}
            className="w-[80%] flex flex-col items-center gap-7 "
          >
            <div className="w-full flex flex-col items-center justify-center text-center">
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="name"
                >
                  Name
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <input
                    type="text"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  className=" font-medium text-[#FEFEFE] float-start"
                  htmlFor="email"
                >
                  E-mail
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <input
                    type="email"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="email@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  className="float-start font-medium text-[#FEFEFE]"
                  htmlFor="password"
                >
                  Password
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{
                    border: "1px solid #C1C1C1",
                    paddingLeft: "15px",
                    paddingRight: "10px",
                  }}
                >
                  {loading || loadingInlogin && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white/30 backdrop-blur-sm">
                      <img src={loadingSvg} alt="Loading..." />
                    </div>
                  )}

                  <input
                    type={showPassword ? "password" : "text"}
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="********"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#FEFEFE]  focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            </div>

            <div
              type="submit"
              className=" bg-[#F2F862] h-12 w-[100%] rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={(e) => handleSubmit(e)}
            >
              <button className="bg-[#F2F862] ">SignUp</button>
            </div>
          </form>

          <div className="text-center w-full mt-3">
            <p className="text-sm text-[#C1C1C1]">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-[#F2F862]">Log in</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

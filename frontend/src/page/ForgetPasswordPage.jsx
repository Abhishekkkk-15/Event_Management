import React, { useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { useSelector } from "react-redux";
import { showError, showInfo, showSuccess } from "../utils/toast";
import { resetPassword} from "../REST_API/user";
import {  useParams } from "react-router-dom";

const ForgetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [RePassword, setRePassword] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [showPassword, setShowPassword] = useState(true);
  
  const { token } = useParams();
  console.log(token)

  const handleForgetPassword = async () => {
    if(newPassword != RePassword) return showInfo("New password does not match Repeat password")
    try {
      const { data } = await resetPassword({token:token,newPassword});
      console.log(data);
      showSuccess(data.message);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen   p-4">
      <Card className="w-[100%] max-w-lg p-6 shadow-lg border bg-[#000000] ">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 gap-3 w-full h-full ">
            {/* <Label htmlFor="name">Name</Label> */}
            <div className="w-full flex flex-col items-center justify-center gap-3">
              <div className="w-full flex flex-col items-center justify-center gap-2  ">
                <label
                  className="font-medium text-[#FEFEFE] w-[80%]  "
                  htmlFor="email"
                >
                  New Password
                </label>

                <div
                  className="h-10 w-[80%] bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <Input
                    id="name"
                    type={showPassword ? "password" : "text"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new Password"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE] "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#FEFEFE]  focus:outline-none " 
                    style={{marginRight:"10px"}}
                  >
                    {showPassword ? <FiEyeOff/> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center gap-2  ">
                <Label
                  className="font-medium text-[#FEFEFE] w-[80%]  "
                  htmlFor="email"
                >
                  Re Enter password
                </Label>

                <div
                  className="h-10 w-[80%] bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <Input
                    id="name"
                    type={showPassword ? "password" : "text"}
                    value={RePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    placeholder="Repeate Your Password"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE] "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#FEFEFE]  focus:outline-none " 
                    style={{marginRight:"10px"}}
                  >
                    {showPassword ? <FiEyeOff/> : <FiEye />}
                  </button>
                </div>
              </div>
              <div
                className=" bg-[#F2F862] h-12 w-[80%] rounded-3xl flex items-center justify-center cursor-pointer text-black"
                onClick={(e) => handleForgetPassword()}
                style={{ marginTop: "10px" }}
              >
                <button className="bg-[#F2F862] ">Update</button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPasswordPage;

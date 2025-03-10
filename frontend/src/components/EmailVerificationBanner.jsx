import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EmailVerificationBanner = () => {
  const user = useSelector((state) => state.auth.user);
  const [visible, setVisible] = useState(!user?.emailVerified);
  const navigate = useNavigate();

  if (!visible || user?.isVerified) return null;
  if (!user) return null;

  return (
    <div className="flex justify-between items-center w-full h-12 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-md shadow-md" style={{padding:"10px"}}>
      <div>
        <span>Please verify your email</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate("/verifyEmail")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md underline"
        >
          Verify Email
        </Button>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;

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
  if(!user) return null

  return (
    <Alert className="flex justify-between items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-md shadow-md">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-600" />
        <div>
        
          <AlertDescription>
            Please verify your email to access all features.
          </AlertDescription>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => navigate("/verifyEmail")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
        >
          Verify Email
        </Button>
        <button onClick={() => setVisible(false)} className="text-gray-600 hover:text-gray-800">
          <X className="w-5 h-5" />
        </button>
      </div>
    </Alert>
  );
};

export default EmailVerificationBanner;

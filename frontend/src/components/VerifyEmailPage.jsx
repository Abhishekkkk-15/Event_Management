import { useState } from "react";
import {
  sendVerificationEmail,
  verifyCode,
} from "../REST_API/emailVerification";
import { Badge } from "@/components/ui/badge";
import { showError, showSuccess } from "../utils/toast";

const VerifyEmailPage = ({onVerifyCode}) => {
  const [step, setStep] = useState("request"); 
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleSendVerification = async () => {
    setLoading(true);

    try {
      const { data } = await sendVerificationEmail();
      console.log(data);
      showSuccess(data.message);
      setStep("verify");
      setLoading(false)
    } catch (error) {
      showError("Failed to send verification email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (code) => {
    console.log(code)
    if (!code.trim()) {
      showError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await verifyCode(code);
      console.log(data);
      showSuccess(data.message);
      if (onVerifyCode) onVerifyCode();
    } catch (error) {
      showError("Incorrect Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-full max-w-md p-6 shadow-xl rounded-xl flex flex-col justify-center items-center text-center gap-3 ">
        <h2 className="text-2xl font-bold text-[#FEFEFE]">Verify Your Email</h2>
        {step === "request" ? (
          <>
            <p className="text-[#C1C1C1] mt-2">
              Click the button below to receive a verification email.
            </p>
            <div className=" bg-[#F2F862] h-10 w-[50%] rounded-3xl flex items-center justify-center cursor-pointer">
              <button
                onClick={handleSendVerification}
                disabled={loading}
                className="bg-[#F2F862]"
              >
                {loading ? "Sending..." : "Send Verification Email"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#FEFEFE]">
              Enter Verification Code
            </h2>

            <div
              className="h-10 w-[50%] bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
              style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
            >
              <input
                type="text"
                className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                onChange={(e) => setCode(e.target.value)}

              />
            </div>
            <div className=" bg-[#F2F862] h-10 w-[50%] rounded-3xl flex items-center justify-center cursor-pointer">
              <button
                onClick={()=>handleVerifyCode(code)}
                disabled={loading}
                className="bg-[#F2F862]"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </>
        )}
        <Badge className="mt-4 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg">
          Email Verification
        </Badge>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

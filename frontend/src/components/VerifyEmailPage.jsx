import { useState } from "react";
import { sendVerificationEmail, verifyCode } from "../REST_API/emailVerification";

const VerifyEmailPage = ({ onVerifyCode }) => {
  const [step, setStep] = useState("request"); // "request" or "verify"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");

  const handleSendVerification = async () => {
    setLoading(true);
    setMessage("");

    try {
      const {data} = await sendVerificationEmail(); // Backend function to send the email
      console.log(data)
      setMessage(data.message);
      setStep("verify");
    } catch (error) {
      setMessage("Failed to send verification email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setMessage("Please enter the verification code.");
      return;
    }

   
    const {data} = await verifyCode(code)
         console.log(data)

    setMessage(data.message);

    // try {
    //     const {data} = await verifyCode(code)
    //     console.log(data)

    //     setMessage(data.message);

    // } catch (error) {
    //   setMessage(error.message);
    //   console.log(error)
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 text-center">
      {step === "request" ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Verify Your Email</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Click the button below to receive a verification email.
          </p>
          <button
            onClick={handleSendVerification}
            disabled={loading}
            className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:bg-blue-400"
          >
            {loading ? "Sending..." : "Send Verification Email"}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Enter Verification Code</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            We've sent a code to your email. Enter it below to verify.
          </p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="mt-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleVerifyCode}
            disabled={loading}
            className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:bg-green-400"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </>
      )}

      {message && (
        <p className={`mt-3 text-sm font-medium ${message.includes("successfully") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyEmailPage;

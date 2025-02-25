import { useState } from "react";
import { sendVerificationEmail } from "../REST_API/emailVerification";
const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendVerification = async () => {
    setLoading(true);
    setMessage("");

    try {
      const {data} = await sendVerificationEmail() // Call the backend function to send the email
      console.log(data)
      setMessage("Verification email sent successfully. Check your inbox.");
    } catch (error) {
      setMessage("Failed to send verification email. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 text-center">
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

      {message && (
        <p className="mt-3 text-sm font-medium text-green-600 dark:text-green-400">{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;

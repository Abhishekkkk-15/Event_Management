import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { forgetEmail } from "../REST_API/user";
import { showError, showSuccess } from "../utils/toast";

const ForgetPasswordDialog = ({ open, setIsOpen }) => {
  const [email, setEmail] = useState("");

  const handleSubmit =async (e) => {
    try {
        e.preventDefault();
        e.stopPropagation();
        if (!email) return;
        const {data} = await forgetEmail(email); 
        setIsOpen(false);
        showSuccess(data.message)
    } catch (error) {
        console.log(error)
        showError(error.message)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-blue-600 hover:underline bg-black z-30">Forgot Password?</button>
      </DialogTrigger>
      <DialogContent data-modal="true" className="max-w-sm w-full p-6" style={{padding:"10px"}}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Reset Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Enter your email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full"  disabled={!email}>Send Reset Link</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgetPasswordDialog;

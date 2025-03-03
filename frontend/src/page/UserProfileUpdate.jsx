import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserProfileUpdate = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an avatar first!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avatar", file);

    try {
      const { data } = await axios.put("http://localhost:4000/user/updateUser", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload successful:", data);
      alert("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg p-6 shadow-lg border rounded-lg bg-white">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              {preview ? <AvatarImage src={preview} alt="User Avatar" /> : <AvatarFallback>U</AvatarFallback>}
            </Avatar>
            <div className="w-full">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="mt-1" />
            </div>
            <div className="w-full">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="mt-1" />
            </div>
            <div className="w-full">
              <Label htmlFor="avatar">Upload Avatar</Label>
              <Input id="avatar" type="file" onChange={handleFileChange} className="mt-1" />
            </div>
            <Button onClick={handleUpload} disabled={loading} className="w-full">
              {loading ? "Uploading..." : "Upload Avatar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileUpdate;

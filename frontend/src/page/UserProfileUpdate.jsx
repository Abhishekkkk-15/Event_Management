import React, { useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../utils/toast";

const UserProfileUpdate = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
   
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("avatar", file);

    try {
      const { data } = await axios.put(
        "http://localhost:4000/user/updateUser",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Upload successful:", data);
      showSuccess("Avatar uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Error while Updating Profile! Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen   p-4">
      <Card className="w-[100%] max-w-lg p-6 shadow-lg border bg-[#000000] ">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Update Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4 gap-3 w-full h-full ">
            <label className="relative cursor-pointer">
              <Avatar className="w-24 h-24">
                {preview ? (
                  <AvatarImage src={preview} alt="User Avatar" />
                ) : (
                  <AvatarImage src={user?.avatar} alt="User Avatar" />
                )}
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* <Label htmlFor="name">Name</Label> */}
            <div className="w-full flex flex-col items-center justify-center gap-3">
              <div className="w-full flex flex-col items-center justify-center gap-2  ">
                <label
                  className="font-medium text-[#FEFEFE] w-[80%]  "
                  htmlFor="email"
                >
                  Name
                </label>

                <div
                  className="h-10 w-[80%] bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`${user.name}`}
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE] "
                  />
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center gap-2  ">
                <label
                  className="font-medium text-[#FEFEFE] w-[80%]  "
                  htmlFor="email"
                >
                  E-mail
                </label>

                <div
                  className="h-10 w-[80%] bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <Input
                    id="name"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`${user.email}`}
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE] "
                  />
                </div>
              </div>
              {/* <div className="w-full flex flex-col items-center justify-center gap-2  ">
                <label
                  className="font-medium text-[#FEFEFE] w-[80%]  "
                  htmlFor="email"
                >
                  Password
                </label>

                <div
                  className="h-10 w-[80%] bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="*********"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                  />
                </div>
              </div> */}

              <div
                className=" bg-[#F2F862] h-12 w-[80%] rounded-3xl flex items-center justify-center cursor-pointer text-black"
                onClick={(e) => handleUpload()}
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

export default UserProfileUpdate;

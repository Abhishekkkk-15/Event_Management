import React, { useState } from "react";
import { useSelector } from "react-redux";
import { showError, showInfo, showSuccess } from "../utils/toast";
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
import loadingSvg from "/Double Ring@1x-1.0s-200px-200px.svg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const CreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [maxSlots, setMaxSlots] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length < 2 || selectedFiles.length > 3) {
      showInfo("You must upload between 2 and 3 images.");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 15MB in bytes
    for (const file of selectedFiles) {
      if (file.size > maxSize) {
        showInfo("Each Image Must be under 5MB.");
        return;
      }
    }
    setFiles(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showError("Please login to create an event");
      return;
    }
    if (files.length < 2) {
      showError("You need to upload at least two images.");
      return;
    }
    

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("maxSlots", maxSlots);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("startAt", startAt);
    formData.append("endAt", endAt);
    formData.append("userEmail", user.email);
    files.forEach((file) => formData.append("files", file));

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_REST_END_POINT}/events/create`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      showSuccess("Email will be sent when the event is approved and created");
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setMaxSlots("");
      setFiles([]);
      setImagePreviews([]);
      setPrice("");
      setCategory("");
      setStartAt("");
      setEndAt("");
    } catch (error) {
      showError("Upload failed. Try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (e, type) => {
    const time = e.target.value; // Example: "23:00"
    const [hours, minutes] = time.split(":").map(Number);

    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format

    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
    if (type == "endAt") setEndAt(formattedTime);
    if (type == "startAt") setStartAt(formattedTime);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Card className="w-full  flex justify-center items-center">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="w-[100%] flex flex-col items-center gap-5 "
          >
            <div className="w-[full] flex flex-col items-center justify-center text-center">
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  Title
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <input
                    type="text"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="Sports Event"
                    onChange={(e) => setTitle(e.target.value)}
                    minLength={5}
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  Location
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <input
                    type="text"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="New York"
                    onChange={(e) => setLocation(e.target.value)}
                    minLength={5}
                    maxLength={50}
                    required
                  />
                </div>
              </div>
              <div className="w-full ">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  Date
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE] "
                  style={{
                    border: "1px solid #C1C1C1",
                    paddingLeft: "15px",
                    paddingRight: "10px",
                  }}
                >
                  <input
                    type="date"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="John Doe"
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  Start Time
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{
                    border: "1px solid #C1C1C1",
                    paddingLeft: "15px",
                    paddingRight: "10px",
                  }}
                >
                  <input
                    type="time"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="John Doe"
                    onChange={(e) => handleTimeChange(e, "startAt")}
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  End Time
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{
                    border: "1px solid #C1C1C1",
                    paddingLeft: "15px",
                    paddingRight: "10px",
                  }}
                >
                  <input
                    type="time"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="11:00 PM"
                    onChange={(e) => handleTimeChange(e, "endAt")}
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  Max Slots
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{
                    border: "1px solid #C1C1C1",
                    paddingLeft: "15px",
                    paddingRight: "10px",
                  }}
                >
                  {loading && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white/30 backdrop-blur-sm">
                      <img src={loadingSvg} alt="Loading..." />
                    </div>
                  )}
                  <input
                    type="number"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="20"
                    onChange={(e) => setMaxSlots(e.target.value)}
                    min={20}
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  Category
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{
                    border: "1px solid #C1C1C1",
                    paddingLeft: "15px",
                    paddingRight: "10px",
                  }}
                >
                  <Select onValueChange={(value) => setCategory(value)}>
                    <SelectTrigger className="w-full border  rounded-3xl px-4 py-2 ">
                      <SelectValue
                        placeholder="Select Category"
                        className="text-gray-500 float-end"
                      />
                    </SelectTrigger>

                    <SelectContent className="w-full bg-[#F2F826] shadow-lg rounded-lg overflow-hidden">
                      {[
                        "Sports",
                        "Party",
                        "Tech",
                        "Education",
                        "Music",
                        "Concerts",
                      ].map((category, index) => (
                        <SelectItem
                          key={index + 1}
                          value={category}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  Price
                </label>
                <div
                  className="h-10 w-full bg-white/20 rounded-3xl flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{
                    border: "1px solid #C1C1C1",
                    paddingLeft: "15px",
                    paddingRight: "10px",
                  }}
                >
                  <input
                    type="text"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="1000"
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  className="font-medium text-[#FEFEFE] float-start"
                  htmlFor="text"
                >
                  Descripition
                </label>
                <div
                  className=" w-full bg-white/20 rounded-3xl  flex items-center px-4 shadow-lg text-[#FEFEFE]"
                  style={{ border: "1px solid #C1C1C1", paddingLeft: "15px" }}
                >
                  <textarea
                    type="text"
                    className="bg-white/20 h-full w-full outline-none placeholder:text-[#FEFEFE]"
                    placeholder="Some Descripition"
                    onChange={(e) => setDescription(e.target.value)}
                    minLength={100}
                    maxLength={600}
                    required
                  />
                </div>
              </div>

              <Label style={{ marginTop: "20px" }}>Upload Images (Min 2)</Label>
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                required
                style={{ marginTop: "15px" }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
            <div
              type="submit"
              className=" bg-[#F2F862] h-12 w-[100%] text-[#000000] text-[22px] rounded-3xl flex items-center justify-center cursor-pointer"
              onClick={(e) => handleSubmit(e)}
            >
              <button
                className="bg-[#F2F862] text-[#000000]"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventForm;

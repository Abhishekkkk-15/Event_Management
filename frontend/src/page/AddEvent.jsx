import React, { useState } from "react";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../utils/toast";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";

const CreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [maxSlots, setMaxSlots] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length < 2) {
      showError("You need to upload at least two images.");
      return;
    }
    if (!user) {
      showError("Please login to create an event");
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
      const { data } = await axios.post("http://localhost:4000/events/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Title</Label>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            
            <Label>Description</Label>
            <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            
            <Label>Location</Label>
            <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            
            <Label>Start At</Label>
            <Input type="time" value={startAt} onChange={(e) => setStartAt(e.target.value)} required />
            
            <Label>End At</Label>
            <Input type="time" value={endAt} onChange={(e) => setEndAt(e.target.value)} required />
            
            <Label>Max Slots</Label>
            <Input type="number" value={maxSlots} onChange={(e) => setMaxSlots(e.target.value)} required />
            
            <Label>Category</Label>
            <Input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
            
            <Label>Price</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            
            <Label>Upload Images (Min 2)</Label>
            <Input type="file" multiple onChange={handleFileChange} required />
            
            <div className="flex flex-wrap gap-2">
              {imagePreviews.map((src, index) => (
                <img key={index} src={src} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
              ))}
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventForm;

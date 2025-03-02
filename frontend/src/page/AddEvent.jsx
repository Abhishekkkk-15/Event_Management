import React, { useState } from "react";
import { useSelector } from "react-redux";
import { showError, showSuccess } from "../utils/toast";
import axios from "axios";

const CreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [maxSlots, setMaxSlots] = useState(0);
  const [files, setFiles] = useState([]);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // Convert FileList to an array
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

    // Append multiple files correctly
    files.forEach((file) => formData.append("files", file));
    console.log("Form Data:", formData);
    setLoading(true);

    try {
      const {data} = await axios.post("http://localhost:4000/events/create", formData,{
        withCredentials:true,
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });


      showSuccess("Email will be sent when the event is approved and created"); 
      console.log("Response:", data);

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setMaxSlots(0);
      setFiles([]);
      setPrice(0);
      setCategory("");
      setStartAt("");
      setEndAt("");
    } catch (error) {
      showError("Upload failed. Try again!");
      console.log(error)
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">
        Create Event
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          required
          className="w-full p-4 border"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter event description"
          required
          className="w-full p-4 border"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter event location"
          required
          className="w-full p-4 border"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-4 border"
        />
        <input
          type="text"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          placeholder="Start At"
          required
          className="w-full p-4 border"
        />
        <input
          type="text"
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          placeholder="End At"
          required
          className="w-full p-4 border"
        />
        <input
          type="number"
          value={maxSlots}
          onChange={(e) => setMaxSlots(e.target.value)}
          placeholder="Max Slots"
          required
          className="w-full p-4 border"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
          className="w-full p-4 border"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Event Price"
          required
          className="w-full p-4 border"
        />
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          required
          className="w-full p-4 border"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEventForm;

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { CREATE_EVENT } from "../graphql/mutation/event";
import { showError, showSuccess } from "../utils/toast";

const CreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [maxSlots, setMaxSlots] = useState(0);
  const [files, setFiles] = useState([]);
  const [price, setPrice] = useState(0);
  const [category, setcategory] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, SetEndAT] = useState("");
  
  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length < 2) {
      alert("You need to upload at least two images.");
      return;
    }


    const fileArray = Array.from(files); // Convert FileList to an array

    try {
      await createEvent({
        variables: {
          event: {
            title,
            description,
            location,
            date,
            maxSlots:Number(maxSlots),
            price:Number(price),
            category,
            startAt,
            endAt
          },
          files: fileArray,
        },
      }).then((res) => {
        showSuccess("Event Created")
      }).catch((error) => showError("Error while creating event"))
    } catch (err) {
      showError("Error while creating event")
      console.error("Error creating event:", err);
    }
  };

  const filePreviews = Array.from(files).map((file, index) => (
    <div key={index} className="w-32 h-32 mx-2 mb-2 rounded-md overflow-hidden shadow-lg">
      <img
        src={URL.createObjectURL(file)}
        alt={`Preview ${index}`}
        className="w-full h-full object-cover"
      />
    </div>
  ));

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-indigo-600">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700">
            Event Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-lg font-semibold text-gray-700">
            Event Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter event description"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-6">
          <label htmlFor="location" className="block text-lg font-semibold text-gray-700">
            Event Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter event location"
            required
          />
        </div>

        {/* Date */}
        <div className="mb-6">
          <label htmlFor="date" className="block text-lg font-semibold text-gray-700">
            Event Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Start AT*/}
        <div className="mb-6">
          <label htmlFor="maxSlots" className="block text-lg font-semibold text-gray-700">
          Start AT
          </label>
          <input
            id="maxSlots"
            type="text"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        {/* End at */}
        <div className="mb-6">
          <label htmlFor="maxSlots" className="block text-lg font-semibold text-gray-700">
         End AT
          </label>
          <input
            id="maxSlots"
            type="text"
            value={endAt}
            onChange={(e) => SetEndAT(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        {/* Max slots */}
        <div className="mb-6">
          <label htmlFor="maxSlots" className="block text-lg font-semibold text-gray-700">
            Max Slots
          </label>
          <input
            id="maxSlots"
            type="number"
            value={maxSlots}
            onChange={(e) => setMaxSlots(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        {/* Category */}
        <div className="mb-6">
          <label htmlFor="maxSlots" className="block text-lg font-semibold text-gray-700">
             Category
          </label>
          <input
            id="Category"
            type="text"
            value={category}
            onChange={(e) => setcategory(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label htmlFor="price" className="block text-lg font-semibold text-gray-700">
            Event Price
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter event price"
            required
          />
        </div>

        {/* File Upload (Multiple files) */}
        <div className="mb-6">
          <label htmlFor="files" className="block text-lg font-semibold text-gray-700">
            Upload Event Images (At least 2 images)
          </label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Preview of uploaded images */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Image Previews</h2>
          <div className="flex space-x-4">{filePreviews}</div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mt-4 text-red-500 text-center">
            <p>Error: {error.message}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateEventForm;

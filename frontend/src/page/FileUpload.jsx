import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

// Define the GraphQL Mutation
const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($file: Upload!) {
    uploadAvatar(file: $file)
  }
`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadAvatar, { data, loading, error }] = useMutation(UPLOAD_AVATAR);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const response = await uploadAvatar({ variables: { file }});
      console.log("Upload response:", response);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div>
      <h2>GraphQL File Upload</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {data && <p>Upload Success: {data.uploadAvatar}</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
  );
};

export default FileUpload;

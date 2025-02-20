import React, { useState } from "react";
import { useMutation ,gql} from "@apollo/client";
// import { gql } from "graphql-tag";

// Define the GraphQL mutation
const SIGN_UP_MUTATION = gql`
  mutation signUp($user: SignUpInput!) {
    signUp(user: $user) {
      # id
      name
      email
      # createdAt
    }
  }
`;

const SignUp = () => {
  // Local state for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Apollo mutation hook
  const [signUp, { loading, error, data }] = useMutation(SIGN_UP_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await signUp({
        variables: {
          user: {
            name,
            email,
            password
          },
        },
      });

      if (data) {
        console.log("User signed up:", data.signUp);
        // Handle post-signup logic (e.g., redirect or show success message)
      }
    } catch (err) {
      console.error("Error signing up:", err.message);
    }
  };

  return (
    <div className="signUp-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      {error && <p>Error: {error.message}</p>}
      {data && <p>Signup successful! Welcome, {data.signUp.name}.</p>}
    </div>
  );
};

export default SignUp;

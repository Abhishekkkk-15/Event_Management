import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import './custom-toast.css'
import App from "./App.jsx";
import { Provider } from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/store.js";

const client = new ApolloClient({
  link: createUploadLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include", // Ensures cookies are included in requests
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
        <ToastContainer
         position="bottom-center"
         autoClose={2000}
         hideProgressBar={true}
         closeOnClick
         pauseOnHover
         draggable
         /> 
      </Provider>
    </ApolloProvider>
  // </StrictMode>
);

import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { CredentialsProvider } from "./context/CredentialsProvider.jsx";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <CredentialsProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </CredentialsProvider>
  </React.StrictMode>
);

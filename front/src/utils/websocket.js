// src/socket.js
import { io } from "socket.io-client";

const baseURL = process.env.REACT_APP_API_URL;

const socket = io(baseURL);


socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("message", (data) => {
  console.log("Message from server:", data);
});

export default socket;

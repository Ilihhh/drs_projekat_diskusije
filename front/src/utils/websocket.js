// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // URL backend servera

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("message", (data) => {
  console.log("Message from server:", data);
});

export default socket;

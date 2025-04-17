import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
  const token = localStorage.getItem("token");

  if (!socket && token) {
    socket = io("http://localhost:5000", {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToChatMessages = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on("chatMessage", callback);
  }
};

export const unsubscribeFromChatMessages = () => {
  const socket = getSocket();
  if (socket) {
    socket.off("chatMessage");
  }
};

export const sendChatMessage = (message) => {
  const socket = getSocket();
  if (socket) {
    socket.emit("chatMessage", message);
  }
};

export const subscribeToEmergencyAlerts = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on("emergencyAlert", callback);
  }
};

export const unsubscribeFromEmergencyAlerts = () => {
  const socket = getSocket();
  if (socket) {
    socket.off("emergencyAlert");
  }
};

export const subscribeToTaskUpdates = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on("taskUpdate", callback);
  }
};

export const unsubscribeFromTaskUpdates = () => {
  const socket = getSocket();
  if (socket) {
    socket.off("taskUpdate");
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  subscribeToChatMessages,
  unsubscribeFromChatMessages,
  sendChatMessage,
  subscribeToEmergencyAlerts,
  unsubscribeFromEmergencyAlerts,
  subscribeToTaskUpdates,
  unsubscribeFromTaskUpdates,
};

"use client";

import { socket } from "@/app/_utils/webSocket/webSocketConfig";

export default function JoinUser({ token }) {
  const handleJoinUser = async () => {
    socket.emit("addMember", { token }, (response) => {
      if (!response) {
        console.error("Error joining workspace.");
      }
    });

    window.close();
  };

  return (
    <button
      className="bg-green-500 hover:bg-green-600 text-white text-xl px-4 py-2 mt-6 rounded-md"
      onClick={handleJoinUser}
    >
      Join
    </button>
  );
}

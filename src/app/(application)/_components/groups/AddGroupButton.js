"use client";

import { createNewItem } from "@/app/_utils/helpers/helper";
import { socket } from "@/app/_utils/webSocket/webSocketConfig";
import { setBoardData } from "@/redux/feautres/boardSlice";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

export default function AddGroupButton({ module, isAdmin }) {
  const dispatch = useDispatch();
  const { boardId, type: boardType, groups = [] } = useSelector((state) => state.board.data);

  const handleAddGroup = () => {
    if (!isAdmin) return;

    const newItem = createNewItem(module, boardType);

    socket.emit("createItem", { boardId, type: boardType, item: newItem }, (response) => {
      if (!response) {
        return console.error("Error creating item.");
      }

      const newGroup = { groupName: `New Group ${groups.length + 1}` };

      socket.emit("addGroupToBoard", { boardId, group: newGroup, itemId: response.itemId }, (response) => {
        if (!response) {
          return console.error("Error adding group to board.");
        }

        dispatch(setBoardData(response));
      });
    });
  };

  return (
    <button title={isAdmin ? "Click to add a new group" : "You are not an admin"} onClick={handleAddGroup} disabled={!isAdmin} className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all ${isAdmin ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-400 text-white cursor-not-allowed"}`}>
      <Plus className="w-5 h-5 text-white" />
      <span>Add Group</span>
    </button>
  );
}

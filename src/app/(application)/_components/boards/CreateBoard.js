"use client";

import { appButtonColors } from "@/app/_utils/constants/colors";
import { socket } from "@/app/_utils/webSocket/webSocketConfig";
import { addBoard } from "@/redux/feautres/workspaceSlice";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function CreateBoard({ module, workspaceId }) {
  const [boardName, setBoardName] = useState("");
  const [boardType, setBoardType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("boardAdded", (data) => {
      console.log("boardAdded: ", data);

      for (const board of data) {
        dispatch(addBoard(board));
      }

      setBoardName("");
      setBoardType("");
      setLoading(false);
    });

    return () => {
      socket.off("boardAdded");
    };
  }, [dispatch]);

  const appButtonColor = appButtonColors[module];

  const handleCreateBoard = (event) => {
    event.preventDefault();

    if (!boardName.trim()) {
      setError("Board name is required");
      return;
    }

    const board = {
      boardName,
      type: boardType,
      createdById: Cookies.get("userId"),
    };

    setLoading(true);

    socket.emit(
      "addBoardToWorkspace",
      { id: workspaceId, board },
      (response) => {
        if (!response) {
          setError("Error creating board.");
          setLoading(false);
          return;
        }

        console.log(response);

        // for (const board of response) {
        //   dispatch(addBoard(board));
        // }

        // setBoardName("");
        // setBoardType("");
        // setLoading(false);
      }
    );
  };

  const getOptionsForModule = () => {
    switch (module) {
      case "service":
        return [{ value: "Ticket", label: "Ticket" }];
      case "dev":
        return [
          { value: "Bug", label: "Bug" },
          { value: "Sprint", label: "Sprint" },
        ];
      case "crm":
        return [{ value: "Lead", label: "Lead" }];
      default:
        return [];
    }
  };

  const moduleOptions = getOptionsForModule();

  const isWorkManagement = module === "work-management";
  const isCreateDisabled =
    !boardName.trim() || (!isWorkManagement && !boardType.trim()) || loading;

  return (
    <form onSubmit={handleCreateBoard} className="mt-1 max-w-md">
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={boardName}
          onChange={(event) => setBoardName(event.target.value)}
          placeholder="Enter board name"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {moduleOptions.length > 0 && (
          <select
            value={boardType}
            onChange={(event) => setBoardType(event.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select type
            </option>
            {moduleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          disabled={isCreateDisabled}
          title={isCreateDisabled ? "Enter Board Name" : "Create Board"}
          className={`px-6 py-2 text-white rounded-lg ${
            isCreateDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : `${appButtonColor}`
          }`}
        >
          {loading ? "Creating..." : "Create"}
        </button>

        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    </form>
  );
}

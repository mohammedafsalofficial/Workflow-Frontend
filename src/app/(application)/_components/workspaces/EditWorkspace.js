"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "@/app/_utils/webSocket/webSocketConfig";
import { deleteWorkspace } from "@/redux/feautres/userDetailsSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { updateWorkspaceData } from "@/redux/feautres/workspaceSlice";

export default function EditWorkspace({
  isDialogOpen,
  setIsDialogOpen,
  module,
  workspaceId,
  workspaceName,
}) {
  const [newWorkspaceName, setNewWorkspaceName] = useState(workspaceName);
  const [deleteInput, setDeleteInput] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    socket.on("workspaceNameUpdated", (data) => {
      console.log("workspaceNameUpdated: ", data);
      dispatch(
        updateWorkspaceData({
          field: "workspaceName",
          value: data.workspaceName,
        })
      );
    });

    socket.on("workspaceDeleted", (data) => {
      console.log("workspaceDeleted: ", data);
      if (data === workspaceId) {
        router.push(`/${module}/view/dashboard`);
      }
    });

    return () => {
      socket.off("workspaceNameUpdated");
    };
  }, [dispatch, router, module, workspaceId]);

  const handleEditWorkspace = () => {
    socket.emit(
      "updateWorkspaceById",
      {
        id: workspaceId,
        updateData: { workspaceName: newWorkspaceName },
        moduleId: Cookies.get("moduleId"),
      },
      (response) => {
        if (!response) {
          console.error("Error updating workspace.");
          return;
        }
      }
    );

    setIsDialogOpen(false);
  };

  const handleDeleteWorkspace = () => {
    if (deleteInput === `${module}/${workspaceName}`) {
      socket.emit(
        "deleteWorkspaceById",
        { id: workspaceId, moduleId: Cookies.get("moduleId") },
        (response) => {
          if (!response) {
            console.error("Error deleting workspace.");
            return;
          }

          Cookies.remove("workspaceId");
        }
      );

      dispatch(deleteWorkspace(workspaceId));

      router.push(`/${module}/view/dashboard`);

      setIsDialogOpen(false);
    } else {
      alert("Invalid input. Please enter the correct combination.");
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Workspace</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <TextField
            label="Workspace Name"
            value={newWorkspaceName}
            onChange={(event) => setNewWorkspaceName(event.target.value)}
            fullWidth
          />
          <TextField
            label="Delete Confirmation"
            placeholder={`Enter ${module}/${workspaceName}`}
            value={deleteInput}
            onChange={(event) => setDeleteInput(event.target.value)}
            fullWidth
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleEditWorkspace} color="primary">
          Save
        </Button>
        <Button
          onClick={handleDeleteWorkspace}
          color="warning"
          disabled={deleteInput !== `${module}/${workspaceName}`}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

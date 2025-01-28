"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addWorkspace } from "@/redux/feautres/userDetailsSlice";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { socket } from "@/app/_utils/webSocket/webSocketConfig";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  outline: "none",
};

export default function WorkspaceModal({ onClose }) {
  const [workspaceName, setWorkspaceName] = useState("");
  const dispatch = useDispatch();

  const handleWorkspaceCreation = () => {
    if (!workspaceName.trim() || !socket) return;

    socket.emit(
      "createWorkspace",
      {
        moduleId: Cookies.get("moduleId"),
        workspaceData: {
          createdBy: Cookies.get("userId"),
          workspaceName: workspaceName.trim(),
        },
      },
      (response) => {
        if (!response) {
          console.error("Error creating workspace.");
          return;
        }

        dispatch(
          addWorkspace({
            workspaceId: response.workspaceId,
            workspaceName: response.workspaceName,
          })
        );

        onClose();
      }
    );
  };

  return (
    <Modal open onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography id="modal-title" variant="h5" fontWeight="bold">
            🚀 Create Your Workspace
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Start organizing your projects and collaborating seamlessly.
        </Typography>
        <TextField
          fullWidth
          label="Workspace Name"
          variant="outlined"
          sx={{ mt: 3 }}
          value={workspaceName}
          onChange={(event) => setWorkspaceName(event.target.value)}
        />
        <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 4 }}>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleWorkspaceCreation}
            disabled={!workspaceName.trim()}
          >
            Create Workspace
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

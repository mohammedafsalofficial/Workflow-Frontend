import { socket } from "@/app/_utils/webSocket/webSocketConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchBoardsByWorkspaceId = createAsyncThunk("workspace/fetchBoardsByWorkspaceId", async (workspaceId, { rejectWithValue }) => {
  return new Promise((resolve) => {
    socket.emit("getBoardsByWorkspaceById", { id: workspaceId }, (response) => {
      if (!response) {
        return rejectWithValue("Error fetching boards by workspace Id.");
      }
      resolve(response);
    });
  });
});

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    workspaceId: null,
    workspaceName: "",
    boards: [],
    members: [],
    loading: false,
    error: null,
  },
  reducers: {
    setWorkspaceData: (state, action) => {
      const { workspaceId, workspaceName, boards, members } = action.payload;
      state.workspaceId = workspaceId;
      state.workspaceName = workspaceName;
      state.boards = boards || [];
      state.members = members || [];
      state.error = null;
    },
    clearWorkspaceData: (state) => {
      state.workspaceId = null;
      state.workspaceName = "";
      state.boards = [];
      state.members = [];
      state.error = null;
    },
    addBoard: (state, action) => {
      state.boards.push(action.payload);
    },
    removeBoard: (state, action) => {
      state.boards = state.boards.filter((board) => board.boardId !== action.payload);
    },
    updateWorkspaceData: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
      console.log("Workspace slice: ", state.workspaceName);
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardsByWorkspaceId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardsByWorkspaceId.fulfilled, (state, action) => {
        const { workspaceId, workspaceName, boards, members } = action.payload;
        state.workspaceId = workspaceId;
        state.workspaceName = workspaceName;
        state.boards = boards || [];
        state.members = members || [];
        state.loading = false;
      })
      .addCase(fetchBoardsByWorkspaceId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setWorkspaceData, clearWorkspaceData, addBoard, removeBoard, updateWorkspaceData, setMembers } = workspaceSlice.actions;

export default workspaceSlice.reducer;

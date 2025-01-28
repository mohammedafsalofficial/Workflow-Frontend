const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  favoriteWorkspaces: [],
  favoriteBoards: [],
};

const favoritesSlice = createSlice({
  initialState,
  name: "favorites",
  reducers: {
    setFavoriteWorkspaces: (state, action) => {
      state.favoriteWorkspaces = action.payload;
    },
    setFavoriteBoards: (state, action) => {
      state.favoriteBoards = action.payload;
    },
    addWorkspaceToFavorites: (state, action) => {
      state.favoriteWorkspaces.push(action.payload);
    },
    removeWorkspaceFromFavorites: (state, action) => {
      state.favoriteWorkspaces = state.favoriteWorkspaces.filter(
        (workspace) => workspace.workspaceId !== action.payload
      );
    },
    addBoardToFavorites: (state, action) => {
      state.favoriteBoards.push(action.payload);
    },
    removeBoardFromFavorites: (state, action) => {
      state.favoriteBoards = state.favoriteBoards.filter(
        (board) => board.boardId !== action.payload
      );
    },
  },
});

export const {
  setFavoriteBoards,
  setFavoriteWorkspaces,
  addWorkspaceToFavorites,
  removeWorkspaceFromFavorites,
  addBoardToFavorites,
  removeBoardFromFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

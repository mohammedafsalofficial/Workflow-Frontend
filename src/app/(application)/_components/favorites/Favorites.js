"use client";

import { FavoriteWorkspaces } from "./FavoriteWorkspaces";
import { FavoriteBoards } from "./FavoriteBoards";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { socket } from "@/app/_utils/webSocket/webSocketConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  addBoardToFavorites,
  addWorkspaceToFavorites,
  removeBoardFromFavorites,
  removeWorkspaceFromFavorites,
  setFavoriteBoards,
  setFavoriteWorkspaces,
} from "@/redux/feautres/favoritesSlice";

export default function FavoriteWorkspacesAndBoards({ module }) {
  const { favoriteWorkspaces, favoriteBoards } = useSelector(
    (state) => state.favorites
  );
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit(
      "getFavourite",
      { userId: Cookies.get("userId"), type: module },
      (response) => {
        if (!response) {
          console.error("Error getting favorite data.");
          return;
        }

        dispatch(setFavoriteWorkspaces(response.workspaces));
        dispatch(setFavoriteBoards(response.boards));
      }
    );

    socket.on("addFavouriteWorkspace", (data) => {
      dispatch(addWorkspaceToFavorites(data));
    });

    socket.on("removeFavouriteWorkspace", (data) => {
      dispatch(removeWorkspaceFromFavorites(data.workspaceId));
    });

    socket.on("addBoardToFavourite", (data) => {
      dispatch(addBoardToFavorites(data.board));
    });

    socket.on("removeBoardFromFavourite", (data) => {
      dispatch(removeBoardFromFavorites(data.boardId));
    });

    return () => {
      socket.off("addBoardToFavourite");
      socket.off("removeBoardFromFavourite");
    };
  }, [module, dispatch]);

  console.log(favoriteWorkspaces);
  return (
    <div className="p-6 rounded-lg shadow-md">
      <FavoriteWorkspaces module={module} workspaces={favoriteWorkspaces} />
      <FavoriteBoards module={module} boards={favoriteBoards} />
    </div>
  );
}

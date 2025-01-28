"use client";

import { useDispatch, useSelector } from "react-redux";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceMembers from "./WorkspaceMembers";
import CreateBoard from "../boards/CreateBoard";
import BoardsDisplay from "../boards/BoardsDisplay";
import { useEffect } from "react";
import { fetchBoardsByWorkspaceId } from "@/redux/feautres/workspaceSlice";
import { setCookies } from "@/app/_utils/helpers/cookies";
import useCheckUserRole from "../../hooks/useCheckUserRole";
import Cookies from "js-cookie";

export default function WorkspaceDisplay({ module, workspaceId }) {
  const { workspaceName, members, loading, error } = useSelector(
    (state) => state.workspace
  );
  const { isAdmin } = useCheckUserRole(Cookies.get("userId"), workspaceId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBoardsByWorkspaceId(workspaceId));
    setCookies("workspaceId", workspaceId);
  }, [workspaceId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-500 italic">Loading Workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <WorkspaceHeader
        module={module}
        isAdmin={isAdmin}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
        members={members}
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <section className="bg-white rounded-lg shadow-lg p-6 space-y-10">
          <WorkspaceMembers
            module={module}
            workspaceId={workspaceId}
            members={members}
          />

          <div className="space-y-8">
            {isAdmin && (
              <div>
                <h1 className="text-2xl font-semibold">Create Board</h1>
                <CreateBoard module={module} workspaceId={workspaceId} />
              </div>
            )}

            <div>
              <h1 className="text-2xl font-semibold">Boards</h1>
              <BoardsDisplay module={module} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

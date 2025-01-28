"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CreateWorkspaceButton from "../workspaces/CreateWorkspaceButton";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { fetchBoardsByWorkspaceId } from "@/redux/feautres/workspaceSlice";
import { moduleColors } from "@/app/_utils/constants/colors";
import { socket } from "@/app/_utils/webSocket/webSocketConfig";

export default function AppSidebar({ module }) {
  const dispatch = useDispatch();
  const [workspaces, setWorkspaces] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const bgColor = moduleColors[module] || "bg-gray-100";

  useEffect(() => {
    socket.on("workspacesUpdated", (data) => {
      console.log("Updated workspaces: ", data);
      setWorkspaces(data);
    });

    return () => {
      socket.off("workspacesUpdated");
    };
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = () => {
    socket.emit(
      "getWorkspaces",
      { moduleId: Cookies.get("moduleId"), token: Cookies.get("authToken") },
      (response) => {
        if (!response) {
          setFetchError("Error getting workspaces.");
          return;
        }

        console.log("Get workspaces: ", response);

        setWorkspaces(response);
      }
    );
  };

  const handleWorkspaceSelect = (workspaceId) => {
    dispatch(fetchBoardsByWorkspaceId(workspaceId));
  };

  const sidebarLinks = [
    {
      title: "Dashboard",
      url: `/${module}/view/dashboard`,
      icon: BarChartIcon,
    },
    {
      title: "Favorites",
      url: `/${module}/view/favorites`,
      icon: Star,
    },
  ];

  console.log(workspaces);

  return (
    <Sidebar className="min-h-screen bg-white shadow-xl">
      <SidebarContent className={`${bgColor} shadow-lg rounded-r-xl`}>
        <SidebarGroup>
          <div className="mt-16"></div>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Static Links */}
              {sidebarLinks.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={link.url}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition duration-200"
                    >
                      <link.icon className="text-gray-600" />
                      <span className="font-medium text-gray-800">
                        {link.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <CreateWorkspaceButton />

              {/* Workspace Selection */}
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full flex justify-between items-center bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg px-4 py-2">
                      <span>Select Workspace</span>
                      <ChevronDown className="ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full mt-2 max-h-60 overflow-y-auto bg-white rounded-lg shadow-md">
                    {fetchError ? (
                      <div className="text-red-500 text-center p-2">
                        {fetchError}
                      </div>
                    ) : workspaces.length === 0 ? (
                      <div className="text-center text-gray-600 p-4">
                        No workspaces available
                      </div>
                    ) : (
                      workspaces.map((workspace) => (
                        <Link
                          key={workspace.workspaceId}
                          href={`/${module}/workspace/${workspace.workspaceId}`}
                          onClick={() =>
                            handleWorkspaceSelect(workspace.workspaceId)
                          }
                          className="block border border-gray-300 rounded-md p-3 mb-2 hover:bg-gray-200 transition"
                        >
                          {workspace.workspaceName}
                        </Link>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

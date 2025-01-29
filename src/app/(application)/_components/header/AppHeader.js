"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Bell, RefreshCcw } from "lucide-react";
import ModuleSwitcher from "./ModuleSwitcher";
import UserProfile from "./UserProfile";
import NotificationsModal from "./NotificationsModal";
import { socket } from "@/app/_utils/webSocket/webSocketConfig";
import { workflowBackend } from "@/app/_utils/api/axiosConfig";
import Cookies from "js-cookie";
import { appBgColors, moduleColors } from "@/app/_utils/constants/colors";
import Image from "next/image";

export default function AppHeader({ module }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await workflowBackend.get("/users/getuserdetails", {
        params: {
          userId: Cookies.get("userId"),
        },
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    if (!userDetails) return;

    setNotifications(userDetails.notifications || []);
    setUnreadCount(userDetails.notifications?.filter((n) => n.status === "Unread").length || 0);

    socket.on("newNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [userDetails]);

  const bgColor = moduleColors[module] || "bg-gray-50";
  const appBgColor = appBgColors[module];
  const moduleName = module
    .split("-")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");

  return (
    <header className={`${bgColor} text-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-50 border-b border-gray-200 shadow-sm`}>
      <nav className="flex items-center justify-between w-full">
        <h1 className="text-slate-800 text-2xl font-semibold">
          WorkFlow <span className="font-light">{moduleName}</span>
        </h1>

        <div className="hidden md:flex items-center bg-gray-100 px-5 py-3 rounded-full shadow-sm w-1/3">
          <Search className="text-gray-500" size={16} />
          <input type="text" placeholder="Search..." className="ml-2 flex-grow bg-transparent text-gray-700 outline-none" />
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative cursor-pointer" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
            <Bell className="text-gray-600 hover:text-gray-800 transition" size={20} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{unreadCount}</span>}
          </div>

          <div className="cursor-pointer hover:bg-gray-200 p-2 rounded-full" onClick={() => setIsModalOpen(true)}>
            <RefreshCcw className="text-gray-600" size={24} />
          </div>

          <div className="cursor-pointer rounded-full bg-gray-200" onClick={() => setIsProfileOpen(true)}>
            {userDetails?.picture ? <Image src={userDetails.picture.startsWith("http") ? userDetails.picture : `data:image/png;base64,${userDetails.picture}`} alt="Profile" height={100} width={100} className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg">{userDetails?.fullname?.charAt(0).toUpperCase()}</div>}
          </div>
        </div>
      </nav>

      {isNotificationsOpen && <NotificationsModal isOpen={isNotificationsOpen} setIsOpen={setIsNotificationsOpen} setUnreadCount={setUnreadCount} notifications={notifications} setNotifications={setNotifications} bgColor={appBgColor} />}
      <ModuleSwitcher isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <UserProfile isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen} userDetails={userDetails} />
    </header>
  );
}

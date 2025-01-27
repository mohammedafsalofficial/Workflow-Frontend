import AppHeader from "@/app/(application)/_components/header/AppHeader";
import AppSidebar from "@/app/(application)/_components/header/AppSidebar";
import { workflowBackend } from "@/app/_utils/api/axiosConfig";
import { moduleBackgrounds, moduleColors } from "@/app/_utils/constants/colors";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function Layout({ children, params }) {
  const { module } = await params;
  const cookieStore = await cookies();

  const bgColor = moduleColors[module] || "bg-gray-200";
  const sectionBgColor = moduleBackgrounds[module] || "bg-gray-100";

  const response = await workflowBackend.get("/users/getuserdetails", {
    params: {
      userId: cookieStore.get("userId").value,
    },
    headers: {
      Authorization: `Bearer ${cookieStore.get("authToken").value}`,
    },
  });

  const userDetails = response.data;

  return (
    <div className={`flex flex-col min-h-screen ${bgColor}`}>
      <AppHeader module={module} userDetails={userDetails} />
      <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar module={module} />
          <main className="flex-1">
            <SidebarTrigger />
            <section
              className={`min-h-32 ${sectionBgColor} mb-5 ml-7 -mt-7 rounded-l-3xl`}
            >
              {children}
            </section>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}

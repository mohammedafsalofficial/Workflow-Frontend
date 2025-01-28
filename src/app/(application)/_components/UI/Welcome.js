import {
  appGradients,
  welcomeDescriptions,
} from "@/app/_utils/constants/colors";
import { greetBasedOnTime } from "@/app/_utils/helpers/helper";
import { cookies } from "next/headers";

export default async function Welcome({ view, module }) {
  const cookieStore = await cookies();

  const fullName = cookieStore.get("fullName")?.value || "User";

  const bgGradient = appGradients[module] || "from-gray-400 to-gray-600";

  return (
    <div
      className={`bg-gradient-to-r ${bgGradient} text-white rounded-3xl py-8 px-10 shadow-md`}
    >
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold leading-tight inline bg-gray-700 px-2 py-1 rounded-md">
          {greetBasedOnTime()} <span>{fullName || "User"}!</span>
        </h1>
        <p className="text-lg text-gray-100 font-normal">
          {welcomeDescriptions[view] || "Welcome to your workspace!"}
        </p>
        <div className="mt-6">
          <div className="h-1 w-1/2 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

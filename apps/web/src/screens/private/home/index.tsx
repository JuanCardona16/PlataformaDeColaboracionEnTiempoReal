import {
  Home,
  MessageCircleMore,
  LayoutDashboard,
  Vote,
  Bell,
  Settings,
  Search
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { useGlobalStore } from "../../../core/zustand/global_state";

const HomePage = () => {
  const { profile, auth } = useGlobalStore();

  return (
    <div className="w-full h-screen flex">
      <section className="w-[300px] bg-white h-screen flex flex-col shadow-lg">
        {/* Top section: Logo and Overview */}
        <div className="flex items-center gap-3 p-5 border-b border-gray-200">
          <Link to={"/"} className="flex items-center justify-center gap-3">
            <div className="size-12 rounded-xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Vote className="size-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground">VoteSync</span>
          </Link>
        </div>

        {/* Search Bar */}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link
                to={"/"}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                <Home className="size-5" />
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to={"/my-rooms"}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                <LayoutDashboard className="size-5" />
                Mis Salas
              </Link>
            </li>
            <li>
              <Link
                to={"/chats"}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                <MessageCircleMore className="size-5" />
                Mensajes
              </Link>
            </li>
            <li>
              <button
                onClick={() => useGlobalStore.getState().logout()}
                className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100">
                Cerrar sesion
              </button>
            </li>
          </ul>
        </nav>

        {/* User Profile at bottom */}
        <div className="p-4 flex items-center gap-3 border-t border-gray-200 ">
          <div className="relative">
            <img
              src="https://placehold.co/400" // Placeholder for Sally Mindset
              alt="Profile"
              className="w-11 h-11 rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${auth.isOnline ? "bg-green-400" : "bg-gray-400"}`}></span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {profile.user?.profile.username || "Usuario"}
            </p>
            <p className="text-xs text-gray-500">
              {profile.user?.profile.email || "ejemplo@gmail.com"}
            </p>
          </div>
        </div>
      </section>
      <section className="w-full">
        <header className="py-4 px-6 flex justify-between items-center bg-white border-l border-b border-gray-200 h-[88px]">
          {/* Left section: Greeting and Question */}
          <div>
            <h1 className="text-md font-semibold text-gray-800">
              Buenos dias, {profile.user?.profile.username || "Usuario"}
            </h1>
            <p className="text-gray-600 text-sm">
              ¿Qué quieres <span className="text-yellow-500">hacer</span> hoy?
            </p>
          </div>

          {/* Right section: Profile Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-3 p-3 rounded-lg text-gray-700 bg-gray-100 cursor-pointer">
              <Search className="size-4.5" />
              <h3 className="text-gray-700 font-semibold text-sm">Ctrol + k</h3>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">
              <Bell className="size-5" />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">
              <Settings className="size-5" />
            </div>
          </div>
        </header>
        <section className="overflow-y-scroll p-2 h-[calc(100vh-88px)]">
          <Outlet />
        </section>
      </section>
    </div>
  );
};

export default HomePage;

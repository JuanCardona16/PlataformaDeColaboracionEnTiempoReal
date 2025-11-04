import React from "react";
import { useProfile } from "../../../features/user/hook";
import type { IUser } from "@repo/shared/types";
import { useGlobalStore } from "../../../core/zustand/global_state";

const ChatsScreen: React.FC = () => {
  const { auth } = useGlobalStore((state) => state);
  const { onlineUsers } = useProfile();

  console.log("Usuarios en linea desde la pagina de los chats: ", onlineUsers);

  return (
    <div className="h-full w-full grid grid-cols-[250px_1fr] bg-white rounded-md">
      <section className="px-4 py-2 h-full flex flex-col border-r border-gray-200">
        <h2 className="text-2xl font-bold">Chats</h2>
        <div className="mt-2">
          {onlineUsers.onlineUsers.map((user: Partial<IUser>) => (
            <div className="p-4 flex items-center gap-3 border-t border-gray-200 " key={user.profile?.email}>
              <div className="relative">
                <img
                  src="https://placehold.co/400" // Placeholder for Sally Mindset
                  alt="Profile"
                  className="w-9 h-9 rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${auth.isOnline ? "bg-green-400" : "bg-gray-400"}`}></span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {user.profile?.username || "Usuario"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="p-2 h-full">
        <h2 className="text-2xl font-bold">Mensajes</h2>
      </section>
    </div>
  );
};

export default ChatsScreen;

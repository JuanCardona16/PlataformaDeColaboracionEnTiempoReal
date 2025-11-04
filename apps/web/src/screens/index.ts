import { lazy } from "react";

export const LoginPage = lazy(() => import("./public/login"));
export const RegisterPage = lazy(() => import("./public/register"));
export const HomePage = lazy(() => import("./private/home"));
export const MainPage = lazy(() => import("./private/main"));
export const ProfilePage = lazy(() => import("./private/profile"));
export const ChatPage = lazy(() => import("./private/chats"));
export const MyRoomsPage = lazy(() => import("./private/room"));
export const RoomById = lazy(() => import("./private/room/roomId"));


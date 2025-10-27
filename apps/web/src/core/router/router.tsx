import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  MainPage,
  ProfilePage,
  RegisterPage,
} from "../../screens";
import { RootLayout } from "../../components/layouts/rootLayout";
import { AuthGuards } from "../security/auth_guard";

export const ApplicationRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={`/login`} element={<LoginPage />} />
        <Route path={`/register`} element={<RegisterPage />} />
        <Route element={<AuthGuards validation={true} />}>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<MainPage />} />
            <Route path="/my-rooms" element={<h2>Mis salas</h2>} />
            <Route path="/chats" element={<h2>Mis chats</h2>} />
            <Route path="profile" element={<ProfilePage />} />
            {/* <Route path="room/:uuid" element={<RoomPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

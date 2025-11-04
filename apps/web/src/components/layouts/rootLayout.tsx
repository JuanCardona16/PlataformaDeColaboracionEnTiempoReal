import { useGetById } from "../../features/user/queries";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  useGetById();

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

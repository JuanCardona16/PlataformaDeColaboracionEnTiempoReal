import { useGetById } from "../../features/user/queries";
import { HomePage } from "../../screens";

export const RootLayout = () => {
  // useSocket();
  useGetById();

  return (
    <>
      <main className="flex flex-col min-h-screen">
        <HomePage />
      </main>
    </>
  );
};

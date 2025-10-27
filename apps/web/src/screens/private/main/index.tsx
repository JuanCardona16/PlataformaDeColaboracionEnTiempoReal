import { useRoom } from "../../../features/room/hook/useRoom";
import imagen from "../../../assets/images/imagen-para-tarjeta-2.png";
import type { ICollaborativeRoom } from "@repo/shared/types";
import { CirclePlus } from "lucide-react";

const MainPage = () => {
  const { getAllRooms } = useRoom();

  console.log(getAllRooms.data);

  if (getAllRooms.isPending) {
    return <h1>Cargando Salas Disponibles...</h1>;
  }

  if (getAllRooms.isError) {
    return <h1>Hubo un error;</h1>;
  }

  return (
    <div className="p-1">
      <section className="flex justify-between items-center mb-4 p-2 select-none">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Salas disponibles</h2>
          <p className="text-sm text-gray-600">Explora, colabora y crea sin límites en tiempo real.</p>
        </div>
        <div>
          <button
            type="button"
            className="bg-gray-300/40 cursor-pointer rounded-lg py-2 px-4 mt-4 w-full select-none text-sm font-semibold flex justify-center items-center gap-2 hover:bg-gray-300/70">
            <CirclePlus className="size-5" />
            <p>Craer una Sala</p>
          </button>
        </div>
      </section>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {getAllRooms.data.map((room: ICollaborativeRoom) => (
          <div
            key={room.uuid}
            className="bg-white rounded-lg hover:shadow-md select-none overflow-hidden relative">
            <img
              src={imagen}
              alt="Fondo de la sala"
              className="w-full h-[200px]"
            />
            <div className="p-3">
              <div className="flex flex-col justify-between items-start gap-1">
                <h2 className="text-xl font-semibold">{room.name}</h2>
                <p>{room.description}</p>
              </div>
              <button
                type="button"
                className="bg-gray-300/50 cursor-pointer rounded-lg py-2 px-4 mt-4 w-full hover:bg-gray-300/70 select-none text-sm font-semibold">
                Ingresar a la Sala
              </button>
            </div>
            <span
              className={`absolute top-2 left-2 ${room.status === "active" ? "bg-green-500" : "bg-red-500"} px-2 py-1 rounded-md text-white text-sm font-semibold`}>
              {room.status ? "activa" : "inactiva"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;

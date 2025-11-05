import { useRoom } from "../../../features/room/hook/useRoom";
import imagen from "../../../assets/images/imagen-para-tarjeta-2.png";
import type { ICollaborativeRoom } from "@repo/shared/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "@/components/UI/alert-dialog";
import { useState } from "react";
import AggregateParticipantForm from "../room/components/agregate_participant_form";

const MainPage = () => {
  const { getAllRooms } = useRoom();
  const [open2, setOpen2] = useState(false);

  return (
    <div className="p-1">
      <div className="grid grid-cols-3 gap-4 mt-4">
        {getAllRooms.isPending ? (
          <div className="col-span-3 flex justify-center items-center h-40">
            <p className="text-gray-600">Cargando salas...</p>
          </div>
        ) : getAllRooms.isError ? (
          <div className="col-span-3 flex justify-center items-center h-40">
            <p className="text-red-600">
              Error al cargar las salas. Por favor, intenta de nuevo.
            </p>
          </div>
        ) : getAllRooms.data && getAllRooms.data.length > 0 ? (
          getAllRooms.data.map((room: ICollaborativeRoom) => (
            <div
              key={room.uuid}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 select-none overflow-hidden relative group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={imagen}
                  alt="Fondo de la sala"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <span
                  className={`absolute top-3 left-3 ${room.status === "active" ? "bg-green-500" : "bg-red-500"} px-3 py-1 rounded-full text-white text-xs font-semibold shadow-md`}>
                  {room.status ? "activa" : "inactiva"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{room.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{room.description}</p>
                <AlertDialog open={open2} onOpenChange={setOpen2}>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 px-4 text-sm font-semibold transition-colors duration-200 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      Ingresar a la Sala
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogPortal>
                    <AlertDialogContent>
                      <AggregateParticipantForm open={open2} setOpen={setOpen2} roomUuid={room.uuid} />
                    </AlertDialogContent>
                  </AlertDialogPortal>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 flex justify-center items-center h-40">
            <p className="text-gray-600">
              No hay salas disponibles. ¡Crea la primera!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;

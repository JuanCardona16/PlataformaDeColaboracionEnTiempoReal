import { useRoom } from "../../../features/room/hook/useRoom";
import imagen from "../../../assets/images/imagen-para-tarjeta-2.png";
import type { ICollaborativeRoom } from "@repo/shared/types";
import { CirclePlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/UI/alert-dialog";
import { useForm } from "@/hooks";
import { useGlobalStore } from "@/core/zustand/global_state";
import { useState } from "react";

type FormValues = {
  name: string;
  description: string;
  isPrivate: boolean;
  maxParticipants: number;
  allowChat: boolean;
  requireApproval: boolean;
  chat: boolean;
  voting: boolean;
};

const MainPage = () => {
  const { profile } = useGlobalStore();
  const { getAllRooms, createRoom } = useRoom();
  const [open, setOpen] = useState(false);

  const { FormData, FormDataError, handleChange, handleCheckboxChange } =
    useForm<FormValues>({
      name: "",
      description: "",
      isPrivate: false,
      maxParticipants: 5,
      allowChat: true,
      requireApproval: false,
      chat: true,
      voting: false,
    });

  // Función personalizada de validación para este formulario
  const validateRoomForm = () => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    
    if (!FormData.name || FormData.name.trim() === "") {
      errors.name = "El nombre de la sala es obligatorio";
    }
    
    if (!FormData.description || FormData.description.trim() === "") {
      errors.description = "La descripción es obligatoria";
    }
    
    if (FormData.maxParticipants < 1 || FormData.maxParticipants > 50) {
      errors.maxParticipants = "El número de participantes debe estar entre 1 y 50";
    }
    
    return errors;
  };

  return (
    <div className="p-1">
      <section className="flex justify-between items-center mb-4 p-2 select-none">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Salas disponibles</h2>
          <p className="text-sm text-gray-600">
            Explora, colabora y crea sin límites en tiempo real.
          </p>
        </div>
        <div>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="bg-gray-300/40 cursor-pointer rounded-lg py-2 px-4 mt-4 w-full select-none text-sm font-semibold flex justify-center items-center gap-2 hover:bg-gray-300/70">
                <CirclePlus className="size-5" />
                <p>Craer una Sala</p>
              </button>
            </AlertDialogTrigger>
            <AlertDialogPortal>
              <AlertDialogOverlay />
              <AlertDialogContent>
                <AlertDialogTitle>Crear una Sala</AlertDialogTitle>
                <AlertDialogDescription>
                  Crea una sala para colaborar con tus compañeros.
                </AlertDialogDescription>
                <div>
                  <form
                    id="create-room-form"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      
                      // Validación personalizada
                      const errors = validateRoomForm();
                      if (Object.keys(errors).length > 0) {
                        console.log("Errores de validación:", errors);
                        // Aquí deberías mostrar los errores al usuario
                        return;
                      }
                      
                      try {
                        await createRoom.create({
                          roomData: FormData,
                          userId: profile?.user?.uuid || "",
                        });
                        
                        setOpen(false);
                      } catch (error) {
                        console.error("Error al crear la sala:", error);
                      }
                    }}>
                    <div className="max-h-[60vh] overflow-y-auto space-y-6 p-2">
                      {/* Step 1: Basic Info */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nombre de la sala
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Juegos"
                          name="name"
                          className="w-full border rounded px-3 py-2 text-sm"
                          value={FormData.name}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                        {FormDataError.name && (
                          <p className="text-red-500 text-sm">
                            {FormDataError.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Descripción
                        </label>
                        <textarea
                          placeholder="Ej: Sala exclusivamente para jugar"
                          name="description"
                          rows={2}
                          className="w-full border rounded px-3 py-2 text-sm"
                          value={FormData.description}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                        {FormDataError.description && (
                          <p className="text-red-500 text-sm">
                            {FormDataError.description}
                          </p>
                        )}
                      </div>

                      {/* Step 2: Settings */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Privada</span>
                          <button
                            type="button"
                            role="switch"
                            onClick={() =>
                              handleCheckboxChange(
                                "isPrivate",
                                !FormData.isPrivate
                              )
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              FormData.isPrivate
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                FormData.isPrivate
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Máximo de participantes
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            name="maxParticipants"
                            className="w-full border rounded px-3 py-2 text-sm"
                            value={FormData.maxParticipants}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Permitir chat
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={FormData.allowChat}
                            onClick={() =>
                              handleCheckboxChange(
                                "allowChat",
                                !FormData.allowChat
                              )
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              FormData.allowChat
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                FormData.allowChat
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Requerir aprobación para unirse
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={FormData.requireApproval}
                            onClick={() =>
                              handleCheckboxChange(
                                "requireApproval",
                                !FormData.requireApproval
                              )
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              FormData.requireApproval
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                FormData.requireApproval
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Step 3: Features */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Características</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={FormData.chat}
                            onClick={() =>
                              handleCheckboxChange("chat", !FormData.chat)
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              FormData.chat ? "bg-indigo-600" : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                FormData.chat
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className="text-sm">Chat</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={FormData.voting}
                            onClick={() =>
                              handleCheckboxChange("voting", !FormData.voting)
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              FormData.voting ? "bg-indigo-600" : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                FormData.voting
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className="text-sm">Votación</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        className="bg-gray-300/50 cursor-pointer rounded-lg py-2 px-4 mt-4"
                        type="button"
                        onClick={() => setOpen(false)}>
                        Cancelar
                      </button>
                      <button
                        className="bg-gray-900 text-white cursor-pointer rounded-lg py-2 px-4 mt-4"
                        disabled={createRoom.isPending}
                        type="submit"
                        form="create-room-form">
                        {createRoom.isPending
                          ? "Creando Sala...."
                          : "Crear Sala"}
                      </button>
                    </div>
                  </form>
                </div>
              </AlertDialogContent>
            </AlertDialogPortal>
          </AlertDialog>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="bg-gray-300/50 cursor-pointer rounded-lg py-2 px-4 mt-4 w-full hover:bg-gray-300/70 select-none text-sm font-semibold">
                    Ingresar a la Sala
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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

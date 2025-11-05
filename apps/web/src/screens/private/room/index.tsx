import { useGlobalStore } from "@/core/zustand/global_state";
import { useRoom } from "@/features/room/hook/useRoom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/UI/alert-dialog";
import { CirclePlus } from "lucide-react";
import type { ICollaborativeRoom } from "@repo/shared/types";
import { useNavigate } from "react-router-dom";

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

const Rooms = () => {
  const { getRoomsByOwner, getRoomsByParticipant } = useRoom();
  const { profile } = useGlobalStore();
  const { createRoom, deleteRoom } = useRoom();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      maxParticipants: 5,
      allowChat: true,
      requireApproval: false,
      chat: true,
      voting: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: FormValues) => {
    try {
      await createRoom.create({
        roomData: data,
        userId: profile?.user?.uuid || "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error al crear la sala:", error);
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold mb-3">Mis Salas</h2>
          <p className="text-md text-gray-600">
            Salas creadas por ti, configuralas e invita a mas personas.
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
                  <form id="create-room-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="max-h-[60vh] overflow-y-auto space-y-6 p-2">
                      {/* Step 1: Basic Info */}
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nombre de la sala
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Juegos"
                          {...register("name", {
                            required: "El nombre de la sala es obligatorio",
                          })}
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Descripción
                        </label>
                        <textarea
                          placeholder="Ej: Sala exclusivamente para jugar"
                          rows={2}
                          {...register("description", {
                            required: "La descripción es obligatoria",
                          })}
                          className="w-full border rounded px-3 py-2 text-sm"
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm">
                            {errors.description.message}
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
                              setValue("isPrivate", !watchedValues.isPrivate)
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              watchedValues.isPrivate
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                watchedValues.isPrivate
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
                            {...register("maxParticipants", {
                              valueAsNumber: true,
                              min: {
                                value: 1,
                                message:
                                  "El número de participantes debe estar entre 1 y 50",
                              },
                              max: {
                                value: 50,
                                message:
                                  "El número de participantes debe estar entre 1 y 50",
                              },
                            })}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                          {errors.maxParticipants && (
                            <p className="text-red-500 text-sm">
                              {errors.maxParticipants.message}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Permitir chat
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={watchedValues.allowChat}
                            onClick={() =>
                              setValue("allowChat", !watchedValues.allowChat)
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              watchedValues.allowChat
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                watchedValues.allowChat
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
                            aria-checked={watchedValues.requireApproval}
                            onClick={() =>
                              setValue(
                                "requireApproval",
                                !watchedValues.requireApproval
                              )
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              watchedValues.requireApproval
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                watchedValues.requireApproval
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
                            aria-checked={watchedValues.chat}
                            onClick={() =>
                              setValue("chat", !watchedValues.chat)
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              watchedValues.chat
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                watchedValues.chat
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
                            aria-checked={watchedValues.voting}
                            onClick={() =>
                              setValue("voting", !watchedValues.voting)
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              watchedValues.voting
                                ? "bg-indigo-600"
                                : "bg-gray-200"
                            }`}>
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                watchedValues.voting
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
      </div>
      <section>
        <div>
          <ul>
            {getRoomsByOwner.isPending ? (
              <p>Cargando salas…</p>
            ) : getRoomsByOwner.isError ? (
              <p className="text-red-600">
                Error al cargar las salas. Intenta nuevamente.
              </p>
            ) : !getRoomsByOwner.data?.length ? (
              <p>Aún no has creado ninguna sala.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getRoomsByOwner.data.map((room: ICollaborativeRoom) => (
                  <div
                    key={room.uuid}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {room.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {room.description || "Sin descripción"}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            navigate(`/room/${room.uuid}/settings`);
                            /* navegar a configuración */
                          }}
                          className="ml-2 rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 cursor-pointer"
                          aria-label="Configuración">
                          {/* Icono de engranaje simple */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                "¿Estás seguro de eliminar esta sala?"
                              )
                            ) {
                              try {
                                console.log("UUID: ", room.uuid);
                                await deleteRoom.remove(room.uuid);
                              } catch (error) {
                                console.error(
                                  "Error al eliminar la sala:",
                                  error
                                );
                              }
                            }
                          }}
                          className="ml-2 rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 cursor-pointer"
                          aria-label="Eliminar sala">
                          {/* Icono de basura simple */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <span>
                        👥 {room.participants.length ?? 0} participantes
                      </span>
                      <span>•</span>
                      <span>
                        {room.createdAt
                          ? new Date(room.createdAt).toLocaleDateString()
                          : "Fecha desconocida"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ul>
        </div>
        <div>
          <h3 className="mt-6 mb-2">Salas en las que soy participante</h3>
          <ul>
            {getRoomsByParticipant.isPending ? (
              <p>Cargando salas…</p>
            ) : getRoomsByParticipant.isError ? (
              <p className="text-red-600">
                Error al cargar las salas. Intenta nuevamente.
              </p>
            ) : getRoomsByParticipant.data?.length ? (
              <p>No estás participando en ninguna sala.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getRoomsByParticipant.data
                  .filter((room: ICollaborativeRoom) =>
                    room.participants?.some(
                      (p) =>
                        p.userId === profile?.user?.uuid && p.role !== "admin"
                    )
                  )
                  .map(
                    (room: {
                      id: string;
                      name: string;
                      description?: string;
                      participantsCount?: number;
                      createdAt?: string | Date;
                    }) => (
                      <div
                        key={room.id}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {room.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {room.description || "Sin descripción"}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              /* navegar a configuración */
                            }}
                            className="ml-2 rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                            aria-label="Configuración">
                            {/* Icono de engranaje simple */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                          <span>
                            👥 {room.participantsCount ?? 0} participantes
                          </span>
                          <span>•</span>
                          <span>
                            {room.createdAt
                              ? new Date(room.createdAt).toLocaleDateString()
                              : "Fecha desconocida"}
                          </span>
                        </div>
                      </div>
                    )
                  )}
              </div>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Rooms;

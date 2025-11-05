import { useRoom } from "@/features/room/hook/useRoom"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"

const RoomSettings = () => {
  const { uuid } = useParams();
  const { getRoomById, generateAccessCode } = useRoom();
  const [accessCode, setAccessCode] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      getRoomById.getUuid(uuid!);
      if (!getRoomById.data?.accessCode) {
        const { code } = await generateAccessCode.generateAccessCode(uuid!);
        setAccessCode(code);
      }
    })();
  }, [uuid, getRoomById, generateAccessCode]);


  return (
    <div className="max-w-4xl mx-auto p-6 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition"
        >
          Volver
        </button>
      </div>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Configuraciones de la sala
      </h2>

      {getRoomById.isPending ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
          <span className="ml-4 text-slate-600 dark:text-slate-300">
            Cargando sala...
          </span>
        </div>
      ) : (
        <form className="grid gap-6 md:grid-cols-2">
          {/* Nombre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Nombre de la sala
            </label>
            <input
              type="text"
              defaultValue={getRoomById.data?.name}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Descripción
            </label>
            <textarea
              rows={3}
              defaultValue={getRoomById.data?.description}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Código de acceso */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Código de acceso
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={accessCode || ""}
                readOnly
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(accessCode || "");
                  alert("Código de acceso copiado al portapapeles");
                }}
                className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition">
                Copiar
              </button>
            </div>
          </div>

          {/* Link de acceso */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Link de acceso
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={`${window.location.origin}/room/${getRoomById.data?.uuid}/code=${accessCode}`}
                readOnly
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/room/${getRoomById.data?.uuid}/code=${accessCode}`
                  );
                  alert("Enlace de acceso copiado al portapapeles");
                }}
                className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition">
                Copiar
              </button>
            </div>
          </div>

          {/* Privacidad */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                Sala privada
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Solo usuarios con enlace podrán unirse
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={getRoomById.data?.isPrivate}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Máximo de participantes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Máximo de participantes
            </label>
            <input
              type="number"
              min="1"
              max="100"
              defaultValue={getRoomById.data?.maxParticipants}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Permitir chat */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                Chat habilitado
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Los participantes pueden enviar mensajes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={getRoomById.data?.allowChat}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Requerir aprobación */}
          <div className="md:col-span-2 flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">
                Requerir aprobación para unirse
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Los moderadores deben aprobar nuevos participantes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={getRoomById.data?.requireApproval}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Botones de acción */}
          <div className="md:col-span-2 flex items-center justify-end gap-4 mt-4">
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition">
              Guardar cambios
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RoomSettings
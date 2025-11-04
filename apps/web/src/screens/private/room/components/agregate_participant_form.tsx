import { useForm, type SubmitHandler } from "react-hook-form";

type Input = {
  code: string;
};

const AggregateParticipantForm = ({
  open,
  setOpen,
  roomUuid
}: {
  open: boolean;
    setOpen: (open: boolean) => void;
  roomUuid: string
}) => {
  const { register, handleSubmit, watch } = useForm<Input>();

  const onSubmitHandler: SubmitHandler<Input> = (data) => {
    console.log("datos del formulario: ", data);
  };

  console.log(watch("code")); // watch input value by passing the name of it

  console.log("parametros: ", open, roomUuid)

  return (
    <div>
      <form
        action=""
        method="POST"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="space-y-5"
      >
        <label
          htmlFor="agregate"
          className="block text-sm font-semibold text-gray-700 tracking-wide"
        >
          Código de acceso
        </label>
        <input
          type="text"
          id="agregate"
          {...register("code", { required: true })}
          placeholder="Ej. ABC-123"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="create-room-form"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 active:bg-gray-700 transition-all duration-200"
          >
            Validar código
          </button>
        </div>
      </form>
    </div>
  );
};

export default AggregateParticipantForm;

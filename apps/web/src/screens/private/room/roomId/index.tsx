import { useRoom } from "@/features/room/hook/useRoom";
import { useParams } from "react-router-dom"

const RoomById = () => {
  const { uuid } = useParams();
  const { getRoomById } = useRoom()

  console.log("Uuid de la sala: ", uuid)

  getRoomById.getUuid(uuid!);
  
  return (
    <div>
      <h2>Informacion de la Sala</h2>
      <section>

      </section>
    </div>
  )
}

export default RoomById
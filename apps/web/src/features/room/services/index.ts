import { ApiIntance } from "../../../infraestructure/api/config";

class RoomServices {
  getAllRooms = async () => {
    const response = await ApiIntance.get("/room");
    return response.data;
  };
}

export default new RoomServices();

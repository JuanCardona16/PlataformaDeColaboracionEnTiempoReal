import {
  useCreateRoom,
  useGetAllRooms,
  // useUpdateRoom,
  useDeleteRoom,
  useGetRoomById,
  useGetRoomsByOwner,
  useGetRoomsByParticipant,
  // useGetActiveRooms,
  // useGetArchivedRooms,
  useAddParticipant,
  // useRemoveParticipant,
  // useChangeParticipantRole,
  // useSetParticipantActive,
  // useSendMessage,
  // useClearChat,
  // useCastVote,
  // useResetVotes,
  // useUpdateSettings,
  // useChangeStatus,
  // useCountParticipants,
  // useCountRoomsByOwner,
  useGenerateAccessCode,
  useJoinByAccessCode,
  useGenerateAccessLink,
  // useJoinByAccessLink,
} from "../queries";

export const useRoom = () => {
  const getAllRooms = useGetAllRooms();
  const createRoom = useCreateRoom();
  // const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const getRoomById = useGetRoomById();
  const getRoomsByOwner = useGetRoomsByOwner();
  const getRoomsByParticipant = useGetRoomsByParticipant();
  // const getActiveRooms = useGetActiveRooms();
  // const getArchivedRooms = useGetArchivedRooms();
  const addParticipant = useAddParticipant();
  // const removeParticipant = useRemoveParticipant();
  // const changeParticipantRole = useChangeParticipantRole();
  // const setParticipantActive = useSetParticipantActive();
  // const sendMessage = useSendMessage();
  // const clearChat = useClearChat();
  // const castVote = useCastVote();
  // const resetVotes = useResetVotes();
  // const updateSettings = useUpdateSettings();
  // const changeStatus = useChangeStatus();
  // const countParticipants = useCountParticipants();
  // const countRoomsByOwner = useCountRoomsByOwner();
  const generateAccessCode = useGenerateAccessCode();
  const joinByAccessCode = useJoinByAccessCode();
  const generateAccessLink = useGenerateAccessLink();
  // const joinByAccessLink = useJoinByAccessLink();

  return {
    getAllRooms,
    createRoom,
    // updateRoom,
    deleteRoom,
    getRoomById,
    getRoomsByOwner,
    getRoomsByParticipant,
    // getActiveRooms,
    // getArchivedRooms,
    addParticipant,
    // removeParticipant,
    // changeParticipantRole,
    // setParticipantActive,
    // sendMessage,
    // clearChat,
    // castVote,
    // resetVotes,
    // updateSettings,
    // changeStatus,
    // countParticipants,
    // countRoomsByOwner,
    generateAccessCode,
    joinByAccessCode,
    generateAccessLink,
    // joinByAccessLink,
  };
};
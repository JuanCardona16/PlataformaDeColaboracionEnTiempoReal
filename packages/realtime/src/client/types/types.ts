export interface IRealtimeMessage {
  from: string;
  to?: string;
  content: string;
  createdAt: Date;
}

export interface IRoomMessage {
  roomId: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

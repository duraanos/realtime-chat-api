export type Message = {
  _id: string;
  user: string;
  text: string;
  room: string;
  timestamp?: string;
};

export type SendMessagePaylod = {
  user: string;
  text: string;
  room: string;
};

export type JoinRoomResponse = {
  status: 'ok' | 'error';
  room: string;
  history?: Message[];
  message?: string;
};

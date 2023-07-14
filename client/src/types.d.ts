export type User = {
  id: string;
  username: string;
  email: string;
};

export type UserLogin = Pick<User, "email"> & { password: string };
export type UserRegister = Pick<User, "username" | "email"> & {
  password: string;
};

export type Message = {
  id?: string;
  sender: string;
  receiver: string;
  type?: "audio" | "image" | "text";
  message: string;
  messageStatus?: "sent" | "delivered" | "seen";
  createdAt: Date;
};

export type MessageSend = Pick<Message, "sender" | "receiver" | "message">;

export type VideoCallType =
  | Partial<
      User & {
        type: string;
        callType: "video";
        roomId: number;
      }
    >
  | undefined;

export type VoiceCallType =
  | Partial<
      User & {
        type: string;
        callType: "voice";
        roomId: number;
      }
    >
  | undefined;

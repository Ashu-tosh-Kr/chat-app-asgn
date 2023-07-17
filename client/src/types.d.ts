export type User = {
  id: string;
  username: string;
  email: string;
  sentMessages: Messages[];
  receivedMessages: Messages[];
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

export type IncomingVoiceCallType =
  | {
      callType: "voice";
      roomId: number;
      id: string;
      profilePicture: string;
      name: string;
    }
  | undefined;

export type IncomingVideoCallType =
  | {
      callType: "video";
      roomId: number;
      id: string;
      profilePicture: string;
      name: string;
    }
  | undefined;

export type ChatContextType = {
  currentChatUser?: Pick<User, "id" | "username">;
  setCurrentChatUser: (user: Pick<User, "id" | "username">) => void;
  socket: React.MutableRefObject<Socket | null>;
  setVoiceCall: (videoCall: VoiceCallType) => void;
  setVideoCall: (voiceCall: VideoCallType) => void;
  setIncomingVideoCall: (incomingVideoCall: IncomingVideoCallType) => void;
  setIncomingVoiceCall: (incomingVoiceCall: IncomingVoiceCallType) => void;
};

export type ChatContextTypeInsideChatContainer = ChatContextType & {
  currentChatUser: User;
};

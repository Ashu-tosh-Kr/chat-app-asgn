import { useChatContext } from "../../pages/Chat";
import CallContainer from "./CallContainer";
import { useEffect } from "react";

type Props = {};

export default function VoiceCall({}: Props) {
  const { socket, voiceCall } = useChatContext();
  const user = JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    if (voiceCall?.type === "out-going") {
      socket.current?.emit("outgoing-voice-call", {
        to: voiceCall.id,
        from: {
          id: user.id,
          profilePicture: `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${user?.username}`,
          name: user.username,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall]);

  return <CallContainer data={voiceCall} />;
}

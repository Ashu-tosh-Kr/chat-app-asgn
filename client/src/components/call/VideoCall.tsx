import { useChatContext } from "../../pages/Chat";
import { VideoCallType } from "../../types";
import CallContainer from "./CallContainer";
import { useEffect } from "react";

type Props = {
  videoCall: NonNullable<VideoCallType>;
};
export default function VideoCall({ videoCall }: Props) {
  const { socket } = useChatContext();
  const user = JSON.parse(localStorage.getItem("user")!);

  useEffect(() => {
    if (videoCall.type === "out-going") {
      socket.current?.emit("outgoing-video-call", {
        to: videoCall.id,
        from: {
          id: user.id,
          profilePicture: `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${user?.username}`,
          name: user.username,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall]);
  return <CallContainer data={videoCall} />;
}

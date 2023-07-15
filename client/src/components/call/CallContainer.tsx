import { useEffect, useState } from "react";
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useChatContext } from "../../pages/Chat";
import {
  ChatContextTypeInsideChatContainer,
  VideoCallType,
  VoiceCallType,
} from "../../types";
import { MdOutlineCallEnd } from "react-icons/md";
import { useGetToken } from "../../api/user/userHooks";

type Props = {
  data: VideoCallType | VoiceCallType;
};

export default function CallContainer({ data }: Props) {
  const user = JSON.parse(localStorage.getItem("user")!);
  const { currentChatUser, setVideoCall, setVoiceCall, socket } =
    useChatContext() as ChatContextTypeInsideChatContainer;
  const [callAccepted, setCallAccepted] = useState(false);
  const [zgVar, setZgVar] = useState<any>();
  const [localStream, setLocalStream] = useState<any>();
  const [publishStream, setPublishStream] = useState<any>();

  useEffect(() => {
    if (data?.type === "out-going") {
      socket.current?.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => setCallAccepted(true), 1000);
    }
  }, [data]);

  const { token } = useGetToken(callAccepted);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          const zg = new ZegoExpressEngine(
            parseInt(import.meta.env.VITE_ZEGO_APP_ID),
            import.meta.env.VITE_ZEGO_SERVER_SECRET
          );
          setZgVar(zg);
          zg.on("roomStreamUpdate", async (_, updateType, streamList, __) => {
            if (updateType === "ADD") {
              const rmVideo = document.getElementById("remote-video");
              const vd = document.createElement(
                data?.callType === "video" ? "video" : "audio"
              );
              vd.id = streamList[0].streamID;
              vd.autoplay = true;
              //@ts-ignore
              vd.playsInline = true;
              vd.muted = false;
              if (rmVideo) {
                rmVideo.appendChild(vd);
              }
              zg.startPlayingStream(streamList[0].streamID, {
                audio: true,
                video: true,
              }).then((stream) => (vd.srcObject = stream));
            } else if (
              updateType === "DELETE" &&
              zg &&
              localStream &&
              streamList[0].streamID
            ) {
              zg.destroyStream(localStream);
              zg.stopPublishingStream(streamList[0].streamID);
              zg.logoutRoom(data?.roomId?.toString());
              setVideoCall(undefined);
              setVoiceCall(undefined);
            }
          });
          console.log(token);

          await zg.loginRoom(
            data?.roomId?.toString()!,
            token,
            { userID: user.id, userName: user.username },
            { userUpdate: true }
          );

          const localStream = await zg.createStream({
            camera: {
              audio: true,
              video: data?.callType === "video",
            }, // front facing camera by default
          });
          const localVideo = document.getElementById("local-audio");
          const videoElement = document.createElement(
            data?.callType === "video" ? "video" : "audio"
          );
          videoElement.id = "video-local-zego";
          videoElement.style.width = "6rem";
          videoElement.style.width = "5rem";
          videoElement.autoplay = true;
          videoElement.muted = false;
          //@ts-ignore
          videoElement.playsInline = true;
          localVideo?.appendChild(videoElement);
          const td = document.getElementById(
            "video-local-zego"
          ) as HTMLVideoElement;
          td.srcObject = localStream;
          const streamID = "123" + Date.now();
          setPublishStream(streamID);
          setLocalStream(localStream);
          zg.startPublishingStream(streamID, localStream);
        }
      );
    };
    if (token) startCall();
  }, [token]);

  const endCall = () => {
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data?.roomId?.toString());
    }
    if (data?.callType === "voice")
      socket.current?.emit("reject-voice-call", {
        from: data?.id,
      });
    if (data?.callType === "video")
      socket.current?.emit("reject-video-call", {
        from: data?.id,
      });
    setVideoCall(undefined);
    setVoiceCall(undefined);
  };

  return (
    <Flex
      h="100vh"
      w="100vw"
      color={"brand.200"}
      flexDir={"column"}
      bgColor="brand.700"
      justify={"space-evenly"}
      align={"center"}
    >
      <Box
        backgroundImage="url(/chat-bg.png)"
        opacity={0.1}
        backgroundAttachment={"fixed"}
        position={"absolute"}
        w={"100vw"}
        h={"100vh"}
      />
      <Flex
        m={10}
        flexDir={"column"}
        justify={"space-between"}
        align={"center"}
      >
        <Heading>{currentChatUser.username}</Heading>
        <Text>{callAccepted ? "On Going Call" : "Calling"}</Text>
      </Flex>
      {(!callAccepted || data?.callType === "voice") && (
        <Avatar
          src={`https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${currentChatUser.username}`}
          h={"20rem"}
          w={"20rem"}
          name={currentChatUser.username}
        />
      )}
      <div
        id="remote-video"
        style={{ position: "relative", margin: "1rem" }}
        className=""
      >
        <div
          style={{ position: "absolute", bottom: 5, right: 5 }}
          id="local-audio"
          className=""
        ></div>
      </div>
      <Flex
        bg={"red.400"}
        justify={"center"}
        align={"center"}
        borderRadius={"50%"}
        h={16}
        w={16}
        zIndex={1}
        fontSize={"2xl"}
        onClick={endCall}
        cursor={"pointer"}
      >
        <MdOutlineCallEnd />
      </Flex>
    </Flex>
  );
}

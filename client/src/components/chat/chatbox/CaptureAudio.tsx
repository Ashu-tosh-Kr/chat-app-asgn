import { Box, Flex, keyframes, useBoolean } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { useChatContext } from "../../../pages/Chat";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import { BsRecordCircle } from "react-icons/bs";
import { useSendAudioMessage } from "../../../api/message/messageHooks";

type Props = {
  setShowCaptureAudio: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  };
};

const pulse = keyframes`
	0% {
        transform: scale(0.8);
        /* box-shadow: 0 0 0 0 rgba(229, 62, 62, 1); */
    }

    70% {
        transform: scale(1);
        /* box-shadow: 0 0 0 60px rgba(229, 62, 62, 0); */
    }

    100% {
        transform: scale(0.8);
    }
`;

function formatTime(time: number) {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

export default function CaptureAudio({ setShowCaptureAudio }: Props) {
  const { currentChatUser, socket } = useChatContext();
  const user = JSON.parse(localStorage.getItem("user")!);
  const { mutate } = useSendAudioMessage(socket);

  const [isRecording, setIsRecording] = useBoolean();
  const [isPlaying, setIsPlaying] = useBoolean();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
  //will store an html audio element, this will allow us to play pause the audio
  const [htmlAudioElement, setHtmlAudioElement] =
    useState<HTMLAudioElement | null>(null);
  // will store the actual audio binary data that can be sent to the backend
  const [recordedAudio, setRecordedAudio] = useState<Blob>();

  const waveformRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder>();

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          setTotalDuration(prev + 1);
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current!,
      waveColor: "#CCC",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 25,
    });
    setWaveform(wavesurfer);
    wavesurfer.on("finish", function () {
      setIsPlaying.off();
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) handleStartRecording();
  }, [waveform]);

  const handleStartRecording = async () => {
    setRecordingDuration(0);
    setTotalDuration(0);
    setCurrentPlayBackTime(0);
    setHtmlAudioElement(null);
    setIsRecording.on();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        waveform?.load(audioUrl);
        setRecordedAudio(audioBlob);
        setHtmlAudioElement(new Audio(audioUrl));
      });
      mediaRecorder.start();
    } catch (err) {
      console.log(err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording.off();
    }
  };

  useEffect(() => {
    if (htmlAudioElement) {
      const updatePlaybackTime = () =>
        setCurrentPlayBackTime(htmlAudioElement.currentTime);
      htmlAudioElement.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        htmlAudioElement.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    if (htmlAudioElement) {
      waveform?.play();
      htmlAudioElement.play();
      setIsPlaying.on();
    }
  };

  const handlePauseRecording = () => {
    waveform?.pause();
    htmlAudioElement?.pause();
    setIsPlaying.off();
  };

  const handleUpload = async () => {
    if (recordedAudio) {
      const formData = new FormData();
      formData.append("audio", recordedAudio);
      formData.append("sender", user.id);
      formData.append("receiver", currentChatUser?.id!);

      mutate(formData);
    }
  };

  return (
    <Flex align={"center"} justify={"flex-end"} gap={2} w="full">
      <FaTrash cursor={"pointer"} onClick={setShowCaptureAudio.off} />
      <Flex
        py={2}
        px={4}
        gap={3}
        justify={"center"}
        bg={"brand.700"}
        borderRadius={"full"}
        align={"center"}
        fontSize={"lg"}
        dropShadow={"lg"}
      >
        {isRecording ? (
          <Flex
            color={"red.400"}
            textAlign={"center"}
            justify={"center"}
            align={"center"}
            borderRadius={"full"}
            animation={`${pulse} 2s infinite`}
            gap={2}
          >
            <BsRecordCircle />
            <span>{formatTime(recordingDuration)}s</span>
          </Flex>
        ) : (
          <div className="">
            {htmlAudioElement && (
              <>
                {!isPlaying ? (
                  <FaPlay cursor={"pointer"} onClick={handlePlayRecording} />
                ) : (
                  <FaStop cursor={"pointer"} onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}

        <div
          style={{ minWidth: "200px" }}
          ref={waveformRef}
          hidden={isRecording}
        />
        {htmlAudioElement && isPlaying && (
          <span>{formatTime(currentPlayBackTime)}</span>
        )}
        {htmlAudioElement && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
      </Flex>
      <Box mr={4} color={"red.400"}>
        {!isRecording ? (
          <FaMicrophone cursor={"pointer"} onClick={handleStartRecording} />
        ) : (
          <FaPauseCircle cursor={"pointer"} onClick={handleStopRecording} />
        )}
      </Box>
      <div className="">
        <MdSend cursor="pointer" mr={4} title="send" onClick={handleUpload} />
      </div>
    </Flex>
  );
}

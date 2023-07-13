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
  const [recordedAudio, setRecordedAudio] = useState<HTMLAudioElement>();
  const [waveform, setWaveform] = useState<WaveSurfer | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [renderedAudio, setRenderedAudio] = useState<File>();

  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder>();

  useEffect(() => {
    let interval: any;
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
      // url: "https://actions.google.com/sounds/v1/science_fiction/creature_distortion_white_noise.ogg",
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

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setTotalDuration(0);
    setCurrentPlayBackTime(0);
    setRecordedAudio(undefined);
    setIsRecording.on();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current!.srcObject = stream;

        const audioChunks: any[] = [];

        mediaRecorder.addEventListener("dataavailable", (event: any) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, {
            type: "audio/ogg; codecs=opus",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          waveform?.load(audioUrl);
          setRecordedAudio(audio);
        });
        mediaRecorder.start();
      })
      .catch((err) => {
        console.log("Error accessing microphone", err);
      });
  };
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording.off();
      waveform?.stop();

      const audioChunks: any[] = [];

      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        (event: any) => {
          audioChunks.push(event.data);
        }
      );

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () =>
        setCurrentPlayBackTime(recordedAudio.currentTime);
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [renderedAudio]);

  const handlePlayRecording = () => {
    if (recordedAudio) {
      waveform?.stop();
      waveform?.play();

      recordedAudio?.play();
      setIsPlaying.on();
    }
  };

  const handlePauseRecording = () => {
    waveform?.stop();
    recordedAudio?.pause();
    setIsPlaying.off();
  };

  const handleUpload = async () => {
    if (renderedAudio) {
      const formData = new FormData();
      formData.append("audio", renderedAudio);

      formData.append("sender", user.id);
      formData.append("receiver", currentChatUser?.id!);

      mutate(formData);
    }
  };

  return (
    <Flex align={"center"} justify={"flex-end"} gap={2} w="full">
      <FaTrash onClick={setShowCaptureAudio.off} />
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
            {recordedAudio && (
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
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlayBackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio hidden ref={audioRef} />
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

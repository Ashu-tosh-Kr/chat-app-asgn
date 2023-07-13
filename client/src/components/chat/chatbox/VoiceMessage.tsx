import WaveSurfer from "wavesurfer.js";
import { useEffect, useState, useRef } from "react";
import { Flex, useBoolean } from "@chakra-ui/react";
import { Message } from "../../../types";
import { FaPlay, FaStop } from "react-icons/fa";

type Props = {
  message: Message;
};

function formatTime(time: number) {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

export default function VoiceMessage({ message }: Props) {
  const [audioMessage, setAudioMessage] = useState<HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useBoolean();
  const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveform = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveform.current === null) {
      console.log("waveform created");

      waveform.current = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: "#CCC",
        progressColor: "#4a9eff",
        cursorColor: "#7ae3c3",
        barWidth: 2,
        height: 25,
        url: "https://actions.google.com/sounds/v1/science_fiction/creature_distortion_white_noise.ogg",
      });
      waveform.current.on("finish", function () {
        setIsPlaying.off();
      });
    }

    return () => {
      waveform.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const audioUrl = `${import.meta.env.VITE_SERVER_URL}/${message.message}`;

    const audio = new Audio(audioUrl);
    setAudioMessage(audio);
    waveform.current?.load(audioUrl);
    waveform.current?.on("ready", function () {
      setTotalDuration(Math.ceil(waveform.current?.getDuration()!));
    });
  }, [message.message]);

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () =>
        setCurrentPlayBackTime(audioMessage.currentTime);
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  const handlePlayAudio = () => {
    if (audioMessage && waveform.current !== null) {
      waveform.current.stop();
      waveform.current.play();

      audioMessage.play();
      setIsPlaying.on();
    }
  };

  const handlePauseAudio = () => {
    if (audioMessage && waveform.current !== null) {
      waveform.current.stop();
      audioMessage.pause();
      setIsPlaying.off();
    }
  };

  return (
    <Flex justify={"space-between"}>
      {!isPlaying ? (
        <FaPlay cursor={"pointer"} onClick={handlePlayAudio} />
      ) : (
        <FaStop cursor={"pointer"} onClick={handlePauseAudio} />
      )}
      <div ref={waveformRef} />
      <div className="">
        {isPlaying && <span>{formatTime(currentPlayBackTime)}</span>}
        {!isPlaying && <span>{formatTime(totalDuration)}</span>}
      </div>
    </Flex>
  );
}

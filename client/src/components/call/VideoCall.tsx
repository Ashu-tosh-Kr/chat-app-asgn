import { useChatContext } from "../../pages/Chat";
import CallContainer from "./CallContainer";

export default function VideoCall() {
  const { videoCall } = useChatContext();

  return <CallContainer data={videoCall} />;
}

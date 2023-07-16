import axios, { AxiosResponse } from "axios";
import { Message, MessageSend } from "../../types";

export default class API {
  instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/api/messages`,
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")!)?.access_token,
      },
    });
  }

  sendMessage(message: MessageSend) {
    return this.instance.post("/send-message", message);
  }

  sendImageMessage(message: FormData) {
    return this.instance.post("/send-image-message", message);
  }

  sendAudioMessage(message: FormData) {
    return this.instance.post("/send-audio-message", message);
  }

  getMessages(
    sender: string,
    receiver: string
  ): AxiosResponse<{ messages: Message[] }> {
    return this.instance.get(`/get-messages/${sender}/${receiver}`);
  }

  getInitialContacts() {
    return this.instance.get(`/get-initial-contacts`);
  }
}

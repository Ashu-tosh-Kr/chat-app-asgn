import axios, { AxiosResponse } from "axios";
import { Message, MessageSend } from "../../types";

export default class API {
  instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: `${"http://localhost:5000"}/api/messages`,
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
    const user = JSON.parse(localStorage.getItem("user")!);
    return this.instance.get(`/get-initial-contacts/${user.id}`);
  }
}
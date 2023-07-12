import axios, { AxiosResponse } from "axios";
import { Message, MessageSend } from "../../types";

export default class API {
  instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: `${"http://localhost:5000"}/api/messages`,
    });
  }

  //auth
  sendMessage(message: MessageSend) {
    return this.instance.post("/send-message", message);
  }
  getMessages(
    sender: string,
    receiver: string
  ): AxiosResponse<{ messages: Message[] }> {
    return this.instance.get(`/get-messages/${sender}/${receiver}`);
  }
}

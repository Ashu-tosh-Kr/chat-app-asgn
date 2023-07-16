import axios from "axios";
import { UserLogin, UserRegister } from "../../types";

export default class API {
  instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/api/auth`,
    });
  }

  //auth
  login(body: UserLogin) {
    return this.instance.post("/login", body);
  }
  register(body: UserRegister) {
    return this.instance.post("/register", body);
  }
}

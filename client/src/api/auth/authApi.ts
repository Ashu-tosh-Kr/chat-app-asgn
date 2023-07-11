import axios from "axios";
import { UserLogin, UserRegister } from "../../types";

export default class API {
  instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: `${"http://localhost:5000"}/api`,
    });
  }

  //auth
  login(body: UserLogin) {
    return this.instance.post("/login", body);
  }
  register(body: UserRegister) {
    return this.instance.post("/register", body);
  }
  signout() {
    return this.instance.get("/signout");
  }
}

import axios from "axios";

export default class API {
  instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: `${import.meta.env.VITE_SERVER_URL}/api/users`,
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")!)?.access_token,
      },
    });
  }

  //auth
  currentUser() {
    return this.instance.get("/current-user");
  }
  allUsers() {
    return this.instance.get("/all");
  }

  getToken() {
    return this.instance.get(`/generate-token`);
  }
}

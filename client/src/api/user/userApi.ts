import axios from "axios";

export default class API {
  instance: any;
  constructor() {
    this.instance = axios.create({
      baseURL: `${"http://localhost:5000"}/api`,
    });
  }

  //auth
  currentUser() {
    return this.instance.get("/users/current-user");
  }
  allUsers() {
    return this.instance.get("/users/all");
  }

  getToken() {
    const user = JSON.parse(localStorage.getItem("user")!);
    return this.instance.get(`/users/generate-token/${user.id}`);
  }
}

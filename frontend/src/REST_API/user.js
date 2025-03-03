import axios from "axios";

export const logoutUser = async () => await axios.post("/user/logout");
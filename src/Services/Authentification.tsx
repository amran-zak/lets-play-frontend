import http from "../server";
import UserData from "../Types/User.types"
import LoginData from "../Types/Login.types"


class Authentification {
    signUp(data : UserData) {
        return http.post<Array<UserData>>("/users/signup", data);
    }

    login(data : LoginData) {
        return http.post<Array<LoginData>>("/users/login", data);
    }
}

export default new Authentification();
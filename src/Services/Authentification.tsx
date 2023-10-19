import http from "../server";
import UserData from "../Types/User.types"
import LoginData from "../Types/Login.types"


class Authentification {
    signUp(data : UserData) {
        return http.post<Array<UserData>>("/users/signup", data);
    }

    signIn(data : LoginData) {
        return http.post<Array<LoginData>>("/api/login", data);
    }
}

export default new Authentification();
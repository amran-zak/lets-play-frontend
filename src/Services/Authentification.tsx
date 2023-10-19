import http from '../server'
import LoginData from '../Types/Login.types'
import UserData from '../Types/User.types'

class Authentification {
    async signUp(data: UserData) {
        return http.post<UserData[]>('/users/signup', data)
    }

    async signIn(data: LoginData) {
        return http.post<LoginData[]>('/api/login', data)
    }
}

export default new Authentification()

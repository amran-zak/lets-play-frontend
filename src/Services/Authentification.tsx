import http from '../server'
import type UserData from '../Types/User.types'
import type LoginData from '../Types/Login.types'

class Authentification {
  async signUp(data: UserData) {
    return http.post<UserData[]>('/users/signup', data)
  }

  async login(data: LoginData) {
    return http.post<LoginData[]>('/users/login', data)
  }
}

export default new Authentification()

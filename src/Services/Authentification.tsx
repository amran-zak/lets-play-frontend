import http from '../server'
import type UserData from '../Types/User.types'
import type LoginData from '../Types/Login.types'

class Authentification {
  async signUp(data: UserData) {
    return http.post<UserData[]>('/users/signup', data)
  }

  async signIn(data: LoginData) {
    return http.post<LoginData[]>('/api/login', data)
  }
}

export default new Authentification()

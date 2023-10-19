import http from '../server'
import LoginData from '../Types/Login.types'
import UserData from '../Types/User.types'
import NewpasswordData from '../Types/NewPassword.types'

class Authentification {
  async signUp(data: UserData) {
    return http.post<UserData[]>('/api/auth/sign-up', data)
  }

  async signIn(data: LoginData) {
    return http.post<LoginData[]>('/api/auth/sign-in', data)
  }

  async newPassword(data: NewpasswordData) {
    console.log(data)
    return http.post<NewpasswordData[]>('/api/auth/forgot-password', data)
  }
}

export default new Authentification()

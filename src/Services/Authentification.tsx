import http from '../server'
import LoginData from '../Types/Login.types'
import UserData from '../Types/User.types'
import NewpasswordData from '../Types/NewPassword.types'
import UserProfileData from '../Types/ProfileModif.types'
import ResultUserData from '../Types/ResultUserData.types'

class Authentification {
  async signUp(data: UserData) {
    return http.post<UserData[]>('/api/auth/sign-up', data)
  }

  async signIn(data: LoginData) {
    return http.post<LoginData[]>('/api/auth/sign-in', data)
  }

  async newPassword(data: NewpasswordData) {
    return http.post<NewpasswordData[]>('/api/auth/forgot-password', data)
  }

  async updateUserProfile(data: UserProfileData) {
    return http.put<UserProfileData>('/api/auth/edit-profile', data)
  }

  async getProfile() {
    const token = localStorage.getItem('token')
    if (token) {
      return http.get<ResultUserData>('/api/auth/get-profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      )
    }
    throw new Error('No token found')
  }
}

export default new Authentification()

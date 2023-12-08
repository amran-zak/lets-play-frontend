// Files
import http from '../server'

class Users {
  async getProfileById(id: string | undefined) {
    return http.get(`/api/auth/profile/${id}`)
  }
}

export default new Users()

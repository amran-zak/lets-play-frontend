import http from '../server'
import ResultAnnonceData from '../Types/ResultAnnouncesOrganizer.types'

class Organizer {
  async getAllSports() {
    const token = localStorage.getItem('token')
    if (token) {
      return http.get<ResultAnnonceData>('/api/organizer/sports', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      )
    }
    throw new Error('No token found')
  }
}

export default new Organizer()

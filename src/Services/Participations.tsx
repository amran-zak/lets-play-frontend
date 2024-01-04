// Files
import http from '../server'

class Participations {
  async participer(sportId: string) {
    return http.post('/api/participations/' + sportId)
  }

  async getMyAllParticipations() {
    return http.get('/api/participations/')
  }

  async deleteParticipation(partcipationId: string) {
    return http.delete('/api/participations/' + partcipationId)
  }

  async getParticipationsGestionBySportId(sportId: string) {
    return http.get('/api/organizer/sports/' + sportId + '/participations/gestion')
  }

  async getParticipationsListBySportId(sportId: string) {
    return http.get('/api/organizer/sports/' + sportId + '/participations/list')
  }

  async acceptParticipation(sportId: string, participationId: string) {
    return http.put('/api/organizer/sports/' + sportId + '/participations/' + participationId + '/accept')
  }

  async rejectParticipation(sportId: string, participationId: string) {
    return http.put('/api/organizer/sports/' + sportId + '/participations/' + participationId + '/reject')
  }

  async getIfParticiping(sportId: string) {
    const token = localStorage.getItem('token')
    if (token) {
      return http.get('api/participations/isParticipating/' + sportId, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      )
    }
    throw new Error('No token found')
  }
}

export default new Participations()

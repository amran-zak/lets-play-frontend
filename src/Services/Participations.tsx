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

  async getParticipationsBySportId(sportId: string) {
    return http.get('/api/organizer/sports/' + sportId + '/participations')
  }

  async acceptParticipation(sportId: string, partcipationId: string) {
    return http.put('/api/organizer/sports/' + sportId + '/participations/' + partcipationId + '/accept')
  }

  async rejectParticipation(sportId: string, partcipationId: string) {
    return http.put('/api/organizer/sports/' + sportId + '/participations/' + partcipationId + '/reject')
  }
}

export default new Participations()

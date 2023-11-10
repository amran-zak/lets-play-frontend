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
    return http.delete('/api/sports/' + sportId + '/participations')
  }
}

export default new Participations()

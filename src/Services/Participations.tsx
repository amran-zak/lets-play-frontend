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
}

export default new Participations()

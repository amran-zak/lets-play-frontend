import http from '../server'
import ResultAnnounceData from '../Types/ResultAnnouncesOrganizer.types'

class AnnouncePublic {
  async getAllSports() {
    return http.get<ResultAnnounceData>('/api/public/sports')
  }

  async getSportById(id: string | undefined) {
    return http.get(`/api/public/sport/${id}`)
  }
}

export default new AnnouncePublic()

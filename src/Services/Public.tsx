import http from '../server'
import ResultAnnounceData from '../Types/ResultAnnouncesOrganizer.types'

class AnnouncePublic {
  async getAllSports() {
    return http.get<ResultAnnounceData>('/api/public/sports')
  }
}

export default new AnnouncePublic()

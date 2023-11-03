import http from '../server'
import AnnounceData from '../Types/Announce.types'

class Announce {
  async getAll() {
    return http.get('/api/organizer/sports')
  }

  async create(data: AnnounceData) {
    return http.post<AnnounceData[]>('/api/organizer/sports', data)
  }

  async modify(data: AnnounceData) {
    return http.post<AnnounceData[]>('/api/...', data)
  }
}

export default new Announce()

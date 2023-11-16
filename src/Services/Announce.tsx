import http from '../server'
import AnnounceData from '../Types/Announce.types'

class Announce {
  async getAll() {
    return http.get('/api/organizer/sports')
  }

  async getById(id: string | undefined) {
    return http.get(`/api/organizer/sports/${id}`)
  }

  async create(data: AnnounceData) {
    return http.post<AnnounceData[]>('/api/organizer/sports', data)
  }

  async modify(data: AnnounceData, id: string | undefined) {
    return http.put<AnnounceData[]>(`/api/organizer/sports/${id}`, data)
  }

  async delete(id: string | undefined) {
    return http.delete<AnnounceData[]>(`/api/organizer/sports/${id}`)
  }
}

export default new Announce()

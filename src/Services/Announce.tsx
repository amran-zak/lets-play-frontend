import http from '../server'
import AnnounceData from '../Types/Announce.types'
import {Params} from 'react-router-dom'

class Announce {
  async getAll() {
    return http.get('/api/organizer/sports')
  }

  async getById(id: Readonly<Params<string>>) {
    if (id?.value) {
      return http.get(`/api/organizer/sports/${id.value.toString()}`)
    }
  }

  async create(data: AnnounceData) {
    return http.post<AnnounceData[]>('/api/organizer/sports', data)
  }

  async modify(data: AnnounceData) {
    return http.post<AnnounceData[]>('/api/...', data)
  }
}

export default new Announce()

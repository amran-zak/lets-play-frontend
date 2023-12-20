// Files
import RatingData from '../Types/Rating.types'
import http from '../server'

class Rating {
  async getAllByTo(id: string | undefined) {
    return http.get(`/api/rating/to/${id}`)
  }

  async getByToAndFromUser(toUserId: string | undefined, id: string | undefined) {
    return http.get(`api/rating/to/${toUserId}/from/${id}`)
  }

  async getAverageRating(id: string | undefined) {
    return http.get(`/api/rating/average/${id}`)
  }

  async getAllByFrom(id: string | undefined) {
    return http.get(`/api/rating/from/${id}`)
  }

  async createOrUpdate(data: RatingData) {
    const token = localStorage.getItem('token')
    if (token) {
      return http.post<RatingData>('/api/rating/create-or-update', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    throw new Error('No token found')
  }

  async delete(id: string | undefined) {
    return http.delete(`/api/rating/delete/${id}`)
  }
}

export default new Rating()

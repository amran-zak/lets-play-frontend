import UserData from './User.types'

export default interface RatingData {
  _id?: string
  rating: number
  comment: string
  at: Date
  from: UserData
  to: UserData
}
    
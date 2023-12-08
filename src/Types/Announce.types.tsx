import UserData from './User.types'

export default interface AnnounceData {
  _id?: string
  sport?: string
  numberOfPeopleMax: number
  numberOfPeopleCurrent?: number
  date: string
  startTime: string
  endTime: string
  address?: string
  city?: string | undefined
  ageMin: number
  ageMax: number
  price: number
  organizer?: UserData
}

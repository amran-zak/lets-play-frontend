import module from 'module'
import Timestamp = module

export default interface AnnounceData {
  sport: string
  numberOfPeopleMax: number
  date: Date
  startTime: Date
  endTime: Date
  address: string
  city?: string | undefined
  ageMin: number
  ageMax: number
  price: number
}

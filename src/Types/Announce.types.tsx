import module from 'module'
import Timestamp = module

export default interface AnnounceData {
  sport?: string
  numberOfPeopleMax: number
  date: string
  startTime: string
  endTime: string
  address: string
  city?: string | undefined
  ageMin: number
  ageMax: number
  price: number
}

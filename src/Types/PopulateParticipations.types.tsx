import AnnounceData from './Announce.types'
import UserData from './User.types'
export default interface PopulateParticipationData {
  _id: string
  participant: UserData
  sport: AnnounceData
  etat: 'pending' | 'accepted' | 'refused' | 'expired'
}

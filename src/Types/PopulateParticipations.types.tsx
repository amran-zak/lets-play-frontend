import AnnounceData from './Announce.types'
export default interface PopulateParticipationData {
  _id: string
  participant: {
    _id: string // ID de l'utilisateur
  }
  sport: AnnounceData
  etat: 'pending' | 'accepted' | 'refused' | 'expired'
}

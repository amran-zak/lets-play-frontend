export default interface ParticipationData {
  _id: string
  participant: {
    _id: string
  }
  sport: string
  etat: 'pending' | 'accepted' | 'refused' | 'expired'
}

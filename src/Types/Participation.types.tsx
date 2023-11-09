import AnnounceData from './Announce.types'
export default interface ParticipationData {
  _id: string
  participant: {
    _id: string // ID de l'utilisateur
    // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
  }
  sport: string
  etat: 'pending' | 'accepted' | 'refused' | 'expired'
  // Vous pouvez ajouter d'autres propriétés liées à la participation ici
}

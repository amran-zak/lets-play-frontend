import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid
} from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'
import axios from 'axios'
// datas types
import AnnounceData from '../../Types/Announce.types'
import PopulateParticipationData from '../../Types/PopulateParticipations.types'
// services
import ParticipationsService from '../../Services/Participations'
import AnnouncesService from '../../Services/Announce'

const AnnounceDetails: React.FC = () => {
  const [participants, setParticipants] = useState<PopulateParticipationData[]>([])
  const [announce, setAnnounce] = useState<AnnounceData>()
  const sportId = useParams().sportId ?? ''
  // Chargez ici les participants de l'annonce depuis votre API ou votre source de données
  const fetchParticipants = async (sportId: string) => {
    try {
      const response = await ParticipationsService.getParticipationsBySportId(sportId)
      console.log(response)
      setParticipants(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des participants', error)
    }
  }
  const fetchAnnounce = async (sportId: string) => {
    try {
      const response = await AnnouncesService.getById(sportId)
      console.log(response)
      setAnnounce(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des participants', error)
    }
  }
  useEffect(() => {
    void fetchParticipants(sportId ?? '')
    void fetchAnnounce(sportId ?? '')
  }, [sportId])

  const handleAccept = async (participantId: string) => {
    try {
      // Envoyez une requête pour accepter la participation avec participantId
      await axios.put(`/api/participations/${participantId}/accept`)
      // Mettez à jour l'état des participants localement
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant._id === participantId
            ? { ...participant, etat: 'accepted' }
            : participant
        )
      )
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la participation', error)
    }
  }

  const handleReject = async (participantId: string) => {
    try {
      // Envoyez une requête pour refuser la participation avec participantId
      await axios.put(`/api/participations/${participantId}/reject`)
      // Mettez à jour l'état des participants localement
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant._id === participantId
            ? { ...participant, etat: 'refused' }
            : participant
        )
      )
    } catch (error) {
      console.error('Erreur lors du refus de la participation', error)
    }
  }

  return announce ? (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            {' Détails de l\'annonce'}
          </Typography>
          <Typography color="textSecondary">
            Sport: {announce.sport}
          </Typography>
          {/* Affichez d'autres détails de l'annonce ici */}
        </CardContent>
      </Card>
      <br />
      <Typography variant="h5" component="div">
        Liste des Participants
      </Typography>
      <Grid container spacing={2}>
        {participants.map((participant) => (
          <Grid item xs={12} sm={6} md={4} key={participant._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {participant.participant.userName}
                </Typography>
                <Typography color="textSecondary">
                  État: {participant.etat}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => handleAccept(participant._id)}
                  startIcon={<CheckCircle />}
                  disabled={participant.etat !== 'pending'}
                >
                  Accepter
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={async () => handleReject(participant._id)}
                  startIcon={<Cancel />}
                  disabled={participant.etat !== 'pending'}
                >
                  Refuser
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  ) : null
}

export default AnnounceDetails

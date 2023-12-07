import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Grid, Container, Box, CssBaseline, Paper } from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'
import AnnounceData from '../Types/Announce.types'
import PopulateParticipationData from '../Types/PopulateParticipations.types'
import ParticipationsService from '../Services/Participations'
import PublicService from '../Services/Public'
import background from './Images/football_homepage.jpeg'
import DetailAnnounce from './Details'
import { useAppContext } from './AppContextProps'

const ViewDetailAnnounce: React.FC = () => {
  const [participantsGestion, setParticipantsGestion] = useState<PopulateParticipationData[]>([])
  const [participantsList, setParticipantsList] = useState<PopulateParticipationData[]>([])
  const [sport, setSport] = useState<AnnounceData>()
  const sportId = useParams().sportId ?? ''

  // Chargez ici les participants de l'annonce depuis votre API ou votre source de données
  const fetchParticipantsGestion = async (sportId: string) => {
    try {
      const response = await ParticipationsService.getParticipationsGestionBySportId(sportId)
      setParticipantsGestion(response.data)
    } catch (error) {
      setParticipantsGestion([])
      console.error('Erreur lors du chargement de la gestion des participants', error)
    }
  }

  const fetchParticipantsList = async (sportId: string) => {
    try {
      const response = await ParticipationsService.getParticipationsListBySportId(sportId)
      setParticipantsList(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement de la liste des participants', error)
    }
  }

  const fetchAnnounce = async (sportId: string) => {
    try {
      const response = await PublicService.getSportById(sportId)
      setSport(response.data.sport)
    } catch (error) {
      console.error('Erreur lors du chargement du sport', error)
    }
  }

  const {isYourParticipationOrAnnounce} = useAppContext()

  useEffect(() => {
    if (isYourParticipationOrAnnounce) {
      void fetchParticipantsGestion(sportId ?? '')
      void fetchParticipantsList(sportId ?? '')
    }
    void fetchAnnounce(sportId ?? '')
  }, [sportId])

  const handleAccept = async (participantId: string) => {
    try {
      // Envoyez une requête pour accepter la participation avec participantId
      await ParticipationsService.acceptParticipation(sportId, participantId)
      // Mettez à jour l'état des participants localement
      setParticipantsGestion((prevParticipants) =>
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
      await ParticipationsService.rejectParticipation(sportId, participantId)
      setParticipantsGestion((prevParticipants) =>
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

  return sport ? (
    <Container component="main"
      sx={{
        minWidth: '100%',
        background: `url(${background})`,
        backgroundSize: 'cover',
        minHeight: '100vh'
      }}
    >
      <CssBaseline />
      <Box maxWidth="lg" component={Paper}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          p: 5,
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Typography variant="h5" component="div" sx={{marginBottom: '25px'}}>
              Détails de l&apos;annonce : {sport.sport}
            </Typography>
            <DetailAnnounce sport={sport} isYourParticipationOrAnnounce={isYourParticipationOrAnnounce} isOrganizerDisplay={true}/>
          </Grid>
          {isYourParticipationOrAnnounce &&
            <>
              <Grid item md={6}>
                {participantsList.map((participant) => (
                  <Grid item xs={12} sm={6} md={4} key={participant._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {participant.participant.userName}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {participantsGestion.map((participant) => (
                  <Grid item xs={12} sm={6} md={4} key={participant._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {participant.participant.userName}
                        </Typography>
                        <Typography color="textSecondary">
                          Etat de la demande: {(() => {
                            switch (participant.etat) { // eslint-disable-next-line indent
                              // eslint-disable-next-line indent
                              case 'accepted': return 'Acceptée'
                              // eslint-disable-next-line indent
                              case 'refused': return 'Refusée'
                              // eslint-disable-next-line indent
                              case 'pending': return 'En attente'
                              // eslint-disable-next-line indent
                              case 'expired': return 'Expirée'
                              // eslint-disable-next-line indent
                              default: return participant.etat
                            }
                          })()}
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
            </>
          }
        </Grid>
      </Box>
    </Container>
  ) : null
}

export default ViewDetailAnnounce

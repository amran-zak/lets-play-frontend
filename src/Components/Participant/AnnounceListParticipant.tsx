import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardMedia, CardContent, Typography, CardActionArea, Grid, useTheme, Box, CardActions, Button } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import Start from '@mui/icons-material/Start'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Phone from '@mui/icons-material/Phone'
import { SvgIconProps } from '@mui/material/SvgIcon'
import AnnounceData from '../../Types/Announce.types'
import background from '../Images/image.jpeg'
import ParticipationsService from '../../Services/Participations'
import PopulateParticipationData from '../../Types/PopulateParticipations.types'

interface DetailProps {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}
const AnnouncesListsParticipant: React.FC = () => {
  const navigate = useNavigate()

  const [participation, setParticipation] = useState<PopulateParticipationData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchparticipation = () => {
    // Récupérez les participations de l'utilisateur connecté
    ParticipationsService.getMyAllParticipations().then(response => {
      const sports: [AnnounceData] = response.data.map((s: { sport: AnnounceData }) => s.sport)
      setParticipation(response.data)
      setLoading(false)
    }).catch(error => {
      console.error(error)
    })
  }
  const handleAnnuler = (participationID: string) => {
    ParticipationsService.deleteParticipation(participationID).then((result) => {
      alert('Participation a été bien supprimer!')
      fetchparticipation()
    }).catch((error) => {
      alert('Veuillez vous connectez à votre compte!')
      console.error(error)
    })
  }
  useEffect(() => {
    fetchparticipation()
  }, [])

  const theme = useTheme()
  const Detail: React.FC<DetailProps> = ({ icon: IconComponent, children }) => (
    <Box display="flex" alignItems="center" mt={1}>
      <IconComponent color="action" style={{ marginRight: theme.spacing(1), color: 'green' }} />
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Box>
  )
  return (
    <Grid container spacing={4} style={{ padding: theme.spacing(2), marginTop: 50 }}>
      {participation.map((participation, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card elevation={3}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={background}
                alt={participation.sport.sport}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ color: theme.palette.primary.main }}>
                  {participation.sport.sport}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Detail icon={PeopleIcon}>Maximum: {participation.sport.numberOfPeopleMax}</Detail>
                  </Grid>
                  <Grid item xs={6}>
                    <Detail icon={ChildFriendlyIcon}>Ages: {participation.sport.ageMin} - {participation.sport.ageMax}</Detail>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Detail icon={EventIcon}>Date: {new Date(participation.sport.date).toLocaleDateString()}</Detail>
                  </Grid>
                  <Grid item xs={6}>
                    <Detail icon={AttachMoneyIcon}>Prix: {participation.sport.price}€</Detail>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Detail icon={AccessTimeIcon}>Debut: {new Date(participation.sport.startTime).getUTCHours()}h{new Date(participation.sport.startTime).getUTCMinutes()}</Detail>
                  </Grid>
                  <Grid item xs={6}>
                    <Detail icon={AccessTimeIcon}>Fin: {new Date(participation.sport.endTime).getUTCHours()}h{new Date(participation.sport.endTime).getUTCMinutes()}</Detail>
                  </Grid>
                </Grid>
                <Detail icon={LocationOnIcon}>Adresse postal: {participation.sport.address}</Detail>
                <Detail icon={LocationOnIcon}>Ville: {participation.sport.city ? `${participation.sport.city}` : ''}</Detail>
                <Detail icon={PeopleIcon}>Organisateur: {participation.sport.organizer?.userName}</Detail>
                <Detail icon={Start}>
                  Etat de la demande: {(() => {
                    switch (participation.etat) { // eslint-disable-next-line indent
                      // eslint-disable-next-line indent
                      case 'accepted': return 'Acceptée'
                      // eslint-disable-next-line indent
                      case 'refused': return 'Refusée'
                      // eslint-disable-next-line indent
                      case 'pending': return 'En attente'
                      // eslint-disable-next-line indent
                      case 'expired': return 'Expirée'
                      // eslint-disable-next-line indent
                      default: return participation.etat
                    }
                  })()}
                </Detail>
                {/* Add masked phoneNumber */}
                <Detail icon={Phone}>
                Téléphone: {`${participation.sport.organizer?.phoneNumber ? participation.sport.organizer.phoneNumber : '** **-***-****`'}`}
                </Detail>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Box width="100%">
                { new Date(participation.sport.date).getTime() < new Date().getTime() ? (
                  <Button size="large" color="primary" variant="contained" fullWidth disabled>
                    Expiré
                  </Button>
                ) : participation.etat === 'accepted' ? (
                  <Button size="large" color="primary" variant="contained" fullWidth disabled>
                    Accepté
                  </Button>
                ) : participation.etat === 'refused' ? (
                  <Button size="large" color="primary" variant="contained" fullWidth disabled>
                    Refusé
                  </Button>
                ) : (
                  <Button size="large" color="error" variant="contained" fullWidth onClick={() => handleAnnuler(participation._id ? participation._id : '')}>
                    Annuler
                  </Button>
                )}

              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default AnnouncesListsParticipant

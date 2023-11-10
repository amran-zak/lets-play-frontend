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
import publicService from '../../Services/Public'
import ParticipationsService from '../../Services/Participations'
import PopulateParticipationData from '../../Types/PopulateParticipations.types'
import Authentification from '../../Services/Authentification'
import UserProfileData from '../../Types/ProfileModif.types'

interface DetailProps {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}
const AnnouncesListsParticipant: React.FC = () => {
  const navigate = useNavigate()

  const [participation, setParticipation] = useState<PopulateParticipationData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPartcipation = () => {
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
      fetchPartcipation()
    }).catch((error) => {
      alert('Veuillez vous connectez à votre compte!')
      console.error(error)
    })
  }
  useEffect(() => {
    fetchPartcipation()
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
      {participation.map((partcipation, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card elevation={3}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={background}
                alt={partcipation.sport.sport}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" style={{ color: theme.palette.primary.main }}>
                  {partcipation.sport.sport}
                </Typography>
                <Detail icon={PeopleIcon}>Maximum: {partcipation.sport.numberOfPeopleMax}</Detail>
                <Detail icon={EventIcon}>Date: {new Date(partcipation.sport.date).toLocaleDateString()}</Detail>
                <Detail icon={AccessTimeIcon}>Debut: {new Date(partcipation.sport.startTime).toLocaleTimeString()} - {new Date(partcipation.sport.endTime).toLocaleTimeString()}</Detail>
                <Detail icon={AccessTimeIcon}>Fin: {new Date(partcipation.sport.endTime).toLocaleTimeString()} - {new Date(partcipation.sport.endTime).toLocaleTimeString()}</Detail>
                <Detail icon={LocationOnIcon}>Adresse postal: {partcipation.sport.address}</Detail>
                <Detail icon={LocationOnIcon}>Ville: {partcipation.sport.city ? `, ${partcipation.sport.city}` : ''}</Detail>
                <Detail icon={ChildFriendlyIcon}>Ages: {partcipation.sport.ageMin} - {partcipation.sport.ageMax}</Detail>
                <Detail icon={AttachMoneyIcon}>Prix: {partcipation.sport.price}€</Detail>
                <Detail icon={PeopleIcon}>Organisateur: {partcipation.sport.organizer?.userName}</Detail>
                <Detail icon={Start}>Etat de la demande: {partcipation.etat}</Detail>
                {/* Add masked phoneNumber */}
                <Detail icon={Phone}>
                Téléphone: {`${partcipation.sport.organizer?.phoneNumber ? partcipation.sport.organizer.phoneNumber : '** **-***-****`'}`}
                </Detail>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Box width="100%">
                { new Date(partcipation.sport.date).getTime() < new Date().getTime() ? (
                  <Button size="large" color="primary" variant="contained" fullWidth disabled>
                    Déja expiré
                  </Button>
                ) : partcipation.etat === 'accepted' ? (
                  <Button size="large" color="primary" variant="contained" fullWidth disabled>
                    Déja accepté
                  </Button>
                ) : partcipation.etat === 'refused' ? (
                  <Button size="large" color="primary" variant="contained" fullWidth disabled>
                    Déja refusé
                  </Button>
                ) : (
                  <Button size="large" color="error" variant="contained" fullWidth onClick={() => handleAnnuler(partcipation._id ? partcipation._id : '')}>
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

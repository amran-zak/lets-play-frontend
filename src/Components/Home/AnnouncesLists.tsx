import React, { useEffect, useState } from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
  useTheme,
  Box,
  CardActions,
  Button
} from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Phone from '@mui/icons-material/Phone'
import { SvgIconProps } from '@mui/material/SvgIcon'
import AnnounceData from '../../Types/Announce.types'
import publicService from '../../Services/Public'
import ParticipationsService from '../../Services/Participations'
import PopulateParticipationData from '../../Types/PopulateParticipations.types'
import Authentification from '../../Services/Authentification'
import UserProfileData from '../../Types/ProfileModif.types'
import { sportsListMapping, SportsListMappingKey } from '../../Types/SportListImagePath'
import FilterComponent from '../Tools/FiltersSport'
import PaginationComponent from '../Tools/PaginationComponent'

interface DetailProps {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}

const AnnouncesLists: React.FC = () => {
  const [userParticipations, setUserParticipations] = useState<PopulateParticipationData[]>([])
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)

  const [sportsList, setSportsList] = useState<AnnounceData[]>([])

  const handleParticipe = (sportId: string) => {
    ParticipationsService.participer(sportId).then((result) => {
      alert('Participation a été bien prise en compte!')
      window.location.reload()
    }).catch((error) => {
      alert('Veuillez vous connectez à votre compte!')
      console.error(error)
    })
  }
  useEffect(() => {
    // Récupérez les participations de l'utilisateur connecté
    ParticipationsService.getMyAllParticipations().then(response => {
      setUserParticipations(response.data)
    }).catch(error => {
      console.error(error)
    })
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await Authentification.getProfile()
        setProfileData(response.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    void fetchProfile()
  }, [])
  // Fonction pour vérifier si l'utilisateur a déjà participé à un sport donné
  const hasParticipated = (sportId: string) => {
    return userParticipations?.some(participation => participation.sport._id === sportId)
  }

  useEffect(() => {
    publicService.getAllSports()
      .then(response => {
        const data = response.data
        setSportsList(data.sports)
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching sports:', error)
      })
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

  const [currentPage, setCurrentPage] = useState(1)
  const announcesPerPage = 6 // Nombre d'annonces à afficher par page

  const indexOfLastAnnounce = currentPage * announcesPerPage
  const indexOfFirstAnnounce = indexOfLastAnnounce - announcesPerPage
  const currentAnnounces = sportsList.slice(indexOfFirstAnnounce, indexOfLastAnnounce)

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage)
  }

  const FilterProps = {
    sportsList,
    setSportsList
  }

  const PaginationProps = {
    currentPage,
    handlePageChange,
    totalPageCount: Math.ceil(sportsList.length / announcesPerPage)
  }

  return (
    <>
      <Grid container spacing={4} style={{ padding: theme.spacing(2), marginTop: 100 }}>
        <FilterComponent {...FilterProps}/>
        {currentAnnounces.map((sport, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  src={require(`../Images/sports_images/${sportsListMapping[sport?.sport as SportsListMappingKey]}`)}
                  alt={`Photo du sport ${sportsListMapping[sport?.sport as SportsListMappingKey]}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" style={{color: useTheme().palette.primary.main}}>
                    {sport.sport}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Detail icon={PeopleIcon}>Maximum: {sport.numberOfPeopleMax}</Detail>
                    </Grid>
                    <Grid item xs={6}>
                      <Detail icon={PeopleIcon}>Déjà inscrit: {sport.numberOfPeopleCurrent}</Detail>
                    </Grid>
                    <Grid item xs={6}>
                      <Detail icon={ChildFriendlyIcon}>Ages: {sport.ageMin} - {sport.ageMax}</Detail>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Detail icon={EventIcon}>Date: {new Date(sport.date).toLocaleDateString()}</Detail>
                    </Grid>
                    <Grid item xs={6}>
                      <Detail icon={AttachMoneyIcon}>Prix: {sport.price}€</Detail>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Detail icon={AccessTimeIcon}>Debut: {new Date(sport.startTime).getUTCHours()}h{new Date(sport.startTime).getUTCMinutes()}</Detail>
                    </Grid>
                    <Grid item xs={6}>
                      <Detail icon={AccessTimeIcon}>Fin: {new Date(sport.endTime).getUTCHours()}h{new Date(sport.endTime).getUTCMinutes()}</Detail>
                    </Grid>
                  </Grid>
                  <Detail icon={LocationOnIcon}>Adresse postal: {sport.address}</Detail>
                  <Detail icon={LocationOnIcon}>Ville: {sport.city ? `${sport.city}` : ''}</Detail>
                  <Detail icon={PeopleIcon}>Organisateur: {sport.organizer?.userName}</Detail>
                  {/* Add masked phoneNumber */}
                  <Detail icon={Phone}>
                  Téléphone: {`${sport.organizer?.phoneNumber ? '+33 0' + sport.organizer.phoneNumber : ''}* ** ** **`}
                  </Detail>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Box width="100%">
                  {sport.organizer?._id === profileData?._id ? (
                    <Button size="large" variant="outlined" fullWidth disabled>
                  Votre annonce
                    </Button>
                  ) : hasParticipated(sport._id ? sport._id : '') ? (
                    <Button size="large" variant="outlined" fullWidth disabled>
                      Inscrit
                    </Button>
                  ) : sport.numberOfPeopleMax === sport.numberOfPeopleCurrent ? (
                    <Button size="large" color="primary" variant="contained" fullWidth disabled>
                      Complet
                    </Button>
                  ) : (
                    <Button size="large" color="primary" variant="contained" fullWidth onClick={() => handleParticipe(sport._id ? sport._id : '')}>
                      Participer
                    </Button>
                  )}
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <PaginationComponent {...PaginationProps} />
    </>
  )
}

export default AnnouncesLists

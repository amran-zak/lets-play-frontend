// React
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Materials
import { Card, CardMedia, CardContent, CardActionArea, Grid, useTheme, Box, CardActions, Button } from '@mui/material'
// Files
import { useAppContext } from '../AppContextProps'
import { sportsListMapping, SportsListMappingKey } from '../../Types/SportListImagePath'
import AnnounceData from '../../Types/Announce.types'
import PublicService from '../../Services/Public'
import ParticipationsService from '../../Services/Participations'
import PopulateParticipationData from '../../Types/PopulateParticipations.types'
import Authentification from '../../Services/Authentification'
import UserProfileData from '../../Types/ProfileModif.types'
import FilterComponent from '../Tools/FiltersSport'
import PaginationComponent from '../Tools/PaginationComponent'
import DetailAnnounce from '../Tools/AnnounceDetails/DetailAnnounce'

const AnnouncesLists: React.FC = () => {
  const [userParticipations, setUserParticipations] = useState<PopulateParticipationData[]>([])
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)

  const [sportsList, setSportsList] = useState<AnnounceData[]>([])

  const handleParticipe = (sportId: string) => {
    ParticipationsService.participer(sportId).then((result) => {
      window.location.reload()
    }).catch((error) => {
      alert('Veuillez vous connectez à votre compte !')
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

  const { setIsYourParticipationOrAnnounce } = useAppContext()
  // Fonction pour vérifier si l'utilisateur a déjà participé à un sport donné
  const hasParticipated = (sportId: string) => {
    if (userParticipations?.some(participation => participation.sport._id === sportId)) {
      setIsYourParticipationOrAnnounce(true)
    }
    return userParticipations?.some(participation => participation.sport._id === sportId)
  }

  useEffect(() => {
    PublicService.getAllSports()
      .then(response => {
        const data = response.data
        setSportsList(data.sports)
      })
      .catch(error => {
        console.error('Error fetching sports:', error)
      })
  }, [])

  const [currentPage, setCurrentPage] = useState(1)
  const announcesPerPage = 6

  const indexOfLastAnnounce = currentPage * announcesPerPage
  const indexOfFirstAnnounce = indexOfLastAnnounce - announcesPerPage
  const currentAnnounces = sportsList.slice(indexOfFirstAnnounce, indexOfLastAnnounce)

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage)
  }

  const FilterProps = {
    sportsList,
    setSportsList,
    getAllSports: PublicService.getAllSports
  }

  const PaginationProps = {
    currentPage,
    handlePageChange,
    totalPageCount: Math.ceil(sportsList.length / announcesPerPage)
  }

  const navigate = useNavigate()
  const handleViewDetails = (sportId: string) => {
    setIsYourParticipationOrAnnounce(false)
    void hasParticipated(sportId)
    navigate(`/annonce/details/${sportId}`)
  }

  const theme = useTheme()

  return (
    <>
      <Grid container spacing={4} style={{ padding: theme.spacing(2), marginTop: 100 }}>
        <FilterComponent {...FilterProps}/>
        {currentAnnounces.map((sport, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3}>
              <CardActionArea onClick={() => handleViewDetails(sport._id ? sport._id : '')}>
                <CardMedia
                  component="img"
                  height="140"
                  src={require(`../Images/sports_images/${sportsListMapping[sport?.sport as SportsListMappingKey]}`)}
                  alt={`Photo du sport ${sportsListMapping[sport?.sport as SportsListMappingKey]}`}
                />
                <CardContent>
                  <DetailAnnounce sport={sport}/>
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

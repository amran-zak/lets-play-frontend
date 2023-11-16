import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Button,
  InputLabel, OutlinedInput, InputAdornment, Icon, FormControl, debounce
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

interface CitySuggestion {
  city: string
}

const AnnouncesLists: React.FC = () => {
  const navigate = useNavigate()
  const [userParticipations, setUserParticipations] = useState<PopulateParticipationData[]>([])
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)

  const [sportsList, setSportsList] = useState<AnnounceData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 100]) // Assuming price range is an array [min, max]
  const [selectedAgeRange, setSelectedAgeRange] = useState([0, 100]) // Assuming age range is an array [min, max]
  const [selectedDate, setSelectedDate] = useState(new Date())

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
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching sports:', error)
        setLoading(false)
      })
  }, [])
  useEffect(() => {
    // Fetch the list and apply the filters
    // You can either filter on the client side after fetching all data
    // Or ideally, send these filter parameters to the backend and let the backend handle the filtering for efficiency
  }, [selectedSport, selectedCity, selectedPriceRange, selectedAgeRange, selectedDate])
  // A generic filter function that could be used to filter the list based on the selected state
  const applyFilters = (sports: AnnounceData[]) => {
    return sports.filter((sport) => {
      return (
        sport.sport === selectedSport &&
        sport.city === selectedCity &&
        sport.price >= selectedPriceRange[0] &&
        sport.price <= selectedPriceRange[1] &&
        sport.ageMin >= selectedAgeRange[0] &&
        sport.ageMax <= selectedAgeRange[1] &&
        new Date(sport.date) >= selectedDate
      )
    })
  }

  const [searchCity, setSearchCity] = React.useState<string>('')
  const [isFiltered, setIsFiltered] = React.useState<boolean>(false)

  const fetchCitySuggestions = async (input: string) => {
    if (input.length >= 3) {
      try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${input.replaceAll(' ', '+')}&type=municipality&limit=5`)
        if (response.ok) {
          const data = await response.json()
          if (data.features) {
            const uniqueCitySuggestions: CitySuggestion[] = []
            const seenCities = new Set()

            data.features.forEach((feature: { properties: { city: string } }) => {
              const city = feature.properties.city
              // Vérifier si la ville n'a pas déjà été ajoutée
              if (!seenCities.has(city)) {
                uniqueCitySuggestions.push({ city })
                seenCities.add(city)
              }
            })

            setCitySuggestions(uniqueCitySuggestions)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const debouncedFetchCitySuggestions = useCallback(
    debounce(async (input) => fetchCitySuggestions(input), 300), []
  )

  const handleSearchAddress = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(event.target.value)
    await debouncedFetchCitySuggestions(event.target.value)
  }

  const handleFilter = () => {
    const filtered = sportsList.filter(
      (element) =>
        element.city &&
        element.city
          .toLowerCase()
          .includes(searchCity.toLowerCase())
    )
    setIsFiltered(true)
    setSportsList(filtered)
  }

  const handleFilterReset = () => {
    publicService.getAllSports()
      .then(response => {
        const data = response.data
        setSportsList(data.sports)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching sports:', error)
        setLoading(false)
      })

    setIsFiltered(false)
    setSearchCity('')
  }

  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([])

  const handleCitySuggestionClick = (suggestion: CitySuggestion) => {
    setSearchCity(suggestion.city)
    setCitySuggestions([])
  }

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
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <FormControl sx={{ my: 1, mt: 5, textAlign: 'center' }} size='small'>
            <InputLabel
              htmlFor="outlined-adornment-amount"
              sx={{ backgroundColor: 'white', paddingRight: '5px' }}
            >
              Rechercher par nom de ville
            </InputLabel>
            <OutlinedInput
              id='outlined-adornment-location'
              value={searchCity}
              onChange={handleSearchAddress}
              endAdornment={
                <InputAdornment position='end'>
                  <Icon fontSize='small' sx={{ marginLeft: '10px' }}></Icon>
                </InputAdornment>
              }
              label='Location'
            />
            {citySuggestions.length > 0 && (
              <ul>
                {citySuggestions.map((suggestion, index) => (
                  <li color='black' key={index} onClick={() => handleCitySuggestionClick(suggestion)}
                    style={{cursor: 'pointer'}}>{suggestion.city}</li>
                ))}
              </ul>
            )}
            {!isFiltered &&
              <Button
                variant="contained"
                sx={{ marginTop: '10px', bgcolor: 'secondary.main' }}
                onClick={handleFilter}
                disabled={!searchCity}
              >
                Valider
              </Button>
            }
            {isFiltered &&
              <Button
                variant="contained"
                sx={{ marginTop: '10px', bgcolor: 'secondary.main' }}
                onClick={handleFilterReset}
              >
                Rénitialiser les filtres
              </Button>
            }
          </FormControl>
        </Grid>
      </Grid>
      {sportsList.map((sport, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card elevation={3}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={background}
                alt={sport.sport}
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
                Téléphone: {`${sport.organizer?.phoneNumber ? sport.organizer.phoneNumber : '06'}**-***-****`}
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
  )
}

export default AnnouncesLists

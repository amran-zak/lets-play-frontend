import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Importations nécessaires depuis @mui/material
import { Card, CardMedia, CardContent, Typography, CardActionArea, Grid, useTheme, Box, CardActions, Button } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Phone from '@mui/icons-material/Phone'
import { SvgIconProps } from '@mui/material/SvgIcon'
// Datas
import AnnounceData from '../../Types/Announce.types'
import background from '../Images/image.jpeg'
// Services
import publicService from '../../Services/Public'

interface DetailProps {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}
const AnnouncesLists: React.FC = () => {
  const navigate = useNavigate()

  const [sportsList, setSportsList] = useState<AnnounceData[]>([])
  const [loading, setLoading] = useState(true)
  // Filter state hooks
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 100]) // Assuming price range is an array [min, max]
  const [selectedAgeRange, setSelectedAgeRange] = useState([0, 100]) // Assuming age range is an array [min, max]
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleParticipe = (sportId: string) => {
    navigate(`/participer_une_annonce/${sportId}`)
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
                <Typography gutterBottom variant="h5" component="div" style={{ color: theme.palette.primary.main }}>
                  {sport.sport}
                </Typography>
                <Detail icon={PeopleIcon}>Maximum: {sport.numberOfPeopleMax}</Detail>
                <Detail icon={EventIcon}>Date: {new Date(sport.date).toLocaleDateString()}</Detail>
                <Detail icon={AccessTimeIcon}>Debut: {new Date(sport.startTime).toLocaleTimeString()} - {new Date(sport.endTime).toLocaleTimeString()}</Detail>
                <Detail icon={AccessTimeIcon}>Fin: {new Date(sport.endTime).toLocaleTimeString()} - {new Date(sport.endTime).toLocaleTimeString()}</Detail>
                <Detail icon={LocationOnIcon}>Adresse postal: {sport.address}</Detail>
                <Detail icon={LocationOnIcon}>Ville: {sport.city ? `, ${sport.city}` : ''}</Detail>
                <Detail icon={ChildFriendlyIcon}>Ages: {sport.ageMin} - {sport.ageMax}</Detail>
                <Detail icon={AttachMoneyIcon}>Prix: {sport.price}€</Detail>
                <Detail icon={PeopleIcon}>Organisateur: {sport.organizer?.userName}</Detail>
                {/* Add masked phoneNumber */}
                <Detail icon={Phone}>
                Téléphone: {`${sport.organizer?.phoneNumber ? sport.organizer.phoneNumber : '06'}**-***-****`}
                </Detail>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Box width="100%">
                <Button size="large" color="primary" variant="contained" fullWidth onClick={() => handleParticipe(sport._id ? sport._id : '')}>
                  Participer
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default AnnouncesLists

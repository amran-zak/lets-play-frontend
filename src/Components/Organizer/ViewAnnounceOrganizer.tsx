import React, { useEffect, useState } from 'react'
// Importations nécessaires depuis @mui/material
import { Card, CardMedia, CardContent, Typography, CardActionArea, Grid, useTheme, Box } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { SvgIconProps } from '@mui/material/SvgIcon'
// Datas
import AnnounceData from '../../Types/Announce.types'
import background from '../Images/image.jpeg'
// Services
import organizerService from '../../Services/Organizer'

interface DetailProps {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}
const SportsListOrganizer: React.FC = () => {
  const [sportsList, setSportsList] = useState<AnnounceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    organizerService.getAllSports()
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
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default SportsListOrganizer

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardMedia, CardContent, Typography, CardActionArea, Grid, useTheme, Box, CardActions, Button } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { SvgIconProps } from '@mui/material/SvgIcon'
import AnnounceData from '../../Types/Announce.types'
import background from '../Images/image.jpeg'
import Announce from '../../Services/Announce'

interface DetailProps {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}

const Detail: React.FC<DetailProps> = ({
  icon: IconComponent,
  children
}) => (
  <Box display="flex" alignItems="center" mt={1}>
    <IconComponent color="action" style={{
      marginRight: useTheme().spacing(1),
      color: 'green'
    }}/>
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  </Box>
)

export default function ViewAnnounceOrganizer() {
  const navigate = useNavigate()

  const [sportsList, setSportsList] = useState<AnnounceData[]>([])
  const [, setLoading] = useState(true)

  const handleEdit = (sportId: string) => {
    navigate(`/annonce/modifier/${sportId}`)
  }

  const handleDelete = (sport: AnnounceData) => {
    // Logique pour gérer la suppression
    console.log('Supprimer', sport)
  }

  useEffect(() => {
    Announce.getAll()
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

  return (
    <Grid container spacing={4} style={{
      padding: useTheme().spacing(2),
      marginTop: 50
    }}>
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
                    <Detail icon={AccessTimeIcon}>Debut: {new Date(sport.startTime).toLocaleTimeString()}</Detail>
                  </Grid>
                  <Grid item xs={6}>
                    <Detail icon={AccessTimeIcon}>Fin: {new Date(sport.endTime).toLocaleTimeString()}</Detail>
                  </Grid>
                </Grid>
                <Detail icon={LocationOnIcon}>Adresse postal: {sport.address}</Detail>
                <Detail icon={LocationOnIcon}>Ville: {sport.city ? `${sport.city}` : ''}</Detail>
              </CardContent>
            </CardActionArea>
            <CardActions style={{justifyContent: 'space-between'}}>
              <Button size="small" color="primary" variant="contained"
                onClick={() => handleEdit(sport._id ? sport._id : '')}>
                Modifier
              </Button>
              <Button size="small" color="error" variant="contained" onClick={() => handleDelete(sport)}>
                Supprimer
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

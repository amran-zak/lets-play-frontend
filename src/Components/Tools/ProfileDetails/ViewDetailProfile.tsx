// React
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// Materials
import { Typography, Grid, Container, Box, CssBaseline, Paper } from '@mui/material'
// Icons
// Images
import background from '../../Images/football_homepage.jpeg'
// Files
import { useAppContext } from '../../AppContextProps'
import UserData from '../../../Types/User.types'
import Users from '../../../Services/Users'
import DetailProfile from './DetailProfile'

const DetailsProfileUserPage: React.FC = () => {
  const [user, setUser] = useState<UserData>()
  const userId = useParams().userId ?? ''

  const fetchUser = async (userId: string) => {
    try {
      const response = await Users.getProfileById(userId)
      setUser(response.data.user)
    } catch (error) {
      console.error('Erreur lors du chargement du profile', error)
    }
  }

  const {isYourParticipationOrAnnounce} = useAppContext()

  useEffect(() => {
    void fetchUser(userId ?? '')
  }, [userId])

  return user ? (
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
              Détails du profile
            </Typography>
            <img
              height="140" style={{marginBottom: '20px', borderRadius: '10px'}}
              src={require('../../Images/football_homepage.jpeg')}
              alt='Photo de profile'
            /><br/>
            <DetailProfile user={user} isYourParticipationOrAnnounce={isYourParticipationOrAnnounce}/>
          </Grid>
        </Grid>
      </Box>
    </Container>
  ) : null
}

export default DetailsProfileUserPage

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Typography, Button, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import homPageImage from '../../Components/Images/football_homepage.jpeg'

const HeroSection = () => {
  const theme = useTheme()
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'))

  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/liste_annonces')
  }

  return (
    <Grid
      component='main'
      sx={{
        position: 'relative',
        height: '700px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${homPageImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#000',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
          height: '600px'
        },
        [theme.breakpoints.down('sm')]: {
          height: '500px'
        }
      }}
    >
      <Grid item xs={12}>
        <Typography variant={matchesSM ? 'h4' : 'h2'} component="h1" gutterBottom>
          Trouvez l événement sportif parfait pour vous
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Rejoignez une communauté de passionnés et participez à des expériences sportives inoubliables
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => handleClick()}>
          Découvrez les annonces
        </Button>
      </Grid>
    </Grid>
  )
}

export default HeroSection

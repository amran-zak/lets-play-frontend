// React
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Materials
import { Grid, Typography, Button, useMediaQuery, Paper, Card, useTheme, lighten } from '@mui/material'
import moment from 'moment-timezone'
// Files
import homPageImage from '../../Components/Images/fond.png'
import logoSudOuest from '../../Components/Images/logo-sud-ouest.png'

const HeroSection = () => {
  const theme = useTheme()
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'))

  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/liste/annonces')
  }

  const [actualites, setActualites] = useState<Array<{ title: string, details: string, link: string, date: string }>>([])

  useEffect(() => {
    // Récupérer les données d'actualités depuis le flux RSS
    fetch('https://www.sudouest.fr/sport/rss.xml')
      .then(async response => {
        const data = await response.text()

        // Analyser les données XML en un objet DOM
        const xmlDoc = new DOMParser().parseFromString(data, 'text/xml')

        // Extraire et transformer les articles d'actualités de l'XML
        const actualites = Array.from(xmlDoc.querySelectorAll('item')).map(element => ({
          title: element.querySelector('title')?.textContent ?? '',
          details: element.querySelector('description')?.textContent ?? '',
          link: element.querySelector('link')?.textContent ?? '',
          date: moment(element.querySelector('pubDate')?.textContent).tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss')
        }))

        setActualites(actualites)
      })
      .catch(erreur => console.error('Erreur lors de la récupération des actualités :', erreur))
  }, [])

  return (
    <>
      <Grid
        component='main'
        sx={{
          position: 'relative',
          height: '100vh',
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
          <Card sx={{ m: 10, p: 5, backgroundColor: 'rgba(0, 0, 0, 0.8)', boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)' }}>
            <Typography variant={matchesSM ? 'h4' : 'h2'} component="h1" color='white'>
              Trouvez l&rsquo;événement sportif parfait pour vous
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }} color='white'>
              Rejoignez une communauté de passionnés et participez à des expériences sportives inoubliables
            </Typography>
            <Button variant="contained" color="primary" size="large" onClick={() => handleClick()}>
              Découvrez les annonces
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ mt: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Dernières actualités sportives :
        </Typography>
        <Grid container spacing={3} sx={{ padding: theme.spacing(3) }}>
          {actualites.map((article, index) => (
            <Grid item md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  marginBottom: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#f5f5f5',
                  ':hover': {backgroundColor: lighten(`${theme.palette.primary.light}`, 0.7)},
                  border: `solid 2px ${theme.palette.primary.light}`
                }}
              >
                <Grid container spacing={2}>
                  <Grid item md={10.5}>
                    <Typography variant="h6">
                      {article.title}
                    </Typography>
                  </Grid>
                  <Grid item md={1.5}>
                    <img alt="Logo du journal le Sud Ouest" src={logoSudOuest} style={{width: '100%'}}/>
                  </Grid>
                </Grid>
                <p>{article.details}</p>
                <Grid container spacing={3}>
                  <Grid item md={6}>
                    <Typography variant="caption" color="textSecondary">
                      Publié le {article.date}
                    </Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ marginTop: 'auto', alignSelf: 'flex-end' }}
                    >
                      Lire l&apos;article
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

export default HeroSection

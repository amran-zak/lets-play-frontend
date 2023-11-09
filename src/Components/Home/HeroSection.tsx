import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Typography, Button, useMediaQuery, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import moment from 'moment-timezone'
import homPageImage from '../../Components/Images/football_homepage.jpeg'
const HeroSection = () => {
  const theme = useTheme()
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'))

  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/liste_annonces')
  }

  const [actualites, setActualites] = useState<Array<{ titre: string, lien: string, date: string }>>([])

  useEffect(() => {
    // Récupérer les données d'actualités depuis le flux RSS
    fetch('https://www.sudouest.fr/sport/rss.xml')
      .then(async response => response.text())
      .then(data => {
        // Analyser les données XML en un objet DOM
        const parseur = new DOMParser()
        const xmlDoc = parseur.parseFromString(data, 'text/xml')

        // Extraire les articles d'actualités de l'XML
        const elements = xmlDoc.querySelectorAll('item')
        const donneesActualites: Array<{ titre: string, lien: string, date: string }> = []

        elements.forEach(element => {
          const elementTitre = element.querySelector('title')
          const elementLien = element.querySelector('link')
          const elementDate = element.querySelector('pubDate')

          if (elementTitre && elementLien && elementDate) {
            const titre = elementTitre.textContent ?? ''
            const lien = elementLien.textContent ?? ''
            const date = moment(elementDate.textContent).tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss')
            donneesActualites.push({ titre, lien, date })
            donneesActualites.push({ titre, lien, date })
          }
        })

        setActualites(donneesActualites)
      })
      .catch(erreur => {
        console.error('Erreur lors de la récupération des actualités :', erreur)
      })
  }, [])

  return (
    <Grid
      component="main"
      sx={{
        // Vos styles existants...
      }}
    >
      {/* Votre contenu existant... */}

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

      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Dernières actualités sportives :
        </Typography>
        {actualites.map((article, index) => (
          <Paper
            key={index}
            sx={{
              padding: 2,
              marginBottom: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <Typography variant="body1">{article.titre}</Typography>
              <Typography variant="caption">{article.date}</Typography>
            </div>
            <Button
              variant="contained"
              color="primary"
              href={article.lien}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lire larticle
            </Button>
          </Paper>
        ))}
      </Grid>
    </Grid>
  )
}

export default HeroSection

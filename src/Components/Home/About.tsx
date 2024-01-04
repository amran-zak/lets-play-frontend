// React
import React from 'react'
// Materials
import { Card, CardMedia, Grid, Typography, useTheme } from '@mui/material'
import { SportsSoccer } from '@mui/icons-material'
// Image
import homPageImage from '../../Components/Images/fond.png'
import logo from '../../Components/Images/logo.png'

const About = () => {
  const theme = useTheme()
  return (
    <Grid container spacing={4} sx={{ padding: theme.spacing(2), marginY: 10 }}>
      <Grid item md={12}>
        <Typography variant="h5" component="div" sx={{marginBottom: '25px'}} color="secondary">
          Bienvenue dans l&apos;univers de LET&apos;S PLAY
        </Typography>
        <Grid container spacing={5} sx={{textAlign: 'justify'}}>
          <Grid item md={6}>
            <p>
              LET&apos;S PLAY est une application web révolutionnaire conçue pour les passionnés de sport de tous horizons. Notre mission est de faciliter la découverte et la participation à des activités sportives locales, en créant un pont entre organisateurs d&apos;événements sportifs et participants enthousiastes.
            </p>
            <p>
              Avec LET&apos;S PLAY, plongez dans un monde où la diversité sportive et la convivialité sont à l&apos;honneur. Que vous soyez un sportif aguerri en quête de nouveaux défis, ou un débutant désireux d&apos;explorer différentes activités, notre plateforme vous offre une expérience unique et sur mesure.
            </p>
          </Grid>
          <Grid item md={6}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="200"
                src={homPageImage}
                alt='Image de sports'
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item md={4}>
            <Card elevation={3} sx={{marginX: 'auto', width: '90%', marginTop: '10%'}}>
              <CardMedia
                component="img"
                src={logo}
                alt='Logo de l application'
              />
            </Card>
          </Grid>
          <Grid item md={8} sx={{textAlign: 'justify'}}>
            <Typography variant="h5" component="div" sx={{marginTop: '50px', marginBottom: '25px'}} color="secondary">
              Caractéristiques clés de LET&apos;S PLAY
            </Typography>
            <ul style={{ listStyle: 'none', paddingLeft: 0, paddingRight: 15 }}>
              {['Facilité d\'utilisation : Une interface intuitive et conviviale qui rend la navigation et l\'inscription aux événements sportifs aussi simple qu\'un clic.',
                'Diversité des sports : Un large éventail d\'activités sportives pour répondre à tous les goûts et niveaux de compétence.',
                'Qualité des matchs : Un système de classement et de matchmaking équilibré pour des expériences de jeu compétitives et équitables.',
                'Sécurité des transactions : Des protocoles de paiement sécurisés pour garantir la tranquillité d&apos;esprit lors de la participation à des matchs payants.',
                'Communication efficace : Des canaux de communication en temps réel pour une coordination sans faille entre organisateurs et participants.',
                'Dashboards intuitifs : Des graphiques et des KPIs pour suivre vos activités et performances.',
                'Évaluations et feedbacks : Une fonctionnalité pour noter et recevoir des avis, améliorant la qualité et la fiabilité des événements.'
              ].map((text, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  <SportsSoccer style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                  {text}
                </li>
              ))}
            </ul>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default About

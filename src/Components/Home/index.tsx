// React
import React from 'react'
// Materials
import { Grid } from '@mui/material'
// Files
import HeroSection from './HeroSection'

const HomePage: React.FC = () => {
  return (
    <Grid
      container
      direction="column"
    >
      <section>
        <HeroSection />
      </section>
      <section className="featured-announcements">
        {/* Annonces en vedette */}
        {/* Ici, vous pouvez utiliser un composant similaire à celui que vous avez déjà pour afficher les cartes d'annonce */}
      </section>
      <section className="how-it-works" style={{ margin: '40px 0' }}>
        {/* <Typography variant="h4">Comment ça marche?</Typography> */}
        {/* Ajoutez du contenu descriptif ici */}
      </section>
      <section className="testimonials" style={{ margin: '40px 0' }}>
        {/* Témoignages */}
        {/* Ajoutez des témoignages ou des avis ici */}
      </section>
    </Grid>
  )
}

export default HomePage

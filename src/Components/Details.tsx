import React from 'react'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { SvgIconProps } from '@mui/material/SvgIcon'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Phone from '@mui/icons-material/Phone'
import AnnounceData from '../Types/Announce.types'

interface Detail {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}

const DetailAnnounce: React.FC<{ sport: AnnounceData, isPhoneNumberDisplay?: boolean }> = ({ sport, isPhoneNumberDisplay }) => {
  const organizer = sport?.organizer

  const Detail: React.FC<Detail> = ({ icon: IconComponent, children }) => (
    <Box display='flex' alignItems='center' mt={1}>
      <IconComponent color='action' style={{ marginRight: '10px', color: 'green' }} />
      <Typography variant='body2' color='text.secondary'>
        {children}
      </Typography>
    </Box>
  )

  return (
    <>
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
      <Detail icon={PeopleIcon}>Organisateur: {organizer?.userName}</Detail>
      <Detail icon={Phone}>
        Téléphone: {`${isPhoneNumberDisplay ? '+33 0' + organizer?.phoneNumber : '+33 0* ** ** **'}`}
      </Detail>
    </>
  )
}

export default DetailAnnounce

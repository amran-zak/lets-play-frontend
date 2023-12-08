// React
import React from 'react'
// Materials
import { SvgIconProps, Box, Grid, Typography } from '@mui/material'
// Icons
import EventIcon from '@mui/icons-material/Event'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Email, Face6, PhoneAndroid } from '@mui/icons-material'
// Files
import UserData from '../../../Types/User.types'

interface Detail {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
  color?: string
}

const DetailProfile: React.FC<{ user: UserData, isYourParticipationOrAnnounce?: boolean }> = ({ user, isYourParticipationOrAnnounce }) => {
  const Detail: React.FC<Detail> = ({ icon: IconComponent, children, color }) => (
    <Box display='flex' alignItems='center' mt={1} color={color}>
      <IconComponent color='action' style={{ marginRight: '10px', color: color ?? 'green' }} />
      <Typography variant='body2' color={color ?? 'text.secondary'}>
        {children}
      </Typography>
    </Box>
  )

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Detail icon={Face6}>{user.userName}</Detail>
        </Grid>
        <Grid item xs={6}>
          <Detail icon={EventIcon}>Année de naissance: {user.yearBirth}</Detail>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Detail icon={PhoneAndroid}>
            {`${isYourParticipationOrAnnounce ? '+33 ' + user.phoneNumber : '+33 0* ** ** **'}`}
          </Detail>
        </Grid>
        <Grid item xs={6}>
          <Detail icon={Email}>
            Mail: {`${isYourParticipationOrAnnounce ? user.email : '****@**.**'}`}
          </Detail>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Detail icon={LocationOnIcon}>
            Ville: {`${isYourParticipationOrAnnounce ? user.city : '****'}`}
          </Detail>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailProfile

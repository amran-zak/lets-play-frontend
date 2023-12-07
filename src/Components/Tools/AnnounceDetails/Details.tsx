import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { SvgIconProps } from '@mui/material/SvgIcon'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Phone from '@mui/icons-material/Phone'
import AnnounceData from '../../../Types/Announce.types'
import Authentification from '../../../Services/Authentification'
import UserProfileData from '../../../Types/ProfileModif.types'
import { useAppContext } from '../../AppContextProps'

interface Detail {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}

const DetailAnnounce: React.FC<{ sport: AnnounceData, isYourParticipationOrAnnounce?: boolean, isOrganizerDisplay?: boolean }> = ({ sport, isYourParticipationOrAnnounce, isOrganizerDisplay }) => {
  const organizer = sport?.organizer
  const { setIsYourParticipationOrAnnounce } = useAppContext()

  const Detail: React.FC<Detail> = ({ icon: IconComponent, children }) => (
    <Box display='flex' alignItems='center' mt={1}>
      <IconComponent color='action' style={{ marginRight: '10px', color: 'green' }} />
      <Typography variant='body2' color='text.secondary'>
        {children}
      </Typography>
    </Box>
  )

  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await Authentification.getProfile()
        setProfileData(response.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    void fetchProfile()

    if (!isYourParticipationOrAnnounce && sport.organizer?._id === profileData?._id) {
      setIsYourParticipationOrAnnounce(true)
    }
  }, [])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Detail icon={PeopleIcon}>Maximum: {sport.numberOfPeopleMax}</Detail>
        </Grid>
        <Grid item xs={6}>
          <Detail icon={PeopleIcon}>Déjà inscrit: {sport.numberOfPeopleCurrent}</Detail>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
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
      <Detail icon={LocationOnIcon}>{sport.address}</Detail>
      {isOrganizerDisplay &&
        <Detail icon={PeopleIcon}>Organisateur: {organizer?.userName}</Detail>
      }
      {isOrganizerDisplay &&
        <Detail icon={Phone}>
          Téléphone: {`${isYourParticipationOrAnnounce ? '+33 0' + organizer?.phoneNumber : '+33 0* ** ** **'}`}
        </Detail>
      }
    </>
  )
}

export default DetailAnnounce

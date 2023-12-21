// React
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Materials
import { SvgIconProps, Box, Button, Grid, IconButton, Tooltip, Typography } from '@mui/material'
// Icons
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Phone from '@mui/icons-material/Phone'
import { Face6 } from '@mui/icons-material'
// Files
import { useAppContext } from '../../AppContextProps'
import AnnounceData from '../../../Types/Announce.types'
import Authentification from '../../../Services/Authentification'
import UserProfileData from '../../../Types/ProfileModif.types'
import ViewAverageRating from '../RatingAndComment/ViewAverageRating'

interface Detail {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
  color?: string
}

const DetailAnnounce: React.FC<{ sport: AnnounceData, isYourParticipationOrAnnounce?: boolean, isOrganizerDisplay?: boolean }> = ({ sport, isYourParticipationOrAnnounce, isOrganizerDisplay }) => {
  const organizer = sport?.organizer
  const { setIsYourParticipationOrAnnounce } = useAppContext()

  const Detail: React.FC<Detail> = ({ icon: IconComponent, children, color }) => (
    <Box display='flex' alignItems='center' mt={1} color={color}>
      <IconComponent color='action' style={{ marginRight: '10px', color: color ?? 'green' }} />
      <Typography variant='body2' color={color ?? 'text.secondary'}>
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

  const [profile, setProfile] = useState<UserProfileData>()
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await Authentification.getProfile()
        setProfile(response.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    void fetchProfile()
  }, [])

  const navigate = useNavigate()
  const handleViewDetailsProfile = (userId: string) => {
    setIsYourParticipationOrAnnounce(false)
    if (profile?._id === userId) {
      navigate('/profile')
    } else {
      navigate(`/profile/${userId}`)
    }
  }

  return (
    <>
      {isOrganizerDisplay && (
        <Tooltip placement="right" style={{width: 'auto'}}
          title={
            <div>
              Détails de l&apos;organisateur
              <div style={{marginTop: '15px', marginBottom: '15px'}}>
                <Detail icon={Face6} color={'white'}>
                  {organizer?.userName}
                </Detail>
                <Detail icon={Phone} color={'white'}>
                  {`${isYourParticipationOrAnnounce ? '+33 ' + organizer?.phoneNumber : '+33 0* ** ** **'}`}
                </Detail>
              </div>
              <div style={{textAlign: 'center', marginBottom: '15px'}}>
                <ViewAverageRating userId={organizer?._id} starColor='white'/>
              </div>
              <Button size="small" variant="contained" color="primary" onClick={() => handleViewDetailsProfile(organizer?._id ?? '')}>
                Voir le profile
              </Button>
            </div>
          }
        >
          <IconButton>
            <Grid container spacing={2} style={{marginBottom: '20px'}}>
              <Grid item xs={12}>
                <Detail icon={Face6}>
                  Organisateur: {organizer?.userName}
                </Detail>
              </Grid>
            </Grid>
          </IconButton>
        </Tooltip>
      )}
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
    </>
  )
}

export default DetailAnnounce

import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Start from '@mui/icons-material/Start'
import { SvgIconProps } from '@mui/material/SvgIcon'
import ParticipationsService from '../../Services/Participations'
import PopulateParticipationData from '../../Types/PopulateParticipations.types'
import { sportsListMapping, SportsListMappingKey } from '../../Types/SportListImagePath'
import PaginationComponent from '../Tools/PaginationComponent'
import { useAppContext } from '../AppContextProps'
import DetailAnnounce from '../Details'

interface DetailProps {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}
const AnnouncesListsParticipant: React.FC = () => {
  const navigate = useNavigate()

  const [participation, setParticipation] = useState<PopulateParticipationData[]>([])

  const fetchparticipation = () => {
    // Récupérez les participations de l'utilisateur connecté
    ParticipationsService.getMyAllParticipations().then(response => {
      setParticipation(response.data)
    }).catch(error => {
      console.error(error)
    })
  }

  const { setIsYourParticipationOrAnnounce } = useAppContext()
  const handleViewDetails = (sportId: string) => {
    setIsYourParticipationOrAnnounce(true)
    navigate(`/annonce/details/${sportId}`)
  }

  const handleAnnuler = (participationID: string) => {
    ParticipationsService.deleteParticipation(participationID).then((result) => {
      alert('Participation a été bien supprimer!')
      fetchparticipation()
    }).catch((error) => {
      alert('Veuillez vous connectez à votre compte!')
      console.error(error)
    })
  }

  useEffect(() => {
    fetchparticipation()
  }, [])

  const theme = useTheme()
  const Detail: React.FC<DetailProps> = ({ icon: IconComponent, children }) => (
    <Box display="flex" alignItems="center" mt={1}>
      <IconComponent color="action" style={{ marginRight: theme.spacing(1), color: 'green' }} />
      <Typography variant="body2" color="text.secondary">
        {children}
      </Typography>
    </Box>
  )

  const [currentPage, setCurrentPage] = useState(1)
  const announcesPerPage = 6
  const indexOfLastAnnounce = currentPage * announcesPerPage
  const indexOfFirstAnnounce = indexOfLastAnnounce - announcesPerPage
  const currentParticipations = participation.slice(indexOfFirstAnnounce, indexOfLastAnnounce)

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage)
  }

  const PaginationProps = {
    currentPage,
    handlePageChange,
    totalPageCount: Math.ceil(participation.length / announcesPerPage)
  }

  return (
    <>
      <Grid container spacing={4} style={{ padding: theme.spacing(2), marginTop: 50 }}>
        {currentParticipations.map((participation, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3}>
              <CardActionArea onClick={() => handleViewDetails(participation.sport._id ? participation.sport._id : '')}>
                <CardMedia
                  component="img"
                  height="140"
                  src={require(`../Images/sports_images/${sportsListMapping[participation?.sport?.sport as SportsListMappingKey]}`)}
                  alt={`Photo du sport ${sportsListMapping[participation?.sport?.sport as SportsListMappingKey]}`}
                />
                <CardContent>
                  <DetailAnnounce sport={participation.sport}/>
                  <Detail icon={Start}>
                    Etat de la demande: {(() => {
                      switch (participation.etat) { // eslint-disable-next-line indent
                        // eslint-disable-next-line indent
                        case 'accepted': return 'Acceptée'
                        // eslint-disable-next-line indent
                        case 'refused': return 'Refusée'
                        // eslint-disable-next-line indent
                        case 'pending': return 'En attente'
                        // eslint-disable-next-line indent
                        case 'expired': return 'Expirée'
                        // eslint-disable-next-line indent
                        default: return participation.etat
                      }
                    })()}
                  </Detail>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Box width="100%">
                  { new Date(participation.sport.date).getTime() < new Date().getTime() ? (
                    <Button size="large" color="primary" variant="contained" fullWidth disabled>
                      Expiré
                    </Button>
                  ) : participation.etat === 'accepted' ? (
                    <Button size="large" color="primary" variant="contained" fullWidth disabled>
                      Accepté
                    </Button>
                  ) : participation.etat === 'refused' ? (
                    <Button size="large" color="primary" variant="contained" fullWidth disabled>
                      Refusé
                    </Button>
                  ) : (
                    <Button size="large" color="error" variant="contained" fullWidth onClick={() => handleAnnuler(participation._id ? participation._id : '')}>
                      Annuler
                    </Button>
                  )}

                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <PaginationComponent {...PaginationProps} />
    </>
  )
}

export default AnnouncesListsParticipant

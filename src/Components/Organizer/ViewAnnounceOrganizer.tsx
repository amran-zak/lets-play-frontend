import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardMedia, CardContent, Typography, CardActionArea, Grid, useTheme, Box, CardActions, Button } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { SvgIconProps } from '@mui/material/SvgIcon'
import AnnounceData from '../../Types/Announce.types'
import AnnounceSerive from '../../Services/Announce'
import DeleteModal from './DeleteModal'
import {sportsListMapping, SportsListMappingKey} from '../../Types/SportListImagePath'
import FilterComponent from '../Tools/FiltersSport'
import PaginationComponent from '../Tools/PaginationComponent'

interface DetailProps {
  icon: React.ElementType<SvgIconProps>
  children: React.ReactNode
}

const Detail: React.FC<DetailProps> = ({
  icon: IconComponent,
  children
}) => (
  <Box display="flex" alignItems="center" mt={1}>
    <IconComponent color="action" style={{
      marginRight: useTheme().spacing(1),
      color: 'green'
    }}/>
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  </Box>
)

export default function ViewAnnounceOrganizer() {
  const navigate = useNavigate()

  const [sportsList, setSportsList] = useState<AnnounceData[]>([])
  const [loading, setLoading] = useState(true)

  const handleEdit = (sportId: string) => {
    navigate(`/annonce/modifier/${sportId}`)
  }

  const handleViewDetails = (sportId: string) => {
    navigate(`/participations/${sportId}`)
  }

  useEffect(() => {
    AnnounceSerive.getAll()
      .then(response => {
        const data = response.data
        setSportsList(data.sports)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching sports:', error)
        setLoading(false)
      })
  }, [])

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [sportToDelete, setSportToDelete] = useState<AnnounceData | null>(null)

  const handleDelete = (sport: AnnounceData) => {
    setSportToDelete(sport)
    setDeleteModalOpen(true)
  }

  const handleCloseModal = () => {
    setDeleteModalOpen(false)
  }

  const [errorMessage, setErrorMessage] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<boolean>(false)
  const [disabledButton, setDisabledButton] = useState<boolean>(false)

  const deleteSport = () => {
    AnnounceSerive.delete(sportToDelete?._id)
      .then(response => {
        setSuccessMessage(true)
        setErrorMessage(false)
        setDisabledButton(true)
        setTimeout(() => {
          setDeleteModalOpen(false)
          AnnounceSerive.getAll()
            .then(response => {
              const data = response.data
              console.log('all : ', data)
              setSportsList(data.sports)
              setLoading(false)
            })
            .catch(error => {
              console.error('Error fetching sports:', error)
              setLoading(false)
            })
        }, 2000)
      })
      .catch(error => {
        console.error(error)
        setDisabledButton(false)
        setSuccessMessage(false)
        setErrorMessage(true)
      })
  }

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
  const currentAnnounces = sportsList.slice(indexOfFirstAnnounce, indexOfLastAnnounce)

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage)
  }

  const FilterProps = {
    sportsList,
    setSportsList,
    getAllSports: AnnounceSerive.getAll
  }

  const PaginationProps = {
    currentPage,
    handlePageChange,
    totalPageCount: Math.ceil(sportsList.length / announcesPerPage)
  }

  return (
    <>
      <Grid container spacing={4} style={{ padding: theme.spacing(2), marginTop: 100 }}>
        <FilterComponent {...FilterProps}/>
        {currentAnnounces.map((sport, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3}>
              <CardActionArea onClick={() => handleViewDetails(sport._id ? sport._id : '')}>
                <CardMedia
                  component="img"
                  height="140"
                  src={require(`../Images/sports_images/${sportsListMapping[sport?.sport as SportsListMappingKey]}`)}
                  alt={`Photo du sport ${sportsListMapping[sport?.sport as SportsListMappingKey]}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" style={{color: useTheme().palette.primary.main}}>
                    {sport.sport}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Detail icon={PeopleIcon}>Maximum: {sport.numberOfPeopleMax}</Detail>
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
                </CardContent>
              </CardActionArea>
              <CardActions style={{justifyContent: 'space-between'}}>
                <Button size="small" color="primary" variant="contained" onClick={() => handleEdit(sport._id ? sport._id : '')}>
                  Modifier
                </Button>
                <Button size="small" color="error" variant="contained" onClick={() => handleDelete(sport)}>
                  Supprimer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <DeleteModal
          open={deleteModalOpen}
          onClose={handleCloseModal}
          onDelete={() => {
            deleteSport()
          }}
          currentSport={sportToDelete}
          errorMessage={errorMessage}
          successMessage={successMessage}
          disabledButton={disabledButton}
        />
      </Grid>
      <PaginationComponent {...PaginationProps} />
    </>
  )
}

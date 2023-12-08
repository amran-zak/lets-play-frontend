// React
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Materials
import { Card, CardMedia, CardContent, Typography, CardActionArea, Grid, useTheme, Box, CardActions, Button } from '@mui/material'
// Files
import { useAppContext } from '../../AppContextProps'
import { sportsListMapping, SportsListMappingKey } from '../../../Types/SportListImagePath'
import AnnounceData from '../../../Types/Announce.types'
import AnnounceSerive from '../../../Services/Announce'
import DeleteModal from './DeleteModal'
import FilterComponent from '../../Tools/FiltersSport'
import PaginationComponent from '../../Tools/PaginationComponent'
import DetailAnnounce from '../../Tools/AnnounceDetails/Details'

export default function ViewAnnounceOrganizer() {
  const navigate = useNavigate()

  const [sportsList, setSportsList] = useState<AnnounceData[]>([])

  const handleEdit = (sportId: string) => {
    navigate(`/annonce/modifier/${sportId}`)
  }

  useEffect(() => {
    AnnounceSerive.getAll()
      .then(response => {
        setSportsList(response.data.sports)
      })
      .catch(error => {
        console.error('Error fetching sports:', error)
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
              setSportsList(response.data.sports)
            })
            .catch(error => {
              console.error('Error fetching sports:', error)
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

  const {isYourParticipationOrAnnounce} = useAppContext()

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
              <CardMedia
                component="img"
                height="140"
                src={require(`../../Images/sports_images/${sportsListMapping[sport?.sport as SportsListMappingKey]}`)}
                alt={`Photo du sport ${sportsListMapping[sport?.sport as SportsListMappingKey]}`}
              />
              <CardContent>
                <DetailAnnounce sport={sport} isYourParticipationOrAnnounce={isYourParticipationOrAnnounce}/>
              </CardContent>
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

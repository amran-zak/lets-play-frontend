import React from 'react'
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  useTheme
} from '@mui/material'
import { SvgIconProps } from '@mui/material/SvgIcon'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AnnounceData from '../../Types/Announce.types'

interface DeleteModalProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
  currentSport: AnnounceData | null
  errorMessage: boolean
  successMessage: boolean
  disabledButton: boolean
}

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

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose, onDelete, currentSport, errorMessage, successMessage, disabledButton }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Typography id="delete-modal-title" variant="h6" component="div">
          Confirmation de suppression
        </Typography>
        <Typography id="delete-modal-description" sx={{ mt: 5 }}>
          Êtes-vous sûr de vouloir supprimer cetle annonce ?
        </Typography>
        <Typography gutterBottom variant="h5" component="div" style={{color: useTheme().palette.primary.main}} sx={{ mt: 5 }}>
          {currentSport?.sport}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Detail icon={PeopleIcon}>Maximum: {currentSport?.numberOfPeopleMax}</Detail>
          </Grid>
          <Grid item xs={6}>
            <Detail icon={ChildFriendlyIcon}>Ages: {currentSport?.ageMin} - {currentSport?.ageMax}</Detail>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Detail icon={EventIcon}>Date: {currentSport?.date ? new Date(currentSport.date).toLocaleDateString() : ''}</Detail>
          </Grid>
          <Grid item xs={6}>
            <Detail icon={AttachMoneyIcon}>Prix: {currentSport?.price}€</Detail>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Detail icon={AccessTimeIcon}>Debut: {currentSport?.startTime ? new Date(currentSport.startTime).getUTCHours() : ''}h{currentSport?.startTime ? new Date(currentSport.startTime).getUTCMinutes() : ''}</Detail>
          </Grid>
          <Grid item xs={6}>
            <Detail icon={AccessTimeIcon}>Fin: {currentSport?.endTime ? new Date(currentSport.endTime).getUTCHours() : ''}h{currentSport?.endTime ? new Date(currentSport.endTime).getUTCMinutes() : ''}</Detail>
          </Grid>
        </Grid>
        <Detail icon={LocationOnIcon}>Adresse postal: {currentSport?.address}</Detail>
        <Detail icon={LocationOnIcon}>Ville: {currentSport?.city ? `${currentSport?.city}` : ''}</Detail>
        {errorMessage &&
          <Typography color='red' sx={{mt: 5}}>
            L&apos;annonce ne peut être supprimée
          </Typography>
        }
        {successMessage &&
          <Typography color='secondary.main' sx={{mt: 5}}>
            L&apos;annonce est supprimée avec succès
          </Typography>
        }
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="secondary" onClick={onClose} disabled={disabledButton}>
            Annuler
          </Button>
          <Button variant="contained" color="error" onClick={onDelete} disabled={disabledButton}>
            Supprimer
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DeleteModal

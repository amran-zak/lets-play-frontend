import React from 'react'
import {
  Modal,
  Box,
  Typography,
  Button
} from '@mui/material'

interface DeleteModalProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose, onDelete }) => {
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
          border: '2px solid #000',
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
        <Typography id="delete-modal-description" sx={{ mt: 2 }}>
          Êtes-vous sûr de vouloir supprimer cet élément ?
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={onDelete}>
            Supprimer
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DeleteModal

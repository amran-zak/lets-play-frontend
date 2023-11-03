import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {useNavigate} from 'react-router-dom'
import {ListSharp} from '@mui/icons-material'

export default function AnnouncesHeader() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const navigateToPage = (url: string) => {
    navigate(url, { state: { token } })
  }

  const handleClose = (url: string) => {
    setAnchorEl(null)
    navigateToPage(url)
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{color: 'black'}}
      >
        <ListSharp /> Annonces
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={() => handleClose('/annonce/ajouter')}>Ajouter</MenuItem>
        <MenuItem onClick={() => handleClose('/annonces/liste')}>Voir mes annonces</MenuItem>
      </Menu>
    </div>
  )
}

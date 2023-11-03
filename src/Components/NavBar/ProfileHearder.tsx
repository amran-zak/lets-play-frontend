import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AccountCircle from '@mui/icons-material/AccountCircle'
import {useNavigate} from 'react-router-dom'

export default function ProfileHearder() {
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
        <AccountCircle />
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
        <MenuItem onClick={() => handleClose('/')}>Mon compte</MenuItem>
        <MenuItem onClick={() => handleClose('/')}>Déconnexion</MenuItem>
        <MenuItem onClick={() => handleClose('/connexion')}>Connexion</MenuItem>
        <MenuItem onClick={() => handleClose('/inscription')}>Inscription</MenuItem>
      </Menu>
    </div>
  )
}

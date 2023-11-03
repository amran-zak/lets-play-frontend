import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useNavigate } from 'react-router-dom'

export default function ProfileHeader() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const navigateToPage = (url: string) => {
    setAnchorEl(null) // Fermer le menu
    navigate(url, { state: { token } })
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ color: 'black' }}
      >
        <AccountCircle />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)} // Fermer le menu en cliquant en dehors
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {token ? (
          <>
            <MenuItem onClick={() => navigateToPage('/')}>Mon compte</MenuItem>
            <MenuItem onClick={() => navigateToPage('/')}>Déconnexion</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => navigateToPage('/connexion')}>Connexion</MenuItem>
            <MenuItem onClick={() => navigateToPage('/inscription')}>Inscription</MenuItem>
          </>
        )}
      </Menu>
    </div>
  )
}

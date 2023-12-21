// React
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
// Materials
import { Button, Menu, MenuItem } from '@mui/material'
// Icons
import AccountCircle from '@mui/icons-material/AccountCircle'

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
  const logout = () => {
    // Supprime le token du localStorage
    localStorage.removeItem('token')
    // Actualiser la page pour appliquer les changements d'état de connexion
    window.location.reload()
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
        {token ? ([
          <MenuItem key="mon-compte" onClick={() => navigateToPage('/profile')}>Mon compte</MenuItem>,
          <MenuItem key="deconnexion" onClick={logout}>Déconnexion</MenuItem>
        ]) : ([
          <MenuItem key="connexion" onClick={() => navigateToPage('/connexion')}>Connexion</MenuItem>,
          <MenuItem key="inscription" onClick={() => navigateToPage('/inscription')}>Inscription</MenuItem>
        ])}
      </Menu>
    </div>
  )
}

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
        style={{color: 'black'}}
      >
        <ListSharp />
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
        {[
          <MenuItem key="ajouter-annonce" onClick={() => navigateToPage('/annonce/ajouter')}>Ajouter une annonce</MenuItem>,
          <MenuItem key="-voir-annonces" onClick={() => navigateToPage('/annonces/liste')}>Voir mes annonces</MenuItem>,
          <MenuItem key="-voir-annonces" onClick={() => navigateToPage('/annonces/partcipations')}>Voir mes partcipations</MenuItem>
        ]}
      </Menu>
    </div>
  )
}

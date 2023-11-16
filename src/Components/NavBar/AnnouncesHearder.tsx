import * as React from 'react'
import {
  Button,
  Tooltip
} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {AddSharp, HowToReg, ListSharp, SportsBaseball, SportsTennis} from '@mui/icons-material'

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
      {token ? ([
        // eslint-disable-next-line react/jsx-key
        <div>
          <Tooltip title="Liste des annonces" arrow>
            <Button
              id="basic-button"
              onClick={() => navigateToPage('/liste/annonces')}
              style={{ color: 'black' }}
            >
              <SportsBaseball />
              <SportsTennis />
            </Button>
          </Tooltip>
          <Tooltip title="Liste de mes inscriptions" arrow>
            <Button
              id="basic-button"
              onClick={() => navigateToPage('/annonces/participations')}
              style={{color: 'black'}}
            >
              <HowToReg />
            </Button>
          </Tooltip>
          <Tooltip title="Liste de mes annonces" arrow>
            <Button
              id="basic-button"
              onClick={() => navigateToPage('/annonces/liste')}
              style={{color: 'black'}}
            >
              <ListSharp />
            </Button>
          </Tooltip>
          <Tooltip title="Ajouter une annonces" arrow>
            <Button
              id="basic-button"
              onClick={() => navigateToPage('/annonce/ajouter')}
              style={{color: 'black'}}
            >
              <AddSharp />
            </Button>
          </Tooltip>
        </div>
      ]) : ([])}
    </div>
  )
}

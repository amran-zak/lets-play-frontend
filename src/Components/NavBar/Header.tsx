import React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  Tooltip,
  Typography,
  Button
} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import LogoGreen from '../Images/logo-green.png'
import PopUp from '../Tools/PopUp'
import ProfileHeader from './ProfileHeader'
import AnnouncesHeader from './AnnouncesHearder'
import { Home } from '@mui/icons-material'

function Header() {
  const navigate = useNavigate()

  const navigateToPage = (url: string) => {
    navigate(url)
  }
  return (
    <Box>
      <AppBar component="nav" sx={{backgroundColor: 'bg-green-light'}}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              display: {
                xs: 'none',
                md: 'flex'
              },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            <img src={LogoGreen} style={{height: '50px'}} alt="photo de profile"/>
          </Typography>
          <Box sx={{flexGrow: 1}}/>
          <Tooltip title="Accueil" arrow>
            <Button
              id="basic-button"
              onClick={() => navigateToPage('/')}
              style={{ color: 'black' }}
            >
              <Home />
            </Button>
          </Tooltip>
          <AnnouncesHeader />
          {/* <Box sx={{
            display: {
              xs: 'none',
              md: 'flex'
            }
          }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon/>
              </Badge>
            </IconButton>
          </Box> */}
          <ProfileHeader />
          <PopUp />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
export default Header

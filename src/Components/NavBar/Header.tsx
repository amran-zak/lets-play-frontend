import React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Link
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoGreen from '../Images/logo-green.png'
import PopUp from '../PopUp'
import ProfileHeader from './ProfileHeader'
import AnnouncesHeader from './AnnouncesHearder'

function Header() {
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

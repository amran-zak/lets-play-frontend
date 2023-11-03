import React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoGreen from '../Images/logo-green.png'
import PopUp from '../PopUp'
import ProfileHearder from './ProfileHearder'
import AnnouncesHeader from './AnnouncesHearder'

export default function Header() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const navigateToPage = (url: string) => {
    navigate(url, { state: { token } })
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
          <AnnouncesHeader />
          <Box sx={{
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
          </Box>
          <ProfileHearder />
          <PopUp />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

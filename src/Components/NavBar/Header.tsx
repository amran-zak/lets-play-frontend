import React from 'react'
import {
  AppBar,
  Box,
  Link,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import LogoGreen from '../Images/logo-green.png'
import {ListSharp} from '@mui/icons-material'
import PopUp from '../PopUp'

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link href="/connexion" underline="none">
          Connexion
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link href="/inscription" underline="none">
          Inscription
        </Link>
      </MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon/>
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon/>
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle/>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

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
          <Box sx={{
            display: {
              xs: 'none',
              md: 'flex',
              // background: 'white',
              color: 'white',
              borderRadius: '25px'
            }
          }}>
            <Link underline="none" onClick={() => navigateToPage('/mes_annonces')}>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                // color="inherit"
              >
                {/* <ListSharp/> */}
                <Typography>
                  Mes Annonces
                </Typography>
              </IconButton>
            </Link>
            <Link underline="none" onClick={() => navigateToPage('/nouvelle_annonce')}>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                // color="inherit"
              >
                {/* <ListSharp/> */}
                <Typography>
                  Ajouter une annonce
                </Typography>
              </IconButton>
            </Link>
          </Box>
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
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{
            display: {
              xs: 'flex',
              md: 'none'
            }
          }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon/>
            </IconButton>
          </Box>
          <PopUp />
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}

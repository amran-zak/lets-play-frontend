// React
import * as React from 'react'
// Materials
import { Popover, Typography } from '@mui/material'

function MouseOverPopover() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [controlPressed, setControlPressed] = React.useState(false)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (controlPressed) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleControlKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Control') {
      setControlPressed(true)
    }
  }

  const handleControlKeyRelease = (event: KeyboardEvent) => {
    if (event.key === 'Control') {
      setControlPressed(false)
      setAnchorEl(null)
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleControlKeyPress)
    window.addEventListener('keyup', handleControlKeyRelease)

    return () => {
      window.removeEventListener('keydown', handleControlKeyPress)
      window.removeEventListener('keyup', handleControlKeyRelease)
    }
  }, [])

  const open = Boolean(anchorEl)

  return (
    <div style={{width: '30px', position: 'absolute', padding: 0, margin: 0, right: 0, top: 0}}>
      {controlPressed &&
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          color='primary.main'
        >
          ...
        </Typography>
      }
      {controlPressed &&
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
            border: 0
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <iframe
            src="https://giphy.com/embed/pt0EKLDJmVvlS"
            style={{ height: '50vh', border: 0 }}
          />
        </Popover>
      }
    </div>
  )
}

export default MouseOverPopover

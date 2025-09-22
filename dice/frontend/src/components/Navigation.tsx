import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { BORDER_RADIUS, FONT_SIZES } from '../styles/styleConsts'
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { GiHamburgerMenu } from 'react-icons/gi'

const AVAILABLE_TITLES = [
  'Dapper Dice',
  'Dangerous Dice',
  'Dashing Dice',
  'Dizzying Dice',
  'Dazzling Dice',
  'Doom Dice',
  'Dreary Dice',
  'Demonic Dice',
  'Delightful Dice',
  'Dastardly Dice',
  'Deceitful Dice',
  'Diligent Dice',
  'Downfall Dice'
]

const ROUTES = [
  { key: 'home', label: 'Home', href: '/', target: '_self' },
  {
    key: 'github',
    label: 'GitHub',
    href: 'https://github.com/TravisBumgarner/pointless-projects/tree/main/dice',
    target: '_blank'
  },
  {
    key: 'more_projects',
    label: 'More Projects',
    href: 'https://travisbumgarner.com/',
    target: '_blank'
  }
]

const DropdownLinks = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      {ROUTES.map(route => (
        <Link
          key={route.key}
          to={route.href}
          style={{ textDecoration: 'none', color: 'inherit' }}
          target={route.target}
        >
          <MenuItem onClick={onClose}>{route.label}</MenuItem>
        </Link>
      ))}
    </>
  )
}

const Navigation = () => {
  const [title, setTitle] = useState('Dapper Dice')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_TITLES.length)
    const randomTitle = AVAILABLE_TITLES[randomIndex]
    document.title = randomTitle
    setTitle(randomTitle)
  }, [])

  return (
    <Box
      sx={{
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography variant="h1">
          {title}
          <sup
            style={{
              fontSize: FONT_SIZES.SMALL.PX,
              position: 'relative',
              top: '-5px'
            }}
          >
            Alpha
          </sup>
        </Typography>
      </Link>
      <Tooltip title="Menu">
        <IconButton
          aria-label="menu"
          aria-controls={open ? 'navigation-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <GiHamburgerMenu />
        </IconButton>
      </Tooltip>
      <Menu
        slotProps={{ paper: { sx: { borderRadius: BORDER_RADIUS.ZERO.PX } } }}
        id="navigation-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <DropdownLinks onClose={handleClose} />
      </Menu>
    </Box>
  )
}

export default Navigation

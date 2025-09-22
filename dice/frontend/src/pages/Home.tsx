import { useNavigate } from 'react-router'
import generateRoomName from '../utils/generateRoomName'
import socket from '../services/socket'
import { useCallback, useState } from 'react'
import { Box, Button, TextField, Typography, type SxProps } from '@mui/material'
import { SPACING } from '../styles/styleConsts'

export default function App() {
  const navigate = useNavigate()
  const [inputRoomName, setInputRoomName] = useState('')

  const handleCreateRoom = useCallback(() => {
    const roomName = generateRoomName()
    socket.emit('create_room', { room: roomName })
    navigate(`/room/${roomName}`)
  }, [navigate])

  const handleJoinRoom = useCallback(() => {
    navigate(`/room/${inputRoomName}`)
  }, [inputRoomName, navigate])

  return (
    <Box sx={wrapperSX}>
      <Box sx={boxSX}>
        <Typography variant="h2">Solo Quest</Typography>
        <Button fullWidth variant="contained" onClick={() => navigate('/solo')}>
          Start rolling
        </Button>
      </Box>
      <Box sx={boxSX}>
        <Typography variant="h2"> (Coming soon!) Adventure with Friends</Typography>

        <Button variant="contained" fullWidth disabled onClick={handleCreateRoom}>
          Create Room
        </Button>
        <p style={{ margin: 0 }}>Or</p>
        <Box
          sx={{
            marginTop: SPACING.TINY.PX,
            display: 'flex',
            gap: SPACING.TINY.PX,
            width: '100%'
          }}
        >
          <TextField
            disabled
            size="small"
            type="text"
            fullWidth
            placeholder="Enter room name"
            value={inputRoomName}
            onChange={e => setInputRoomName(e.target.value)}
          />
          <Button variant="contained" disabled={inputRoomName.length === 0} onClick={handleJoinRoom}>
            Join
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

const wrapperSX: SxProps = {
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const boxSX: SxProps = {
  width: '300px',
  maxWidth: '90%',
  textAlign: 'center',
  border: '1px solid white',
  padding: '1rem',
  marginTop: '1rem',
  gap: SPACING.SMALL.PX,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

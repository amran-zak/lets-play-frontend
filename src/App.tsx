import React from 'react'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import './App.css'
import AppRouter from './Rooting/AppRouter'

const theme = createTheme({
  palette: {
    primary: {
      main: '#73B227'
    },
    secondary: {
      main: '#399C62'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppRouter/>
      </div>
    </ThemeProvider>
  )
}

export default App

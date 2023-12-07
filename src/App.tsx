import React from 'react'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import './App.css'
import AppRouter from './Rooting/AppRouter'
import { AppProvider } from './Components/AppContextProps'

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
      <AppProvider>
        <div className="App">
          <AppRouter/>
        </div>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App

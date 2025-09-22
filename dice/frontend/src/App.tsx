import { BrowserRouter } from 'react-router'
import Router from './components/Router'

import AppThemeProvider from './styles/Theme'
import Navigation from './components/Navigation'
import './styles/global.css'

const App = () => {
  return (
    <AppThemeProvider>
      <BrowserRouter>
        <Navigation />
        <Router />
      </BrowserRouter>
    </AppThemeProvider>
  )
}

export default App

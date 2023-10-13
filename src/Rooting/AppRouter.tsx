import * as React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from '../Components/NavBar/Header'
import NewPassword from '../Components/Authentification/NewPassword'

export default function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="app-body">
          <Header/>
          <Routes>
            <Route path="/nouveau_mot_de_passe" element={<NewPassword/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

import * as React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import NewPassword from '../Components/Authentification/NewPassword'
import SignUp from '../Components/Authentification/SignUp'
import Login from '../Components/Authentification/Login'
import Header from '../Components/NavBar/Header'
import CreateAnnounce from '../Components/Organizer/CreateAnnounce'
import ViewAnnounceOrganizer from '../Components/Organizer/ViewAnnounceOrganizer'

export default function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <div className='app-body'>
          <Header/>
          <Routes>
            <Route path='/connexion' element={<Login/>}/>
            <Route path='/nouveau_mot_de_passe' element={<NewPassword/>}/>
            <Route path='/inscription' element={<SignUp/>}/>
            <Route path='/nouvelle_annonce' element={<CreateAnnounce/>}/>
            <Route path='/mes_annonces' element={<ViewAnnounceOrganizer/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

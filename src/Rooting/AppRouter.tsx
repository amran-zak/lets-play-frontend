// React
import * as React from 'react'
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom'
// Files
import NewPassword from '../Components/Users/Authentification/NewPassword'
import SignUp from '../Components/Users/Authentification/SignUp'
import Login from '../Components/Users/Authentification/Login'
import Header from '../Components/NavBar/Header'
import CreateAnnounce from '../Components/Users/Organizer/CreateAnnounce'
import ProfileEdit from '../Components/Users/Authentification/Profile'
import ModifyAnnounce from '../Components/Users/Organizer/ModifyAnnounce'
import ViewAnnounceOrganizer from '../Components/Users/Organizer/ViewAnnounceOrganizer'
import HomePage from '../Components/Home'
import AnnouncesLists from '../Components/Home/AnnouncesLists'
import AnnouncesListsParticipant from '../Components/Users/Participant/AnnounceListParticipant'
import ViewDetailAnnounce from '../Components/Tools/AnnounceDetails/ViewDetailAnnounce'

// Composant pour la protection de route
const PrivateRoute = () => {
  const auth = localStorage.getItem('token') // Obtenez le token de localStorage
  return auth ? <Outlet /> : <Navigate to="/connexion" state={{ from: location.pathname }} replace />
}
export default function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <div className='app-body'>
          <Header/>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/liste/annonces' element={<AnnouncesLists/>}/>
            <Route path='/connexion' element={<Login/>}/>
            <Route path='/nouveau_mot_de_passe' element={<NewPassword/>}/>
            <Route path='/inscription' element={<SignUp/>}/>

            <Route element={<PrivateRoute />}>
              <Route path='/annonce/ajouter' element={<CreateAnnounce/>}/>
              <Route path='/annonces/liste' element={<ViewAnnounceOrganizer/>}/>
              <Route path='/annonce/modifier/:id' element={<ModifyAnnounce/>}/>
              <Route path='/profile' element={<ProfileEdit/>}/>
              <Route path='/annonces/participations' element={<AnnouncesListsParticipant/>}/>
              <Route path='/annonce/details/:sportId' element={<ViewDetailAnnounce/>}/>
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

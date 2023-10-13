import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../Components/NavBar/Header";
import Login from "../Components/Authentification/Login";


export default function AppRouter(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="app-body">
          <Header />
          <Routes>
          {/*  <Route path="/" element={<Home/>} />*/}
          {/*  <Route path="/details" element={<Details />} />*/}
            <Route path="/connexion" element={<Login/>} />
          {/*  <Route path="/inscription" element={<SignUp/>} />*/}
          {/*  <Route path="/nouveau_mot_de_passe" element={<New_password/>} />*/}
          {/*  <Route path="/profile" element={<UserProfile/>} />*/}
          {/*  <Route path="/airbnb" element={<AirBNB/>} />*/}
          {/*  <Route path="/ajouter_annonce" element={<Add_Annonces/>} />*/}
          {/*  /!*<Route path='/forbiddenAccess' element={<LoginPage/>} />*!/*/}
          {/*  <Route path="/*" element={<NotFoundPage />} />*/}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

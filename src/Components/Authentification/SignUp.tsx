import * as React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthentificationService from "../../Services/Authentification";
import UserData from "../../Types/User.types";

export default function SignUp() {
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Le nom est requis"),
    lastName: Yup.string().required("Le prénom est requis"),
    email: Yup.string().required("L'adresse email est requise").email("L'adresse email n'est pas valide"),
    password: Yup.string().required("Le mot de passe est requis").min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
      .required("La confirmation du mot de passe est requise"),
    // Autres champs de formulaire ici
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data: UserData) => {
    AuthentificationService.signUp(data)
      .then((response: any) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          // Vous pouvez gérer la redirection ou l'affichage d'un message de succès ici
        }
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };

  return (
    <Container component="main" maxWidth="md" sx={{ marginBottom: 5 }}>
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Inscription
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ marginTop: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="userName"
                required
                fullWidth
                id="userName"
                label="Nom de famille"
                autoFocus
                {...register("userName")}
                error={!!errors.userName}
                helperText={errors.userName?.message}
              />
            </Grid>
          
         
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Adresse Email"
                name="email"
                autoComplete="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="passwordConfirmation"
                label="Confirmez votre mot de passe"
                type="password"
                id="passwordConfirmation"
                autoComplete="new-password"
                {...register("passwordConfirmation")}
                error={!!errors.passwordConfirmation}
                helperText={errors.passwordConfirmation?.message}
              />
            </Grid>
            {/* Ajoutez d'autres champs du formulaire ici */}
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 3, marginBottom: 2 }}>
            Inscription
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/connexion" variant="body2">
                Vous avez déjà un compte ? Connectez-vous !
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

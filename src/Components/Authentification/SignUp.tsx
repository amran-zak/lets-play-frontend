import * as React from 'react';
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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthentificationService from '../../services/Authentification';
import UserData from '../../Types/User.types';

export default function SignUp() {
  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Le nom est requis'),
    email: Yup.string().required('L\'adresse email est requise').email('L\'adresse email n\'est pas valide'),
    password: Yup.string().required('Le mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
      .required('La confirmation du mot de passe est requise'),
    phoneNumber: Yup.number(),
    city: Yup.string().required('La ville est requise'),
    yearBirth: Yup.number().required('L\année de naissance est requise')
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all'
  });


  const onSubmit = (data: UserData) => {
    console.log("bb", data);
    AuthentificationService.signUp(data)
      .then((response: any) => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          console.log(response)
          // Vous pouvez gérer la redirection ou l'affichage d'un message de succès ici
        }
      })
      .catch((error: Error) => {
        console.error(error);
      });
  };

  return (
    <Container component='main' maxWidth='md' sx={{ marginBottom: 5 }}>
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Box   sx={{ marginTop: 3 }}> */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete='given-name'
                  required
                  fullWidth
                  id='userName'
                  label='Nom'
                  autoFocus
                  {...register('userName')}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                />
              </Grid>


              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Adresse Email'
                  autoComplete='email'
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Ville'
                  id='city'
                  autoComplete='city'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Téléphone'
                  id='phoneNumber'
                  autoComplete='phoneNumber'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Année de naissance'
                  id='yearBirth'
                  autoComplete='yearBirth'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label='Mot de passe'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label='Confirmez votre mot de passe'
                  type='password'
                  id='passwordConfirmation'
                  autoComplete='new-password'
                  {...register('passwordConfirmation')}
                  error={!!errors.passwordConfirmation}
                  helperText={errors.passwordConfirmation?.message}
                />
              </Grid>
            </Grid>
            <Button type='submit' fullWidth variant='contained' sx={{ marginTop: 3, marginBottom: 2 }}>
              Inscription
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link href='/connexion' variant='body2'>
                  Vous avez déjà un compte ? Connectez-vous !
                </Link>
              </Grid>
            </Grid>
          {/* </Box> */}
        </form>

      </Box>
    </Container>
  );
}

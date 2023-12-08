// React
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
// Yup
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// Materials
import { Avatar, Button, CssBaseline, TextField, Link, Paper, Box, Grid, Typography, FormControl, InputLabel, IconButton, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material'
// Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
// Images
import background from '../../Images/image.jpeg'
// Files
import LoginData from '../../../Types/Login.types'
import Authentification from '../../../Services/Authentification'

export default function Login(): JSX.Element {
  const [errorMessage, setErrorMessage] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  // Si l'utilisateur a été redirigé vers la connexion, location.state contiendra la page d'où il vient
  const from = location.state?.from || '/'

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('L\'adresse email est requise').email('L\'adresse email n\'est pas valide'),
    password: Yup.string().required('Le mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères')
  })

  const { register, handleSubmit, formState: {errors} } = useForm<LoginData>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all'
  })

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const [showPassword, setShowPassword] = React.useState(false)
  const [message, setMessage] = React.useState(null)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await Authentification.signIn(data)
      if (response.data.token || response.data.message) {
        console.log('Connecté')
        // Stocker le token dans le localStorage
        localStorage.setItem('token', response.data.token)
        setErrorMessage(false)
        await new Promise(resolve => setTimeout(resolve, 0))
        navigate(from, { replace: true })
        window.location.reload()
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(true)
    }
  }

  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setIsDisabled(false)
  }

  return (
    <Grid
      container
      component='main'
      sx={{
        overflowY: 'scroll',
        height: '100vh'
      }}
    >
      <CssBaseline/>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{
        my: 'auto',
        boxShadow: 'none'
      }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{
            m: 1,
            bgcolor: 'secondary.main'
          }}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component='h1' variant='h5' sx={{ marginBottom: 5}}>
            Connexion
          </Typography>
          <form style={{width: '100%'}} onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Adresse Email'
              autoComplete='email'
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <FormControl fullWidth variant='outlined' margin='normal' required>
              <InputLabel
                error={!!errors.password}
                htmlFor='outlined-adornment-password'
              >
                Mot de passe
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-password'
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={!!errors.password}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {showPassword ? (
                        <VisibilityOff
                          style={{backgroundColor: 'transparent !important'}}
                        />
                      ) : (
                        <Visibility
                          style={{backgroundColor: 'transparent !important'}}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label='Password'
              />
              <FormHelperText
                error={!!errors.password}
                id='component-error-text'
              >
                {errors.password?.message}
              </FormHelperText>
            </FormControl>
            {errorMessage &&
              <Typography style={{color: 'red'}}>
                Une erreur est survenue veuillez vérifier vos informations
              </Typography>
            }
            {message &&
              <Typography style={{color: 'green'}}>
                {message}
              </Typography>
            }
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{
                mt: 3,
                mb: 2
              }}
              disabled={isDisabled}
            >
              Connexion
            </Button>
            <Grid container sx={{mt: 2}}>
              <Grid item>
                <Link href='/nouveau_mot_de_passe' variant='body2'>
                  Vous avez oublié votre mot de passe ?
                </Link>
              </Grid>
            </Grid>
            <Grid container sx={{mt: 2}}>
              <Grid item>
                <Link href='/inscription' variant='body2'>
                  {'Vous n\'avez pas de compte ? Inscrivez-vous !'}
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  )
}

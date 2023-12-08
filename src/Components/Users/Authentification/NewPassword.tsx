// React
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
// Yup
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// Materials
import { Typography, Grid, Box, Paper, TextField, CssBaseline, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Avatar } from '@mui/material'
// Icons
import { Visibility, VisibilityOff } from '@mui/icons-material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// Images
import background from '../../Images/badminton.jpeg'
// Files
import Authentification from '../../../Services/Authentification'
import NewpasswordData from '../../../Types/NewPassword.types'

interface Newpassword {
  email: string
  newPassword: string
  passwordConfirmation: string
}

export default function NewPassword(): JSX.Element {
  const [user, setUser] = React.useState(undefined)

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('L\'adresse email est requise').email('L\'adresse email n\'est pas valide'),
    newPassword: Yup.string().required('Le mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('newPassword')], 'Les mots de passe ne correspondent pas').required('La confirmation du mot de passe est requise')
  })

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<Newpassword>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all'
  })
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const [showPassword, setShowPassword] = React.useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = React.useState(false)

  const handleClickShowPassword = (passwordField: string) => {
    if (passwordField === 'newPassword') {
      setShowPassword(!showPassword)
    } else if (passwordField === 'passwordConfirmation') {
      setShowPasswordConfirmation(!showPasswordConfirmation)
    }
  }

  const navigate = useNavigate()

  const onSubmit = (data: Newpassword) => {
    const loginData: NewpasswordData = {
      email: data.email,
      newPassword: data.newPassword
    }
    Authentification.newPassword(loginData)
      .then((response: any) => {
        console.log('Mot de passe rénitialisé')
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          setUser(response.data.User)
          setTimeout(() => {
            navigate('/connexion')
          }, 2000)
        }
      })
      .catch((error: Error) => {
        console.error(error)
      })
  }

  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setIsDisabled(false)
  }

  return (
    <Grid container component="main" sx={{height: '100vh'}}>
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
          <Typography component="h1" variant="h5" sx={{ marginBottom: 5}}>
            Nouveau mot de passe
          </Typography>
          <form style={{width: '100%'}} onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Votre adresse email"
              type="email"
              id="email"
              {...register('email')}
              autoComplete="email"
            />
            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel
                error={errors.newPassword !== null && errors.newPassword !== undefined}
                htmlFor="outlined-adornment-password"
              >
                Mot de passe
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'} // Utilisez 'newPassword' ici
                {...register('newPassword')}
                error={errors.newPassword !== null && errors.newPassword !== undefined}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword('newPassword')}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword
                        ? (
                          <VisibilityOff
                            style={{
                              backgroundColor: 'transparent !important'
                            }}
                          />
                        )
                        : (
                          <Visibility
                            style={{
                              backgroundColor: 'transparent !important'
                            }}
                          />
                        )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText
                error={errors.newPassword !== null && errors.newPassword !== undefined}
                id="component-error-text"
              >
                {errors.newPassword?.message}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel
                error={errors.passwordConfirmation !== null && errors.passwordConfirmation !== undefined}
                htmlFor="outlined-adornment-password2"
              >
                Confirmer votre mot de passe
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password2"
                type={showPasswordConfirmation ? 'text' : 'password'}
                {...register('passwordConfirmation')}
                error={errors.passwordConfirmation !== null && errors.passwordConfirmation !== undefined}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword('passwordConfirmation')}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPasswordConfirmation
                        ? (
                          <VisibilityOff
                            style={{
                              backgroundColor: 'transparent !important'
                            }}
                          />
                        )
                        : (
                          <Visibility
                            style={{
                              backgroundColor: 'transparent !important'
                            }}
                          />
                        )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText
                error={errors.passwordConfirmation !== null && errors.passwordConfirmation !== undefined}
                id="component-error-text"
              >
                {errors.passwordConfirmation?.message}
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              sx={{
                mt: 3,
                mb: 2
              }}
            >
              Valider
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  )
}

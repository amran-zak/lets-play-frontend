import * as React from 'react'
import {FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import background from '../Images/badminton.jpeg'
import Authentification from '../../Services/Authentification'
import NewpasswordData from '../../Types/NewPassword.types'
import LoginData from '../../Types/Login.types'

interface Newpassword {
  email: string
  newPassword: string
  newPassword2: string
}

export default function NewPassword(): JSX.Element {
  const [user, setUser] = React.useState(undefined)

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email est requis')
      .email("Email n'est pas valide"),
    newPassword: Yup.string().required('Mot de passe requis'),
    newPassword2: Yup.string().required('Mot de passe requis')
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
  const [showPassword2, setShowPassword2] = React.useState(false)

  console.log('Le composant NewPassword est rendu.')
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show)
    setShowPassword2((show) => !show)
  }

  const onSubmit = (data: Newpassword) => {
    const loginData: NewpasswordData = {
      email: data.email,
      newPassword: data.newPassword
    }
    Authentification.newPassword(loginData)
      .then((response: any) => {
        console.log(loginData)
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          setUser(response.data.User)
        }
      })
      .catch((error: Error) => {
        console.log('error')
        console.error(error)
      })
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
          <Typography component="h1" variant="h5">
            Nouveau mot de passe
          </Typography>
          <form style={{width: '100%'}} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Votre adresse email"
              type="email"
              id="email"
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
                type={showPassword ? 'text' : 'newPassword'}
                {...register('newPassword')}
                error={errors.newPassword !== null && errors.newPassword !== undefined}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
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
                error={errors.newPassword2 !== null && errors.newPassword2 !== undefined}
                htmlFor="outlined-adornment-password2"
              >
                Retaper votre mot de passe
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password2"
                type={showPassword ? 'text' : 'password2'}
                {...register('newPassword2')}
                error={errors.newPassword2 !== null && errors.newPassword2 !== undefined}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword2
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
                error={errors.newPassword2 !== null && errors.newPassword2 !== undefined}
                id="component-error-text"
              >
                {errors.newPassword2?.message}
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
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

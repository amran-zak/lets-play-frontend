import * as React from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, Paper, debounce
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {useForm} from 'react-hook-form'
import * as Yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import UserData from '../../Types/User.types'
import Authentification from '../../Services/Authentification'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import background from '../Images/chaussure.jpeg'
import {useCallback, useState} from 'react'

interface User {
  phoneNumber: number
  userName: string
  email: string
  password: string
  passwordConfirmation: string
  city: string
  yearBirth: number
}

export default function SignUp() {
  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Le nom est requis'),
    email: Yup.string().required('L\'adresse email est requise').email('L\'adresse email n\'est pas valide'),
    password: Yup.string().required('Le mot de passe est requis').min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
      .required('La confirmation du mot de passe est requise'),
    phoneNumber: Yup.number()
      .typeError('Le téléphone doit être un nombre')
      .required('Le téléphone est requis')
      .test('isTenDigits', 'Le téléphone doit contenir exactement 10 chiffres', (value) => {
        if (!value) {
          return false // Champ vide
        }
        const phoneNumberString = value.toString()
        return phoneNumberString.length === 10 && /^\d+$/.test(phoneNumberString)
      }),
    city: Yup.string().required('La ville est requise'),
    yearBirth: Yup.number()
      .typeError('L\'année doit être un nombre')
      .required('L\'année de naissance est requise')
  })

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<User>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all'
  })

  const [citySuggestions, setCitySuggestions] = useState([])
  const fetchCitySuggestions = async (input: string) => {
    console.log(input)
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${input.replaceAll(' ', '+')}&limit=15`)
      console.log(response)
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        if (data.features) {
          const citySuggestions = data.features.map((feature: { properties: { id: React.Key | null | undefined
            label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined } }) => (
            <div key={feature.properties.id}>{feature.properties.label}</div>
          ))
          setCitySuggestions(citySuggestions)
          console.log(citySuggestions)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [cityInput, setCityInput] = useState('')
  const debouncedFetchCitySuggestions = useCallback(
    debounce(async (input) => fetchCitySuggestions(input), 300), []
  )

  const handleCityInputChange = async (e: { target: { value: any } }) => {
    const inputValue = e.target.value
    setCityInput(inputValue)
    await debouncedFetchCitySuggestions(inputValue)
  }

  const handleCitySuggestionClick = (suggestion: string) => {
    try {
      const suggestionObject = JSON.parse(suggestion)
      const suggestionText = suggestionObject.props.children
      setCityInput(suggestionText)
    } catch (error) {
      console.error("Erreur d'analyse JSON : ", error)
    }
    setCitySuggestions([])
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }
  const [showPassword, setShowPassword] = React.useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = React.useState(false)

  const handleClickShowPassword = (passwordField: string) => {
    if (passwordField === 'password') {
      setShowPassword(!showPassword)
    } else if (passwordField === 'passwordConfirmation') {
      setShowPasswordConfirmation(!showPasswordConfirmation)
    }
  }

  const onSubmit = (data: User) => {
    const signUpData: UserData = {
      userName: data.userName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      city: data.city,
      yearBirth: data.yearBirth
    }
    Authentification.signUp(signUpData)
      .then((response: any) => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          console.log(response)
        }
      })
      .catch((error: Error) => {
        console.error(error)
      })
  }

  return (
    <Container component="main"
      sx={{
        minWidth: '100%',
        background: `url(${background})`,
        backgroundSize: 'cover',
        minHeight: '100vh'
      }}
    >
      <CssBaseline />
      <Box maxWidth="md" component={Paper}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          p: 5,
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Avatar sx={{
          mx: 'auto',
          bgcolor: 'secondary.main'
        }}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component='h1' variant='h5' sx={{ marginBottom: 5}}>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                label='Année de naissance'
                id='yearBirth'
                autoComplete='yearBirth'
                {...register('yearBirth')}
                error={!!errors.yearBirth}
                helperText={errors.yearBirth?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Téléphone'
                id='phoneNumber'
                autoComplete='phoneNumber'
                {...register('phoneNumber')}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Ville'
                id='city'
                value={cityInput}
                autoComplete='city'
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
                onChange={handleCityInputChange}
              />
              {citySuggestions.length > 0 && (
                <ul>
                  {citySuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleCitySuggestionClick(JSON.stringify(suggestion))} style={{ cursor: 'pointer' }} >{suggestion}</li>
                  ))}
                </ul>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel
                  error={errors.password !== null && errors.password !== undefined}
                  htmlFor="outlined-adornment-password"
                >
                  Mot de passe
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'} // Utilisez 'password' ici
                  {...register('password')}
                  error={errors.password !== null && errors.password !== undefined}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword('password')}
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
                  error={errors.password !== null && errors.password !== undefined}
                  id="component-error-text"
                >
                  {errors.password?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
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
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{
            marginTop: 3,
            marginBottom: 2
          }}>
            Inscription
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/connexion' variant='body2'>
                Vous avez déjà un compte ? Connectez-vous !
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

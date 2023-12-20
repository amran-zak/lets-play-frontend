// React
import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
// Yup
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// Lodash
import debounce from 'lodash/debounce'
// Materials
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, Paper } from '@mui/material'
// Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
// Files
import Authentification from '../../../Services/Authentification'

interface UserProfileData {
  phoneNumber: string
  userName: string
  email: string
  address: string
  city?: string | undefined
  yearBirth: number
}

interface CitySuggestion {
  id: number
  label: string
  city: string
}

export default function ProfileEdit() {
  const [profileData, setProfileData] = useState<UserProfileData>({
    phoneNumber: '',
    userName: '',
    email: '',
    address: '',
    city: '',
    yearBirth: 1
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await Authentification.getProfile()
        if (response) {
          const selectedProfile = response.data.user
          setProfileData(selectedProfile)
          setProfileData((prevData: UserProfileData) => ({
            ...prevData
          }))
          setAdresseInput(selectedProfile.address)
        }
      } catch (error) {
        console.error(error)
      }
    }
    void fetchProfile()
  }, [])

  const handleEditClick = () => {
    setIsEditing(!isEditing)
  }

  const validationSchema = Yup.object().shape({
    userName: Yup.string()
      .transform((value, originalValue) => {
        if (!value) {
          value = profileData.userName
        }
        return value
      }).required('Le nom est requis'),
    email: Yup.string()
      .transform((value, originalValue) => {
        if (!value) {
          value = profileData.email
        }
        return value
      }).required('L\'adresse email est requise').email('L\'adresse email n\'est pas valide'),
    phoneNumber: Yup.string()
      .required('Le téléphone est requis'),
    address: Yup.string().required('La ville est requise'),
    city: Yup.string(),
    yearBirth: Yup.number()
      .typeError('L\'année doit être un nombre')
      .required('L\'année de naissance est requise')
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserProfileData>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all'
  })

  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const fetchCitySuggestions = async (input: string) => {
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${input.replaceAll(' ', '+')}&limit=15`)
      if (response.ok) {
        const data = await response.json()
        if (data.features) {
          const citySuggestions: CitySuggestion[] = data.features.map((feature: any) => ({
            id: feature.properties.id,
            label: feature.properties.label,
            city: feature.properties.city
          }))
          setCitySuggestions(citySuggestions)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [adresseInput, setAdresseInput] = useState('')
  const [cityInput, setCityInput] = useState('')

  const debouncedFetchCitySuggestions = useCallback(
    debounce(async (input) => fetchCitySuggestions(input), 300), []
  )

  const handleCityInputChange = async (e: { target: { value: any } }) => {
    const inputValue = e.target.value
    setAdresseInput(inputValue)
    await debouncedFetchCitySuggestions(inputValue)
  }

  const handleCitySuggestionClick = (suggestion: CitySuggestion) => {
    setAdresseInput(suggestion.label)
    setCityInput(suggestion.city)
    setCitySuggestions([])
  }

  const onSubmit = async (data: UserProfileData) => {
    const modifyData: UserProfileData = {
      phoneNumber: profileData.phoneNumber,
      userName: profileData.userName,
      email: profileData.email,
      address: adresseInput,
      city: cityInput,
      yearBirth: profileData.yearBirth
    }
    try {
      await Authentification.updateUserProfile(modifyData)
      setMessage('Profil mis à jour avec succès.')
      setIsEditing(false)
    } catch (error) {
      console.error(error)
    }
  }

  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setIsDisabled(false)
    setIsEditing(true)
  }

  return (
    <Container component="main"
      className="background-container"
      sx={{
        minWidth: '100%',
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
        <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 4 }}>
          Mes informations
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {!isEditing &&
                <TextField
                  fullWidth
                  label="Nom d'utilisateur"
                  value={profileData ? profileData.userName : ''}
                  disabled={true}
                />
              }
              {isEditing &&
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="Nom d'utilisateur"
                  autoComplete='userName'
                  value={profileData ? profileData.userName : ''}
                  {...register('userName')}
                  onChange={(e) => {
                    const newValue = e.target.value
                    setProfileData((prevData: UserProfileData) => ({
                      ...prevData,
                      userName: newValue
                    }))
                  }}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                />
              }
            </Grid>
            <Grid item xs={6}>
              {!isEditing &&
                <TextField
                  fullWidth
                  label="Adresse email"
                  value={profileData ? profileData.email : ''}
                  disabled={true}
                />
              }
              {isEditing &&
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Adresse email"
                  autoComplete='email'
                  value={profileData ? profileData.email : ''}
                  {...register('email')}
                  onChange={(e) => {
                    const newValue = e.target.value
                    setProfileData((prevData: UserProfileData) => ({
                      ...prevData,
                      email: newValue
                    }))
                  }}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              }
            </Grid>
            <Grid item xs={6}>
              {!isEditing &&
                <TextField
                  fullWidth
                  label="Numéro de téléphone"
                  value={profileData ? '+33 ' + profileData.phoneNumber : ''}
                  disabled={true}
                />
              }
              {isEditing &&
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Numéro de téléphone"
                  autoComplete='phoneNumber'
                  value={profileData ? profileData.phoneNumber : ''}
                  {...register('phoneNumber')}
                  onChange={(e) => {
                    let newValue = e.target.value
                    newValue = newValue.replace(/(\d{2})(?=\d)/g, '$1 ')

                    setProfileData((prevData: UserProfileData) => ({
                      ...prevData,
                      phoneNumber: newValue
                    }))
                  }}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              }
            </Grid>
            <Grid item xs={6}>
              {!isEditing &&
                <TextField
                  fullWidth
                  label="Année de naissance"
                  value={profileData ? profileData.yearBirth : ''}
                  helperText={errors.yearBirth?.message}
                  disabled={true}
                />
              }
              {isEditing &&
                <TextField
                  required
                  fullWidth
                  id="yearBirth"
                  label="Année de naissance"
                  autoComplete='yearBirth'
                  value={profileData ? profileData.yearBirth : ''}
                  {...register('yearBirth')}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value)
                    setProfileData((prevData: UserProfileData) => ({
                      ...prevData,
                      yearBirth: newValue
                    }))
                  }}
                  error={!!errors.yearBirth}
                  helperText={errors.yearBirth?.message}
                />
              }
            </Grid>
            <Grid item xs={12}>
              {!isEditing &&
                <TextField
                  fullWidth
                  label='Adresse'
                  value={adresseInput}
                  disabled={true}
                />
              }
              {isEditing &&
                <TextField
                  required
                  fullWidth
                  id='address'
                  label='Adresse'
                  value={adresseInput}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  onChange={handleCityInputChange}
                />
              }
              {isEditing && citySuggestions.length > 0 && (
                <ul>
                  {citySuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleCitySuggestionClick(suggestion)}
                      style={{cursor: 'pointer'}}>{suggestion.label}</li>
                  ))}
                </ul>
              )}
            </Grid>
          </Grid>
          {message && <Typography style={{ color: 'green', marginTop: 2 }}>{message}</Typography>}
          {isEditing &&
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button type="submit" variant="contained" sx={{ marginTop: 3 }} disabled={isDisabled}>
                  Enregistrer les modifications
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="error" sx={{ marginTop: 3 }} onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
              </Grid>
            </Grid>
          }
          {!isEditing &&
            <Button fullWidth variant="contained" sx={{ marginTop: 3 }} onClick={handleEditClick}>
                Modifier
            </Button>
          }
        </form>
      </Box>
    </Container>
  )
}

import React, { useState, useEffect } from 'react'
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
  Paper
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Authentification from '../../Services/Authentification'
import debounce from 'lodash/debounce'
import ResultUserData from '../../Types/ResultUserData.types'

interface UserProfileData {
  phoneNumber: number
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
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await Authentification.getProfile()
        setProfileData(response.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    void fetchProfile()
  }, [])
  const handleEditClick = () => {
    setIsEditing(!isEditing) // Inverser l'état de l'édition
  }

  const validationSchema = Yup.object().shape({
    userName: Yup.string().required('Le nom est requis'),
    email: Yup.string().required('L\'adresse email est requise').email('L\'adresse email n\'est pas valide'),
    phoneNumber: Yup.number()
      .typeError('Le téléphone doit être un nombre')
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

  const debouncedFetchCitySuggestions = debounce(async (input: string) => fetchCitySuggestions(input), 300)

  const handleCityInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    await debouncedFetchCitySuggestions(inputValue)
  }

  const handleCitySuggestionClick = (suggestion: CitySuggestion) => {
    // Handle city suggestion click logic here
  }

  const onSubmit = async (data: UserProfileData) => {
    try {
      const response = await Authentification.updateUserProfile(data)
      setMessage('Profil mis à jour avec succès.')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 4 }}>
          Modification de profil
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nom d'utilisateur"
                fullWidth
                {...register('userName')}
                error={!!errors.userName}
                helperText={errors.userName?.message}
                value={profileData?.userName ?? ''}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Adresse email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                value={profileData?.email ?? ''}
                disabled={!isEditing}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Téléphone"
                fullWidth
                {...register('phoneNumber')}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                value={profileData?.phoneNumber ?? ''}
                disabled={!isEditing}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Adresse"
                fullWidth
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                value={profileData?.address ?? ''}
                disabled={!isEditing}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ville"
                fullWidth
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
                value={profileData?.city ?? ''}
                disabled={!isEditing}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Année de naissance"
                fullWidth
                {...register('yearBirth')}
                error={!!errors.yearBirth}
                helperText={errors.yearBirth?.message}
                value={profileData?.yearBirth ?? ''}
                disabled={!isEditing}

              />
            </Grid>
          </Grid>
          {message && <Typography style={{ color: 'green', marginTop: 2 }}>{message}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 3 }}>
            Enregistrer les modifications
          </Button>
          <Button fullWidth variant="contained" sx={{ marginTop: 3 }} onClick={handleEditClick}>
              Modifier
          </Button>
          <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
            <Grid item>
              <Link href="/profil" variant="body2">
                Annuler
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

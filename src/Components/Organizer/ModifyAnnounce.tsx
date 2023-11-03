import * as React from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Paper, debounce
} from '@mui/material'
import Map, {Marker, NavigationControl} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {useForm} from 'react-hook-form'
import * as Yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import AnnounceData from '../../Types/Announce.types'
import {useCallback, useEffect, useState} from 'react'
import SportsList from '../SportsList'
import Announce from '../../Services/Announce'
import {useParams} from 'react-router-dom'

interface CitySuggestion {
  id: number
  label: string
  city: string
  latitude: number
  longitude: number
}

export default function ModifyAnnounce() {
  const id = useParams()
  const [announceData, setAnnounceData] = useState<AnnounceData>({
    _id: '', // Vous pouvez initialiser l'ID avec une chaîne vide ou une valeur appropriée
    sport: '', // Vous pouvez initialiser le sport avec une chaîne vide ou une valeur appropriée
    numberOfPeopleMax: 0, // Vous pouvez initialiser avec la valeur appropriée
    date: '', // Vous pouvez initialiser la date avec une chaîne vide ou une valeur appropriée
    startTime: '', // Vous pouvez initialiser l'heure de début avec une chaîne vide ou une valeur appropriée
    endTime: '', // Vous pouvez initialiser l'heure de fin avec une chaîne vide ou une valeur appropriée
    address: '', // Vous pouvez initialiser l'adresse avec une chaîne vide ou une valeur appropriée
    city: '', // Vous pouvez initialiser la ville avec une chaîne vide ou une valeur appropriée
    ageMin: 0, // Vous pouvez initialiser avec la valeur appropriée
    ageMax: 0, // Vous pouvez initialiser avec la valeur appropriée
    price: 0, // Vous pouvez initialiser avec la valeur appropriée
    organizer: {
      phoneNumber: 0, // Vous pouvez initialiser avec la valeur appropriée
      userName: '', // Vous pouvez initialiser le nom d'utilisateur avec une chaîne vide ou une valeur appropriée
      email: '', // Vous pouvez initialiser l'e-mail avec une chaîne vide ou une valeur appropriée
      password: '', // Vous pouvez initialiser le mot de passe avec une chaîne vide ou une valeur appropriée
      address: '', // Vous pouvez initialiser l'adresse avec une chaîne vide ou une valeur appropriée
      city: '', // Vous pouvez initialiser la ville avec une chaîne vide ou une valeur appropriée
      yearBirth: 0 // Vous pouvez initialiser avec la valeur appropriée
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Announce.getById(id.id)
        console.log('response : ', response)
        if (response) {
          const selectedAnnounce = response.data.sport
          setAnnounceData(selectedAnnounce)
        }
      } catch (error) {
        console.error(error)
      }
    }

    void fetchData()
  }, [id])

  const validationSchema = Yup.object().shape({
    sport: Yup.string(),
    numberOfPeopleMax: Yup.number()
      .typeError('Le nombre de participants maximal doit être un nombre')
      .required('Le nombre de participants maximum que peut accueillir votre évènement'),
    date: Yup.string()
      .transform((value, originalValue) => {
        if (originalValue && !originalValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return null
        }
        return value
      }).required('La date de l\'évènement est requise'),
    startTime: Yup.string()
      .transform((value, originalValue) => {
        if (originalValue && !originalValue.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)) {
          return null
        }
        return value
      }).required('L\'heure de début de l\'évènement est requise'),
    endTime: Yup.string()
      .transform((value, originalValue) => {
        if (originalValue && !originalValue.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)) {
          return null
        }
        return value
      }).required('L\'heure de fin de l\'évènement est requise'),
    address: Yup.string().required('L\'adresse est requise'),
    city: Yup.string(),
    ageMin: Yup.number()
      .typeError('L\'âge minimum du participant doit être un nombre')
      .required('L\'âge minimum du participant est requis'),
    ageMax: Yup.number()
      .typeError('L\'âge maximum du participant doit être un nombre')
      .required('L\'âge maximum du participant est requis'),
    price: Yup.number()
      .typeError('Le prix doit être un nombre')
      .required('Le prix est requis')
  })

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<AnnounceData>({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all'
  })

  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([])
  const fetchCitySuggestions = async (input: string) => {
    if (input.length >= 3) {
      try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${input.replaceAll(' ', '+')}&limit=15`)
        if (response.ok) {
          const data = await response.json()
          if (data.features) {
            const citySuggestions: CitySuggestion[] = data.features.map((
              feature: {
                properties: {
                  id: number
                  label: string
                  city: string
                }
                geometry: {
                  coordinates: {
                    0: number
                    1: number
                  }
                }
              }) => ({
              id: feature.properties.id,
              label: feature.properties.label,
              city: feature.properties.city,
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0]
            }))
            setCitySuggestions(citySuggestions)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const [adresseInput, setAdresseInput] = useState('')
  const [cityInput, setCityInput] = useState('')
  const [latitudeInput, setLatitudeInput] = useState(48.866667)
  const [longitudeInput, setLongitudeInput] = useState(2.333333)
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
    setLatitudeInput(suggestion.latitude)
    setLongitudeInput(suggestion.longitude)
    setCitySuggestions([])
  }

  const [selectedSport, setSelectedSport] = useState<string>('')

  const handleSportChange = (selectedSport: string) => {
    setSelectedSport(selectedSport)
  }

  const [errorMessage, setErrorMessage] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<boolean>(false)

  const onSubmit = async (data: AnnounceData) => {
    const modifyData: AnnounceData = {
      sport: selectedSport,
      numberOfPeopleMax: data.numberOfPeopleMax,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      address: adresseInput,
      city: cityInput,
      ageMin: data.ageMin,
      ageMax: data.ageMax,
      price: data.price
    }
    try {
      const existingAnnouncements = await Announce.getAll()

      if (existingAnnouncements.data.sports && Array.isArray(existingAnnouncements.data.sports)) {
        const annonceExistante = existingAnnouncements.data.sports.find((annonce: AnnounceData) => {
          return annonce.sport === modifyData.sport
        })

        if (annonceExistante) {
          setErrorMessage(true)
          setSuccessMessage(false)
        } else {
          await Announce.modify(modifyData)
          setSuccessMessage(true)
          setErrorMessage(false)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces existantes :', error)
    }
  }

  const token = 'pk.eyJ1IjoiZ2lzZmVlZGJhY2siLCJhIjoiY2l2eDJndmtjMDFkeTJvcHM4YTNheXZtNyJ9.-HNJNch_WwLIAifPgzW2Ig'

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
      <Grid item xs={12} sm={6}>
        <Map
          initialViewState={{
            longitude: longitudeInput,
            latitude: latitudeInput,
            zoom: 5
          }}
          mapboxAccessToken={token}
          style={{
            width: '100%',
            height: '80%',
            top: '10%'
          }}
          mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
        >
          <NavigationControl/>
          <Marker longitude={longitudeInput} latitude={latitudeInput} style={{color: 'white'}}/>
        </Map>
      </Grid>
      <Grid item xs={12} sm={6} component={Paper} elevation={6} square sx={{
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
            mx: 'auto',
            bgcolor: 'secondary.main'
          }}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component='h1' variant='h5' sx={{marginBottom: 5}}>
            Créer un évènement
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SportsList onSportChange={handleSportChange} />
                {selectedSport === '' && <Typography variant="caption" display="block" gutterBottom>Ce champ est requis</Typography>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='price'
                  label='Prix'
                  autoComplete='price'
                  value={announceData ? announceData.price : ''}
                  {...register('price')}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id='date'
                  label='Date'
                  autoComplete='date'
                  value={announceData ? announceData.date : ''}
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                  {...register('date')}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id='startTime'
                  label='Horaire début'
                  autoComplete='startTime'
                  value={announceData ? announceData.startTime : ''}
                  {...register('startTime')}
                  onChange={(e) => {
                    const newValue = e.target.value
                    setAnnounceData((prevData: AnnounceData) => ({
                      ...prevData,
                      startTime: newValue
                    }))
                  }}
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id='endTime'
                  label='Horaire de fin'
                  autoComplete='endTime'
                  value={announceData ? announceData.endTime : ''}
                  {...register('endTime')}
                  error={!!errors.endTime}
                  helperText={errors.endTime?.message}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id='address'
                  label='Lieux'
                  value={announceData ? announceData.address : adresseInput}
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  onChange={handleCityInputChange}
                />
                {citySuggestions.length > 0 && (
                  <ul>
                    {citySuggestions.map((suggestion, index) => (
                      <li key={index} onClick={() => handleCitySuggestionClick(suggestion)}
                        style={{cursor: 'pointer'}}>{suggestion.label}</li>
                    ))}
                  </ul>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='numberOfPeopleMax'
                  label='Nombre maximal de participants'
                  autoComplete='numberOfPeopleMax'
                  value={announceData ? announceData.numberOfPeopleMax : ''}
                  {...register('numberOfPeopleMax')}
                  error={!!errors.numberOfPeopleMax}
                  helperText={errors.numberOfPeopleMax?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='ageMin'
                  label='Âge minimal requis'
                  autoComplete='ageMin'
                  value={announceData ? announceData.ageMin : ''}
                  {...register('ageMin')}
                  error={!!errors.ageMin}
                  helperText={errors.ageMin?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id='ageMax'
                  label='Âge maximal'
                  autoComplete='ageMax'
                  value={announceData ? announceData.ageMax : ''}
                  {...register('ageMax')}
                  error={!!errors.ageMax}
                  helperText={errors.ageMax?.message}
                />
              </Grid>
            </Grid>
            {errorMessage &&
              <Typography color='red'>
                L&aposannonce existe déjà
              </Typography>
            }
            {successMessage &&
              <Typography color='secondary.main'>
                L&aposannonce est ajouté avec succès
              </Typography>
            }
            <Button type='submit' fullWidth variant='contained' sx={{
              marginTop: 3,
              marginBottom: 2
            }}>
              Modifier
            </Button>
          </form>
        </Box>
      </Grid>
    </Grid>
  )
}

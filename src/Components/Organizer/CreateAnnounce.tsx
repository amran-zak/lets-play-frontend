import * as React from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Paper, debounce
} from '@mui/material'
import Map, { Marker, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {useForm} from 'react-hook-form'
import * as Yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import background from '../Images/chaussure.jpeg'
import AnnounceData from '../../Types/Announce.types'
import {useCallback, useState} from 'react'

interface CitySuggestion {
  id: number
  label: string
  city: string
  latitude: number
  longitude: number
}

export default function CreateAnnounce() {
  const validationSchema = Yup.object().shape({
    sport: Yup.string().required('Le choix du sport est requis'),
    numberOfPeopleMax: Yup.number()
      .typeError('Le nombre de participants maximal doit être un nombre')
      .required('Le nombre de participants maximum que peut accueillir votre évènement'),
    date: Yup.date().required('La date de l\'évènement est requise'),
    startTime: Yup.date().required('L\'heure de début de l\'évènement est requise'),
    endTime: Yup.date()
      .required('L\'heure de fin de l\'évènement est requise')
      .when('startTime', (startTime, schema) => {
        return schema.min(startTime, 'L\'heure de fin doit être postérieure à l\'heure de début')
      }),
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
    setLatitudeInput(suggestion.latitude)
    setLongitudeInput(suggestion.longitude)
    setCitySuggestions([])
  }

  const token = 'pk.eyJ1IjoiZ2lzZmVlZGJhY2siLCJhIjoiY2l2eDJndmtjMDFkeTJvcHM4YTNheXZtNyJ9.-HNJNch_WwLIAifPgzW2Ig'

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
          Créer un évènement
        </Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='given-name'
                required
                fullWidth
                id='sport'
                label='Sport'
                autoFocus
                {...register('sport')}
                error={!!errors.sport}
                helperText={errors.sport?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id='price'
                label='Prix'
                autoComplete='price'
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
                {...register('startTime')}
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
                {...register('endTime')}
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id='address'
                label='Lieux'
                value={adresseInput}
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
                onChange={handleCityInputChange}
              />
              {citySuggestions.length > 0 && (
                <ul>
                  {citySuggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleCitySuggestionClick(suggestion)} style={{ cursor: 'pointer' }}>{suggestion.label}</li>
                  ))}
                </ul>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Map
                initialViewState={{
                  longitude: longitudeInput,
                  latitude: latitudeInput,
                  zoom: 14
                }}
                mapboxAccessToken={token}
                style={{ width: '100%', height: 400 }}
                mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
              >
                <NavigationControl />
                <Marker longitude={longitudeInput} latitude={latitudeInput} style={{ color: 'white' }}/>
              </Map>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id='numberOfPeopleMax'
                label='Nombre maximal de participants'
                autoComplete='numberOfPeopleMax'
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
                {...register('ageMax')}
                error={!!errors.ageMax}
                helperText={errors.ageMax?.message}
              />
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{
            marginTop: 3,
            marginBottom: 2
          }}>
            Ajouter
          </Button>
        </form>
      </Box>
    </Container>
  )
}

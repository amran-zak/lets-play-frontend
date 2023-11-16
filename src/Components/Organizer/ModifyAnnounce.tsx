import * as React from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Paper,
  debounce,
  Container
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
import {useParams, useNavigate} from 'react-router-dom'
import background from '../Images/montagne.jpeg'

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
    _id: '',
    sport: '',
    numberOfPeopleMax: 0,
    date: '',
    startTime: '',
    endTime: '',
    address: '',
    city: '',
    ageMin: 0,
    ageMax: 0,
    price: 0,
    organizer: {
      phoneNumber: 0,
      userName: '',
      email: '',
      password: '',
      address: '',
      city: '',
      yearBirth: 0
    }
  })
  const [adresseInput, setAdresseInput] = useState('')
  const [cityInput, setCityInput] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Announce.getById(id.id)
        if (response) {
          const selectedAnnounce = response.data.sport
          setAnnounceData(selectedAnnounce)
          setAnnounceData((prevData: AnnounceData) => ({
            ...prevData,
            date: selectedAnnounce.date.split('T')[0],
            startTime: transformHours(selectedAnnounce.startTime),
            endTime: transformHours(selectedAnnounce.endTime)
          }))
          setSelectedSport(selectedAnnounce.sport)
          setAdresseInput(selectedAnnounce.address)
          setCityInput(selectedAnnounce.city)
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
        if (!value) {
          value = announceData.date
        }
        return value
      }).required('La date de l\'évènement est requise'),
    startTime: Yup.string()
      .transform((value, originalValue) => {
        if (!value) {
          value = announceData.startTime
        }
        if (originalValue && !originalValue.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)) {
          return null
        }
        return value
      }).required('L\'heure de début de l\'évènement est requise et doit être du format 00:00'),
    endTime: Yup.string()
      .transform((value, originalValue) => {
        if (!value) {
          value = announceData.endTime
        }
        if (originalValue && !originalValue.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)) {
          return null
        }
        return value
      }).required('L\'heure de fin de l\'évènement est requise et doit être du format 00:00'),
    address: Yup.string()
      .transform((value, originalValue) => {
        if (!value) {
          value = announceData.address
        }
        return value
      }).required('L\'adresse est requise'),
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
  const [latitudeInput, setLatitudeInput] = useState(48.866667)
  const [longitudeInput, setLongitudeInput] = useState(2.333333)
  const [zoomValue, setZoomValue] = useState(4)

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
    setZoomValue(6)
    setCitySuggestions([])
  }

  const [selectedSport, setSelectedSport] = useState<string>('')

  const handleSportChange = (selectedSport: string) => {
    setSelectedSport(selectedSport)
  }

  const [errorMessage, setErrorMessage] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<boolean>(false)
  const navigate = useNavigate()

  const onSubmit = async (data: AnnounceData) => {
    const modifyData: AnnounceData = {
      sport: selectedSport,
      numberOfPeopleMax: announceData.numberOfPeopleMax,
      date: announceData.date,
      startTime: `${announceData.date.split('T')[0]}T${announceData.startTime}:00.000Z`,
      endTime: `${announceData.date.split('T')[0]}T${announceData.endTime}:00.000Z`,
      address: adresseInput,
      city: cityInput,
      ageMin: announceData.ageMin,
      ageMax: announceData.ageMax,
      price: announceData.price
    }

    Announce.modify(modifyData, id.id)
      .then(response => {
        setSuccessMessage(true)
        setErrorMessage(false)
        setIsDisabled(true)
        setTimeout(() => {
          navigate('/annonces/liste')
        }, 2000)
      })
      .catch(error => {
        console.error(error)
        setSuccessMessage(false)
        setErrorMessage(true)
      })
  }

  const token = 'pk.eyJ1IjoiZ2lzZmVlZGJhY2siLCJhIjoiY2l2eDJndmtjMDFkeTJvcHM4YTNheXZtNyJ9.-HNJNch_WwLIAifPgzW2Ig'

  const transformHours = (time: string) => {
    const [, timePart] = time.match(/T(\d+:\d+):\d+/) ?? []
    return timePart || ''
  }

  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setIsDisabled(false)
    setSuccessMessage(false)
    setErrorMessage(false)
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
      <Box maxWidth="lg" component={Paper}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          p: 5,
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Map
              initialViewState={{
                longitude: longitudeInput,
                latitude: latitudeInput,
                zoom: zoomValue
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
                Modifier l&rsquo;évènement
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <SportsList onSportChange={handleSportChange} defaultValue={selectedSport} />
                    {selectedSport === '' && <Typography variant="caption" display="block" gutterBottom>Ce champ est requis</Typography>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id='price'
                      label='Prix'
                      type='number'
                      autoComplete='price'
                      value={announceData ? announceData.price : ''}
                      {...register('price')}
                      onChange={(e) => {
                        const inputValue = e.target.value
                        const newValue = inputValue !== '' ? parseInt(inputValue) : 0
                        setAnnounceData((prevData: AnnounceData) => ({
                          ...prevData,
                          price: newValue
                        }))
                      }}
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
                      onChange={(e) => {
                        const inputValue = e.target.value
                        const newValue = inputValue !== '' ? inputValue : ''
                        if (newValue.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)) {
                          setAnnounceData((prevData: AnnounceData) => ({
                            ...prevData,
                            date: newValue
                          }))
                        }
                      }}
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
                      onChange={(e) => {
                        const newValue = e.target.value
                        setAnnounceData((prevData: AnnounceData) => ({
                          ...prevData,
                          endTime: newValue
                        }))
                      }}
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
                      value={adresseInput}
                      {...register('address')}
                      onChange={(e) => {
                        const newValue = e.target.value
                        void handleCityInputChange(e)
                        setAnnounceData((prevData: AnnounceData) => ({
                          ...prevData,
                          address: newValue
                        }))
                      }}
                      error={!!errors.address}
                      helperText={errors.address?.message}
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
                      type='number'
                      label='Nombre maximal de participants'
                      autoComplete='numberOfPeopleMax'
                      value={announceData ? announceData.numberOfPeopleMax : ''}
                      {...register('numberOfPeopleMax')}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        setAnnounceData((prevData: AnnounceData) => ({
                          ...prevData,
                          numberOfPeopleMax: newValue
                        }))
                      }}
                      error={!!errors.numberOfPeopleMax}
                      helperText={errors.numberOfPeopleMax?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id='ageMin'
                      type='number'
                      label='Âge minimal requis'
                      autoComplete='ageMin'
                      value={announceData ? announceData.ageMin : ''}
                      {...register('ageMin')}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        setAnnounceData((prevData: AnnounceData) => ({
                          ...prevData,
                          ageMin: newValue
                        }))
                      }}
                      error={!!errors.ageMin}
                      helperText={errors.ageMin?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id='ageMax'
                      type='number'
                      label='Âge maximal'
                      autoComplete='ageMax'
                      value={announceData ? announceData.ageMax : ''}
                      {...register('ageMax')}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value)
                        setAnnounceData((prevData: AnnounceData) => ({
                          ...prevData,
                          ageMax: newValue
                        }))
                      }}
                      error={!!errors.ageMax}
                      helperText={errors.ageMax?.message}
                    />
                  </Grid>
                </Grid>
                {errorMessage &&
                  <Typography color='red'>
                    L&apos;annonce existe déjà en état
                  </Typography>
                }
                {successMessage &&
                  <Typography color='secondary.main'>
                    L&apos;annonce est modifiée avec succès
                  </Typography>
                }
                <Button type='submit' fullWidth variant='contained' disabled={isDisabled}
                  sx={{
                    marginTop: 3,
                    marginBottom: 2
                  }}>
                  Modifier
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

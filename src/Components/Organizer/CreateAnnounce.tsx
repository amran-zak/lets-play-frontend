import React, {useState} from 'react'
import { Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Paper, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {useForm} from 'react-hook-form'
import * as Yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import AnnounceData from '../../Types/Announce.types'
import SportsList from '../SportsList'
import Announce from '../../Services/Announce'
import background from '../Images/football_homepage.jpeg'
import AddressInputWithMap from '../Tools/AddressInputWithMap'

export default function CreateAnnounce() {
  const validationSchema = Yup.object().shape({
    sport: Yup.string(),
    numberOfPeopleMax: Yup.number()
      .typeError('Le nombre de participants maximal doit être un nombre')
      .required('Le nombre de participants maximum que peut accueillir votre évènement'),
    date: Yup.string()
      .transform((value, originalValue) => {
        // Assurez-vous que la date est sous le format "AAAA-MM-JJ" (année-mois-jour)
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
      }).required('L\'heure de début de l\'évènement est requise et doit être du format 00:00'),
    endTime: Yup.string()
      .transform((value, originalValue) => {
        if (originalValue && !originalValue.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)) {
          return null
        }
        return value
      }).required('L\'heure de fin de l\'évènement est requise et doit être du format 00:00'),
    address: Yup.string(),
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

  const [adresseInput, setAdresseInput] = useState('')
  const [cityInput, setCityInput] = useState('')

  const handleCityInputChange = async (e: { target: { value: any } }) => {
    const inputValue = e.target.value
    setAdresseInput(inputValue)
  }

  const [selectedSport, setSelectedSport] = useState<string>('')

  const handleSportChange = (selectedSport: string) => {
    setSelectedSport(selectedSport)
  }

  const [errorMessage, setErrorMessage] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<boolean>(false)
  const navigate = useNavigate()
  const [startTimeInput, setStartTimeInput] = useState('')
  const [endTimeInput, setEndTimeInput] = useState('')

  const onSubmit = async (data: AnnounceData) => {
    const addData: AnnounceData = {
      sport: selectedSport || 'Football',
      numberOfPeopleMax: data.numberOfPeopleMax,
      date: data.date,
      startTime: `${data.date}T${startTimeInput}:00.000Z`,
      endTime: `${data.date}T${endTimeInput}:00.000Z`,
      address: adresseInput,
      city: cityInput,
      ageMin: data.ageMin,
      ageMax: data.ageMax,
      price: data.price
    }
    try {
      await Announce.create(addData)
      setSuccessMessage(true)
      setErrorMessage(false)
      setTimeout(() => {
        navigate('/annonces/liste')
      }, 2000)
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces existantes :', error)
    }
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
          <form onSubmit={handleSubmit(onSubmit)} onChange={handleFormChange}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <AddressInputWithMap
                  id={'address'}
                  value={adresseInput}
                  {...register('address')}
                  onChange={handleCityInputChange}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  setAdresseInput={setAdresseInput}
                  setCityInput={setCityInput}
                />
              </Grid>
              <Grid item xs={12} sm={6} component={Paper} elevation={6} square sx={{
                my: 'auto',
                boxShadow: 'none'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <SportsList onSportChange={handleSportChange} defaultValue={selectedSport}/>
                    {selectedSport === '' && <Typography variant="caption" display="block" gutterBottom>Ce champ est requis</Typography>}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id='price'
                      type='number'
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
                      {...register('startTime')}
                      value={startTimeInput}
                      onChange={(e) => {
                        let newValue = e.target.value
                        // Supprimer les caractères non numériques
                        newValue = newValue.replace(/\D/g, '')
                        // Ajouter automatiquement les deux-points après les deux premiers caractères
                        if (newValue.length > 2 && newValue.length <= 4) {
                          newValue = `${newValue.slice(0, 2)}:${newValue.slice(2)}`
                        }
                        setStartTimeInput(newValue)
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
                      {...register('endTime')}
                      value={endTimeInput}
                      onChange={(e) => {
                        let newValue = e.target.value
                        // Supprimer les caractères non numériques
                        newValue = newValue.replace(/\D/g, '')
                        // Ajouter automatiquement les deux-points après les deux premiers caractères
                        if (newValue.length > 2 && newValue.length <= 4) {
                          newValue = `${newValue.slice(0, 2)}:${newValue.slice(2)}`
                        }
                        setEndTimeInput(newValue)
                      }}
                      error={!!errors.endTime}
                      helperText={errors.endTime?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id='numberOfPeopleMax'
                      type='number'
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
                      type='number'
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
                      type='number'
                      label='Âge maximal'
                      autoComplete='ageMax'
                      {...register('ageMax')}
                      error={!!errors.ageMax}
                      helperText={errors.ageMax?.message}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} sx={{marginTop: 10}}>
                {errorMessage &&
                  <Typography color='red'>
                    L&apos;annonce existe déjà
                  </Typography>
                }
                {successMessage &&
                  <Typography color='secondary.main'>
                    L&apos;annonce est ajouté avec succès
                  </Typography>
                }
                <Button type='submit' variant='contained' disabled={isDisabled}
                  sx={{
                    marginTop: 3,
                    marginBottom: 2
                  }}>
                  Ajouter
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Container>
  )
}

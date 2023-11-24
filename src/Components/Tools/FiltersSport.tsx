import React, { useState, useCallback } from 'react'
import {
  Button, FormControl, TextField, List, ListItem, ListItemText, Drawer, Divider, Grid, debounce, FormControlLabel,
  Checkbox
} from '@mui/material'
import { Close, FilterAlt, FilterAltOff } from '@mui/icons-material'
import publicService from '../../Services/Public'
import AnnounceData from '../../Types/Announce.types'
import SportsList from '../SportsList'

/* eslint-disable indent, @typescript-eslint/indent */

interface FilterProps {
  sportsList: AnnounceData[]
  setSportsList: React.Dispatch<React.SetStateAction<AnnounceData[]>>
}

interface CitySuggestion {
  city: string
}

const FilterComponent: React.FC<FilterProps> = ({sportsList, setSportsList}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const [searchCity, setSearchCity] = React.useState<string>('')
  const [searchSport, setSearchSport] = React.useState<string>('Football')
  const [isFiltered, setIsFiltered] = React.useState<boolean>(false)
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([])
  const [searchSimpleDate, setSearchSimpleDate] = React.useState<Date | string>('')
  const [checkedSimpleDate, setCheckedSimpleDate] = React.useState<boolean>(false)
  const [searchBetweenStartDate, setSearchBetweenStartDate] = React.useState<Date | string>('')
  const [searchBetweenEndDate, setSearchBetweenEndDate] = React.useState<Date | string>('')
  const [checkedBetweenDate, setCheckedBetweenDate] = React.useState<boolean>(false)

  const handleCitySuggestionClick = (suggestion: CitySuggestion) => {
    setSearchCity(suggestion.city)
    setCitySuggestions([])
  }

  const fetchCitySuggestions = async (input: string) => {
    if (input.length >= 3) {
      try {
        const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${input.replaceAll(' ', '+')}&type=municipality&limit=5`)
        if (response.ok) {
          const data = await response.json()
          if (data.features) {
            const uniqueCitySuggestions: CitySuggestion[] = []
            const seenCities = new Set()

            data.features.forEach((feature: { properties: { city: string } }) => {
              const city = feature.properties.city
              // Vérifier si la ville n'a pas déjà été ajoutée
              if (!seenCities.has(city)) {
                uniqueCitySuggestions.push({ city })
                seenCities.add(city)
              }
            })

            setCitySuggestions(uniqueCitySuggestions)
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

  const handleSearchAddress = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(event.target.value)
    await debouncedFetchCitySuggestions(event.target.value)
  }

  const handleSearchSport = (sport: string) => {
    setSearchSport(sport)
  }

  const handleSearchSimpleDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSimpleDate(event.target.value)
  }

  const handleSearchBetweenStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBetweenStartDate(event.target.value)
  }

  const handleSearchBetweenEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBetweenEndDate(event.target.value)
  }

  const handleChangeSimpleDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedSimpleDate(event.target.checked)
    setCheckedBetweenDate(false)
    setSearchBetweenStartDate('')
    setSearchBetweenEndDate('')
  }

  const handleChangeBetweenDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedBetweenDate(event.target.checked)
    setCheckedSimpleDate(false)
    setSearchSimpleDate('')
  }

  const handleFilter = () => {
    if (searchSport === '') {
      setSearchSport('Football')
    }
    const filterFunction = (property: any, searchTerm: string) => {
      return property && typeof property === 'string' &&
        property.trim().toUpperCase().includes(searchTerm.trim().toUpperCase())
    }
    const filterFunctionBetweenDates = (property: any, searchTerm1: string, searchTerm2: string) => {
      if (!property || typeof property !== 'string') {
          return false
      }
      const propertyDate = new Date(property)
      if (isNaN(propertyDate.getTime())) {
          return false
      }
      return propertyDate >= new Date(searchTerm1) && propertyDate <= new Date(searchTerm2)
    }
    let filteredList
    switch (true) {
      case searchCity !== '' && searchSport !== '' && searchSimpleDate !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.city, searchCity) && filterFunction(element.sport, searchSport) && filterFunction(element.date, searchSimpleDate.toString()))
        break
      case searchCity !== '' && searchSport !== '' && searchBetweenStartDate !== '' && searchBetweenEndDate !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.city, searchCity) && filterFunction(element.sport, searchSport) && filterFunctionBetweenDates(element.date, searchBetweenStartDate.toString(), searchBetweenEndDate.toString()))
        break
      case searchCity !== '' && searchSport !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.city, searchCity) && filterFunction(element.sport, searchSport))
        break
      case searchSimpleDate !== '' && searchSport !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.date, searchSimpleDate.toString()) && filterFunction(element.sport, searchSport))
        break
      case searchBetweenStartDate !== '' && searchBetweenEndDate !== '' && searchSport !== '':
        filteredList = sportsList.filter((element) => filterFunctionBetweenDates(element.date, searchBetweenStartDate.toString(), searchBetweenEndDate.toString()) && filterFunction(element.sport, searchSport))
        break
      case searchSport !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.sport, searchSport))
        break
      default:
      filteredList = sportsList
  }

  setSportsList(filteredList)
    setIsFiltered(true)
  }

  const handleFilterReset = () => {
    publicService.getAllSports()
      .then(response => {
        const data = response.data
        setSportsList(data.sports)
      })
      .catch(error => {
        console.error('Error fetching sports:', error)
      })

    setIsFiltered(false)
    setSearchCity('')
    setSearchSport('')
    setCheckedSimpleDate(false)
    setSearchSimpleDate('')
    setCheckedBetweenDate(false)
    setSearchBetweenStartDate('')
    setSearchBetweenEndDate('')
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={12} textAlign='left'>
          <Button
            aria-label="Filtrer les annonces"
            variant="contained"
            onClick={toggleMenu}
            sx={{ left: '3%', bgcolor: 'secondary.main' }}
          >
            Filtrer <FilterAlt />
          </Button>
          <Drawer
            anchor="left"
            open={isMenuOpen}
            onClose={toggleMenu}
            sx={{ width: 250, flexShrink: 0 }}
          >
            <List>
              <Grid container>
                <Grid item md={12} xs={12} textAlign="end">
                  <Button
                    onClick={toggleMenu}
                    sx={{ color: 'red' }}
                  >
                    <Close />
                  </Button>
                </Grid>
              </Grid>
              <ListItem>
                <FormControl sx={{ my: 2, textAlign: 'center' }}>
                  <TextField
                    fullWidth
                    label='Rechercher par nom de ville'
                    type='text'
                    autoComplete='searchCity'
                    value={searchCity}
                    onChange={handleSearchAddress}
                    disabled={isFiltered}
                  />
                  {citySuggestions.length > 0 && (
                    <ul>
                      {citySuggestions.map((suggestion, index) => (
                        <li
                          color="black"
                          key={index}
                          onClick={() => handleCitySuggestionClick(suggestion)}
                          style={{ cursor: 'pointer' }}
                        >
                          {suggestion.city}
                        </li>
                      ))}
                    </ul>
                  )}
                  <br />
                  <SportsList onSportChange={handleSearchSport} defaultValue={searchSport} disabled={isFiltered} />
                  <br />
                  <FormControlLabel
                    label="Date précise"
                    control={
                      <Checkbox
                        checked={checkedSimpleDate}
                        onChange={handleChangeSimpleDate}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Intervalle de dates"
                    control={
                      <Checkbox
                        checked={checkedBetweenDate}
                        onChange={handleChangeBetweenDate}
                      />
                    }
                  />
                  <br />
                  {checkedSimpleDate &&
                    <TextField
                      label='Date'
                      autoComplete='searchDateStart'
                      type='date'
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={searchSimpleDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchSimpleDate(e)}
                      disabled={isFiltered}
                    />
                  }
                  {checkedBetweenDate &&
                    <Grid container>
                      <Grid item md={6}>
                        <TextField
                          label='Début'
                          autoComplete='searchBetweenStartDate'
                          type='date'
                          InputLabelProps={{
                            shrink: true
                          }}
                          value={searchBetweenStartDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchBetweenStartDate(e)}
                          disabled={isFiltered}
                        />
                      </Grid>
                      <Grid item md={6}>
                        <TextField
                          label='Fin'
                          autoComplete='searchBetweenEndDate'
                          type='date'
                          InputLabelProps={{
                            shrink: true
                          }}
                          value={searchBetweenEndDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchBetweenEndDate(e)}
                          disabled={isFiltered}
                        />
                      </Grid>
                    </Grid>
                  }
                  {!isFiltered && (
                    <Button
                      variant="contained"
                      sx={{ marginTop: '10px', bgcolor: 'secondary.main' }}
                      onClick={() => { handleFilter(); toggleMenu() }}
                      disabled={(checkedSimpleDate && searchSimpleDate === '') || (checkedBetweenDate && searchBetweenStartDate === '' && searchBetweenEndDate === '')}
                    >
                      Valider
                    </Button>
                  )}
                  {isFiltered && (
                    <Button
                      variant="contained"
                      sx={{ marginTop: '10px', bgcolor: 'secondary.main' }}
                      onClick={() => { handleFilterReset() }}
                    >
                      Rénitialiser <FilterAltOff />
                    </Button>
                  )}
                </FormControl>
              </ListItem>
            </List>
            <Divider />
          </Drawer>
        </Grid>
      </Grid>
    </>
  )
}

export default FilterComponent

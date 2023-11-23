import React, { useState, useCallback } from 'react'
import {
  Button, FormControl, TextField, List, ListItem, ListItemText, Drawer, Divider, Grid, debounce
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
  const [searchDateStart, setSearchDateStart] = React.useState<Date | string>('')

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

  const handleSearchDateStart = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDateStart(event.target.value)
  }

  const handleFilter = () => {
    if (searchSport === '') {
      setSearchSport('Football')
    }
    const filterFunction = (property: any, searchTerm: string) => {
      return property && typeof property === 'string' &&
        property.trim().toUpperCase().includes(searchTerm.trim().toUpperCase())
    }
    let filteredList
    switch (true) {
      case searchCity !== '' && searchSport !== '' && searchDateStart !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.city, searchCity) && filterFunction(element.sport, searchSport) && filterFunction(element.date, searchDateStart.toString()))
        break
      case searchCity !== '' && searchSport !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.city, searchCity) && filterFunction(element.sport, searchSport))
        break
      case searchCity !== '' && searchDateStart !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.city, searchCity) && filterFunction(element.date, searchDateStart.toString()))
        break
      case searchDateStart !== '' && searchSport !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.date, searchDateStart.toString()) && filterFunction(element.sport, searchSport))
        break
      case searchCity !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.city, searchCity))
        break
      case searchSport !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.sport, searchSport))
        break
      case searchDateStart !== '':
        filteredList = sportsList.filter((element) => filterFunction(element.date, searchDateStart.toString()))
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
    setSearchDateStart('')
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
                <Grid item md={9} xs={12}>
                  <ListItem>
                    <ListItemText primary="Filtrer les annonces" />
                  </ListItem>
                </Grid>
                <Grid item md={3} xs={12} textAlign="end">
                  <Button
                    onClick={toggleMenu}
                    sx={{ color: 'red' }}
                  >
                    <Close />
                  </Button>
                </Grid>
              </Grid>
              {/* Ajoutez ici d'autres éléments de menu si nécessaire */}
              <ListItem>
                <FormControl sx={{ my: 1, mt: 5, textAlign: 'center' }} size="small">
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
                  <Grid container>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label='Date'
                        autoComplete='searchDateStart'
                        type='date'
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={searchDateStart}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchDateStart(e)}
                        disabled={isFiltered}
                      />
                    </Grid>
                  </Grid>
                  {!isFiltered && (
                    <Button
                      variant="contained"
                      sx={{ marginTop: '10px', bgcolor: 'secondary.main' }}
                      onClick={() => { handleFilter(); toggleMenu() }}
                      disabled={searchCity === '' && searchSport === '' && searchDateStart === ''}
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

import React, { useCallback, useState } from 'react'
import { TextField, debounce } from '@mui/material'
import Map, {Marker, NavigationControl} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface FormInputProps {
  id: string
  value: string
  onChange: (e: { target: { value: any } }) => void
  error?: boolean
  helperText?: string
  setAdresseInput: (value: string) => void
  setCityInput: (value: string) => void
}

export interface CitySuggestion {
  id: number
  label: string
  city: string
  latitude: number
  longitude: number
}

const AddressInputWithMap: React.FC<FormInputProps> = ({
  id,
  value,
  onChange,
  error = false,
  helperText,
  setAdresseInput,
  setCityInput
}) => {
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([])
  const [latitudeInput, setLatitudeInput] = useState(48.866667)
  const [longitudeInput, setLongitudeInput] = useState(2.333333)
  const [zoomValue, setZoomValue] = useState(4)

  const token = 'pk.eyJ1IjoiZ2lzZmVlZGJhY2siLCJhIjoiY2l2eDJndmtjMDFkeTJvcHM4YTNheXZtNyJ9.-HNJNch_WwLIAifPgzW2Ig'

  const debouncedFetchCitySuggestions = useCallback(
    debounce(async (input) => fetchCitySuggestions(input), 300), []
  )

  const handleCitySuggestionClick = (suggestion: CitySuggestion) => {
    setAdresseInput(suggestion.label)
    setCityInput(suggestion.city)
    setLatitudeInput(suggestion.latitude)
    setLongitudeInput(suggestion.longitude)
    setZoomValue(6)
    setCitySuggestions([])
  }

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

  return (
    <>
      <TextField
        required
        fullWidth
        id={id}
        label='Lieux'
        value={value}
        type='text'
        error={error}
        helperText={helperText}
        onChange={async (e) => {
          onChange(e)
          await debouncedFetchCitySuggestions(e.target.value)
        }}
      />
      {citySuggestions?.length > 0 && (
        <ul>
          {citySuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleCitySuggestionClick?.(suggestion)}
              style={{ cursor: 'pointer' }}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
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
    </>
  )
}

export default AddressInputWithMap

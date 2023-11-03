import React, {useState} from 'react'
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material'

const sportsList = [
  'Football',
  'Basketball',
  'Tennis',
  'Golf',
  'Natation',
  'Athlétisme',
  'Cyclisme',
  'Volley-ball',
  'Baseball',
  'Boxe',
  'Escalade',
  'Hockey sur glace',
  'Rugby',
  'Badminton',
  'Course automobile',
  'Ski alpin',
  'Escrime',
  'Gymnastique',
  'Musculation',
  'Judo',
  'Surf',
  'Planche à voile',
  'Water-polo',
  'Tir à l\'arc',
  'Haltérophilie',
  'Handball',
  'Karaté',
  'Taekwondo',
  'Wrestling'
]

interface SportsListProps {
  onSportChange: (selectedSport: string) => void
}

const SportsList: React.FC<SportsListProps> = ({ onSportChange }) => {
  const [selectedSport, setSelectedSport] = useState<string>('')

  const handleSportChange = (event: SelectChangeEvent<string>) => {
    const newSelectedSport = event.target.value
    setSelectedSport(newSelectedSport)
    onSportChange(newSelectedSport)
  }

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="sport-label">Sport</InputLabel>
        <Select
          labelId="sport-label"
          id="sport"
          value={selectedSport}
          onChange={handleSportChange}
        >
          {sportsList.map((sport, index) => (
            <MenuItem key={index} value={sport}>
              {sport}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default SportsList

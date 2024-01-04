import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Rating from '../../../Services/Rating'
import RatingData from '../../../Types/Rating.types'
import Users from '../../../Services/Users'
import { useForm } from 'react-hook-form'
import { Button, TextField } from '@mui/material'
import UserData from '../../../Types/User.types'
import UserProfileData from '../../../Types/ProfileModif.types'
import Authentification from '../../../Services/Authentification'

interface RatingComponentProps {
  userId: string | undefined
  starColor?: string | undefined
}

const RatingAndCommentUser: React.FC<RatingComponentProps> = ({ userId, starColor }) => {
  const validationSchema = Yup.object().shape({
    comment: Yup.string().required('Un commentaire est requis')
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    criteriaMode: 'all'
  })

  const [comment, setComment] = useState('')
  const isButtonDisabled = comment.trim() === ''

  const handleCommentChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setComment(event.target.value)
  }

  const [currentRating, setCurrentRating] = useState<RatingData>()

  const [profile, setProfile] = useState<UserProfileData>()

  const fetchProfile = async () => {
    try {
      const response = await Authentification.getProfile()
      if (response.data.user) {
        setProfile(response.data.user)
      } else {
        console.error('Profil non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil', error)
    }
  }

  const fetchRating = async (profileId: string | undefined) => {
    try {
      const response = await Rating.getByToAndFromUser(userId, profileId)
      setCurrentRating(response.data[0])
      setValue('comment', response.data[0].comment)
    } catch (error) {
      console.error('Erreur lors de la récupération de votre note', error)
    }
  }

  useEffect(() => {
    void fetchProfile()
  }, [userId, setValue])

  useEffect(() => {
    if (profile?._id) {
      void fetchRating(profile?._id)
    }
  }, [profile?._id, userId])

  const createOrUpdate = async (data: RatingData) => {
    try {
      const response = await Rating.createOrUpdate(data)
      setCurrentRating(response.data)
    } catch (error) {
      console.error('Erreur lors de la création / mise à jour de votre note', error)
    }
  }

  const onSubmit = async (formData: { comment: string }) => {
    const defaultUserData: UserData = {
      // Définissez ici les valeurs par défaut pour UserData
      phoneNumber: '',
      userName: '',
      email: '',
      password: '',
      address: '',
      city: '',
      yearBirth: 0
    }

    const modifyData: RatingData = {
      ...currentRating,
      rating: currentRating?.rating ?? 0,
      comment: formData.comment,
      at: currentRating?.at ?? new Date(),
      from: currentRating?.from ?? defaultUserData,
      to: currentRating?.to ?? defaultUserData
    }

    try {
      void createOrUpdate(modifyData)
      setComment('')
    } catch (error) {
      console.error(error)
    }
  }

  const handleRatingClick = async (newRating: number) => {
    const responseFromUserId = await Users.getProfileById(profile?._id)
    const responseToUserId = await Users.getProfileById(userId)

    const newRatingData: RatingData = {
      rating: newRating,
      comment: currentRating?.comment ?? '',
      at: new Date(),
      from: currentRating?.from ?? responseFromUserId.data.user,
      to: currentRating?.to ?? responseToUserId.data.user
    }
    void createOrUpdate(newRatingData)
  }

  return (
    <div>
      <div style={{ marginTop: 3 }}>
        Notez cet utilisateur : {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            onClick={() => handleRatingClick(index + 1)} // eslint-disable-line @typescript-eslint/promise-function-async
            style={{ cursor: 'pointer', color: index < (currentRating?.rating ?? 0) ? 'gold' : (starColor ?? 'grey') }}
          >
            ★
          </span>
        ))}
      </div>
      <br/>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          required
          fullWidth
          id="comment"
          placeholder="Ajouter un commentaire"
          autoComplete='comment'
          {...register('comment')}
          onChange={handleCommentChange}
          multiline
          rows={5}
          error={!!errors.comment}
          helperText={errors.comment?.message}
        />
        <Button type="submit" variant="contained" sx={{ marginTop: 3 }} disabled={isButtonDisabled}>
          Enregistrer
        </Button>
      </form>
    </div>
  )
}

export default RatingAndCommentUser

import React, { useState, useEffect } from 'react'
import Rating from '../../../Services/Rating'

interface RatingComponentProps {
  userId: string | undefined
  starColor?: string | undefined
}

const ViewAverageRating: React.FC<RatingComponentProps> = ({ userId, starColor }) => {
  const [averageRating, setAverageRating] = useState<number>(0)

  const getAverage = async (id: string | undefined) => {
    try {
      const response = await Rating.getAverageRating(id)
      setAverageRating(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération de la note moyenne du profile', error)
    }
  }

  useEffect(() => {
    void getAverage(userId)
  })

  return (
    <div>
      <div>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            style={{ color: index < (averageRating) ? 'gold' : (starColor ?? 'grey') }}
          >
            ★
          </span>
        ))}
      </div>{averageRating} / 5
    </div>
  )
}

export default ViewAverageRating

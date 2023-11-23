import React from 'react'
import {
  Grid,
  Pagination
} from '@mui/material'

interface PaginationProps {
  currentPage: number
  handlePageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void
  totalPageCount: number
}

const PaginationComponent: React.FC<PaginationProps> = ({ currentPage, handlePageChange, totalPageCount }) => {
  return (
    <Grid container style={{ width: '100%', marginBottom: '10px' }}>
      <Grid item xs={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          count={totalPageCount}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Grid>
    </Grid>
  )
}

export default PaginationComponent

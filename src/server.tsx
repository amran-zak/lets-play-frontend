import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})

export default http

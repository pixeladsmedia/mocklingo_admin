import axios from 'axios'

// Simple axios setup
export const api = axios.create({
  baseURL: 'https://mocklingo.com/api',
})

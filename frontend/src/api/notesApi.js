import axios from 'axios'

const BASE = '/api/notes'

export const getNotes  = ()        => axios.get(BASE)
export const getNote   = (id)      => axios.get(`${BASE}/${id}`)
export const createNote = (data)   => axios.post(BASE, data)
export const updateNote = (id, data) => axios.put(`${BASE}/${id}`, data)
export const deleteNote = (id)     => axios.delete(`${BASE}/${id}`)

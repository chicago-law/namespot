import axios from 'axios'

const api = {
  getUser: (id: string) => axios.get(`/api/users/${id}`),
}

export default api

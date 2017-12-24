import axios from 'axios';

const URL = 'http://localhost:3001'

function login(data) {
  return axios.post(`${URL}/login`, data);
};

function signup(data) {
  return axios.post(`${URL}/signup`, data);
};

function forgot(data) {
  return axios.post(`${URL}/forgot`, data);
};

function reset(data, token) {
  const headers = {'Authorization': token}
  const options = { headers }
  return axios.post(`${URL}/reset`, data, options)
};

function content(data) {
  const headers = {'Authorization': localStorage.getItem('jwt')}
  const options = { headers }
  return axios.post(`${URL}/content`, data, options)
}

export { signup, login, forgot, reset, content };

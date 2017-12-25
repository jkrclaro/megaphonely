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
  const payload = new FormData();
  payload.set('media', data.media);
  payload.set('message', data.message)
  payload.set('scheduleAt', data.scheduleAt)
  return axios.post(`${URL}/content`, payload, { headers })
}

export { signup, login, forgot, reset, content };

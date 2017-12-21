function alert(openAlert, response, color) {
  if (openAlert) {
    if (response.message === 'NetworkError when attempting to fetch resource.') {
      openAlert('We cannot perform that action right now. Please try again later.', 'danger')
    } else {
      openAlert(response.message, color)
    }
  } else {
    console.error(response)
  }
  return Promise.resolve('Done')
}

function login(account) {
  return fetch('http://localhost:3001/login', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(account)
  })
  .then(response => {
    return response.json()
    .then(data => {
      if (response.status === 200) {
        localStorage.setItem('jwt', data.token);
      } else {
        return Promise.reject(data)
      }
    })
  })
  .catch(error => Promise.reject(error))
}

function signup(account) {
  return fetch('http://localhost:3001/account', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(account)
  })
  .then(response => {
    return response.json()
    .then(data => {
      if (response.status === 200) {
        return Promise.resolve(account)
      } else {
        return Promise.reject(data)
      }
    })
  })
}

function forgotPassword(email) {
  return fetch('http://localhost:3001/forgot_password', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(email)
  })
  .then(response => {
    return response.json()
    .then(data => {
      if (response.status === 200) {
        return Promise.resolve(email)
      } else {
        return Promise.reject(data)
      }
    })
  })
}

module.exports = {
  alert: alert,
  signup: signup,
  login: login,
  forgotPassword: forgotPassword
}

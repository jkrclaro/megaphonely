import React from 'react';
import { withRouter } from 'react-router-dom';

import yup from 'yup';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

const LoginSchema = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Please enter an email address'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Please enter a password')
})

class LoginForm extends React.Component {
  render() {
    const { redirectToDashboard } = this.props;
    return (
      <Formik
        validationSchema={LoginSchema}
        initialValues={{
          email: 'johndoe@gmail.com', password: 'johndoe'
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          fetch('http://localhost:3001/login', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
          })
          .then(response => {
            return response.json()
            .then(data => {
              if (response.status === 200) {
                localStorage.setItem('jwt', data.token);
                if (redirectToDashboard) redirectToDashboard();
              } else {
                return Promise.reject(data.message)
              }
            })
          })
          .catch(error => setErrors(error))
          setSubmitting(false)
        }}
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type='email'
                name='email'
                placeholder='Email'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {touched.email && errors.email && <div className='error-input'>{errors.email}</div>}
            </FormGroup>
            <FormGroup>
              <Input
                type='password'
                name='password'
                placeholder='Password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {touched.password && errors.password && <div className='error-input'>{errors.password}</div>}
            </FormGroup>
            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Login
            </Button>
            <a href='/forgot_password'>Forgot password?</a>
            <br/>
            <span>{"Don't have an account?"} <a href='/signup'>Sign Up</a></span>
          </Form>
        )}
      />
    )
  }
}

export default withRouter(LoginForm)

const yup = require('yup');

const SignupValidator = yup.object().shape({
  firstName: yup.string().trim().max(100, 'First name must be fewer than 100 characters').required('Please enter your first name'),
  lastName: yup.string().trim().max(100, 'Last name must be fewer than 100 characters'),
  email: yup.string().email('Email is not valid').required('Please enter an email address'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Please enter a password')
});

const LoginValidator = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Please enter an email address'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Please enter a password')
});

const ForgotValidator = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Please enter an email address')
});

const ResetValidator = yup.object().shape({
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Please enter a password')
});

const ContentValidator = yup.object().shape({
  message: yup.string().trim().required('Please enter a message'),
  schedule: yup.date().min(new Date(), 'Cannot schedule in the past').required('Please enter a schedule'),
  networks: yup.array().required('You must select a network')
})

module.exports = {
  SignupValidator, LoginValidator, ForgotValidator, ResetValidator,
  ContentValidator
};

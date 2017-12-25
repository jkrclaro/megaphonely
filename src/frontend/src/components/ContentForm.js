import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';
import Flatpickr from 'react-flatpickr';

import { ContentValidator } from '../validators';
import { content } from '../apis';

class ContentForm extends React.Component {
  render() {
    const { redirect, token } = this.props;
    return (
      <Formik
        validationSchema={ContentValidator}
        initialValues={{
          message: 'Just know I mean it', scheduleAt: new Date()
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          content(values)
          .then(s => console.log('Success'))
          .catch(e => console.error('Error'))
        }}
        render={({
          values,
          errors,
          touched,
          setFieldValue,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type='textarea'
                name='message'
                placeholder='What do you want to share?'
                onChange={setFieldValue}
                onBlur={handleBlur}
                value={values.message}
              />
            </FormGroup>
            <FormGroup>
              <Input
                id='media'
                type='file'
                name='media'
                onChange={(event) => {
                  setFieldValue('media', event.currentTarget.files[0])
                }}
              />
            </FormGroup>
            <FormGroup>
              <Flatpickr data-enable-time value={values.scheduleAt}/>
            </FormGroup>
            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      />
    )
  }
}

export default withRouter(ContentForm)

import React from 'react';
import { Form, Field } from 'redux-form';
import Grid from '@material-ui/core/Grid';

const FilterForm = props => {

  const { handleSubmit, submitForm } = props;

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Grid container spacing={4}>
        <Grid item>
          <Field
            name="name"
            component="input"
            type="text"
            placeholder="Search by name"
          />
        </Grid>
      </Grid>
    </Form>
  );
};
export default FilterForm;
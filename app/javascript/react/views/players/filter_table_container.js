import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';


// Relative imports
import fetchPlayers from '../../store/player/actions/fetch_players';
import FilterForm from './filter_form';

const FilterTableContainer = props => {

  const { handleSubmit } = props;

  const submitForm = ({ name }) => {
    props.fetchPlayers({ name });
  }

  return (
    <FilterForm
      submitForm={submitForm}
      handleSubmit={handleSubmit}
    />
  );
}

const FilterTableReduxForm = reduxForm({
  form: 'PlayerFilterForm',
  onChange: (values, dispatch, props, previousValues) => {
    props.submit();
  }
})(FilterTableContainer);

const FilterTableConnectReduxForm = connect(
  null,
  { fetchPlayers }
)(FilterTableReduxForm);

export default FilterTableConnectReduxForm;
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import playerReducer from './player/reducers/player';

const rootReducer = combineReducers({
  form: formReducer,
  player: playerReducer
});

export default rootReducer;
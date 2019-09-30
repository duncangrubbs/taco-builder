import { createStore } from 'redux';
import updateState from './reducers/updateState';

const store = createStore(updateState);

export default store;

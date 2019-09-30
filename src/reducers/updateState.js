import { ADD_TACO } from '../actions/addTaco';
import { REMOVE_TACO } from '../actions/removeTaco';

const INITIAL_STATE = {
  tacos: [],
};

const updateState = (state = INITIAL_STATE, action) => {
  const { tacos: { length } } = state;
  const { tacos } = state;
  let newTaco;

  switch (action.type) {
    case ADD_TACO:
      // give each taco a ID (positive integer)
      newTaco = action.payload.taco;
      newTaco.id = ((length > 0)) ? state.tacos[0].id + 1 : 1;

      state.tacos.unshift(newTaco);
      return state;
    case REMOVE_TACO:
      for (let i = 0; i < tacos.length; i += 1) {
        if (tacos[i].id === action.payload.tacoID) {
          state.tacos.splice(i, 1);
        }
      }
      return state;
    default:
      return state;
  }
};

export default updateState;

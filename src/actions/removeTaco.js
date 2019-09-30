export const REMOVE_TACO = 'REMOVE_TACO';

export const removeTaco = (tacoID) => ({
  type: REMOVE_TACO,
  payload: tacoID,
});

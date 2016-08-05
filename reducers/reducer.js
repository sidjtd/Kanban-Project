'use strict';
import Immutable from 'immutable';
const initializedState = Immutable.List();

const redditReducer =
  (theState = initializedState, letsDoThis) => {
  let newerState = theState;
  switch(letsDoThis.type) {
    case 'SET_ITEMS':
      // console.log("reducer",letsDoThis.data);
      return Immutable.fromJS(letsDoThis.data);
    case 'DELETE_ITEM':
      // console.log("THIS ON DELETE!!!!",letsDoThis.index);
      return theState.delete(letsDoThis.index);
    default:
      return newerState;
    }
};
export default redditReducer;
import {combineReducers, configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({

});

const store = configureStore({ reducer: rootReducer })

export default store;
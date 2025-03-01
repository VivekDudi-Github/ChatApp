import {configureStore} from '@reduxjs/toolkit'
import authSlice from './reducer/auth';
import api from './api/api';


const store = configureStore({
  reducer : {
    auth : authSlice.reducer ,
    [api.reducerPath] : api.reducer
  } ,
  middleware : (defaultsMiddlewares) => [...defaultsMiddlewares() , api.middleware]
}) ;

export default store 
import {configureStore} from '@reduxjs/toolkit'
import authSlice from './reducer/auth';
import api from './api/api';
import miscSlice from './reducer/misc';
import headerSclice from './reducer/header';


const store = configureStore({
  reducer : {
    auth : authSlice.reducer ,
    header : headerSclice.reducer ,
    misc : miscSlice.reducer ,
    [api.reducerPath] : api.reducer ,
  } ,
  middleware : (defaultsMiddlewares) => [...defaultsMiddlewares() , api.middleware]
}) ;

export default store 
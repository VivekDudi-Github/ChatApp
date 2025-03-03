import {configureStore} from '@reduxjs/toolkit'
import authSlice from './reducer/auth';
import api from './api/api';
import miscSlice from './reducer/misc';


const store = configureStore({
  reducer : {
    auth : authSlice.reducer ,
    misc : miscSlice.reducer ,
    [api.reducerPath] : api.reducer ,
  } ,
  middleware : (defaultsMiddlewares) => [...defaultsMiddlewares() , api.middleware]
}) ;

export default store 
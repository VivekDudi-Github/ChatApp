import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name : 'auth' ,
  initialState : {
    user : null ,
    loader : true ,
  } ,

  reducers : {
    setUser : (state ,action) => {
      state.user = action.payload 
      state.loader = false  
    }
  }
}) ;

export default authSlice

export const {setUser} = authSlice.actions
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationsCount : 0
}

const headerSclice = createSlice({
  name : 'misc' ,
  initialState ,

  reducers : {
    setNotificationCount : (state , action) =>{
      state.notificationsCount = state.notificationsCount + action.payload
    } , 
    resetNotificationCount : (state , action) => {
      state.notificationsCount = 0
    }
  }
}) ;

export default headerSclice

export const {
  setNotificationCount , 
  resetNotificationCount ,
} = headerSclice.actions
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationsCount : 0 , 
  newMessageAlert : [{
    count : 0 ,
    roomID : '' ,
  }] ,
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
    } , 
    setNewMessageAlert : (state ,action) => {
      console.log('idk');
      
      const arr = state.newMessageAlert
      const index =  arr.findIndex(e => e.roomID === action.payload.roomID)
      if(index == -1) {
        arr.push({roomID : action.payload.roomID , count : 1})
      } else {
        arr[index].count ++ ;
      }
      state.newMessageAlert = arr ;
    } ,
    resetNewMessageAlert : (state ,action) => {
      const arr = state.newMessageAlert ;
      const index =  arr.findIndex(e => e.roomID === action.payload.roomID)
      if(index !== -1){
        arr[index].count = 0
      }
      state.newMessageAlert = arr ;
    }
  }
}) ;

export default headerSclice

export const {
  setNotificationCount , 
  resetNotificationCount ,
  resetNewMessageAlert , 
  setNewMessageAlert ,
} = headerSclice.actions
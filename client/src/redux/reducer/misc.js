import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNewGroup : false ,
  IsAddMember : false ,
  isNotitfication : false ,
  isMobileMenu : false ,
  isSearch : false ,
  isFileMenu : false ,
  isDeleteMenu : false ,
  uploadingLoader : false ,
  selectedDeleteChat : {
    roomId : '' ,
    groupChat : false
  }
}

const miscSlice = createSlice({
  name : 'misc' ,
  initialState ,

  reducers : {
    setIsNewGroup : (state , action) => {
      state.isNewGroup = action.payload ;
    } ,
    setIsAddMember : (state , action) => {
      state.IsAddMember = action.payload ;
    } ,
    setIsNotitfication : (state , action) => {
      state.isNotitfication = action.payload ;
    } ,
    setIsMobileMenu : (state , action) => {
      state.isMobileMenu = action.payload ;
    } , 
    setIsSearch : (state , action) => {
      state.isSearch = action.payload ;
    } ,
    setIsDeleteMenu : (state , action) => {
      state.isDeleteMenu = action.payload ;
    } ,
    setUploadingLoader : (state , action) => {
      state.uploadingLoader = action.payload ;
    } ,
    setSelectedDeleteChat : (state , action) => {
      state.selectedDeleteChat = action.payload ;
    }
  }
}) ;

export default miscSlice

export const {
  setIsAddMember ,
  setIsDeleteMenu ,
  setIsMobileMenuFriend,
  setIsNewGroup ,
  setIsNotitfication, 
  setIsSearch,
  setSelectedDeleteChat,
  setUploadingLoader ,
} = miscSlice.actions
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNewGroup : false ,
  IsAddMember : false ,
  isNotificationMenu : false ,
  isMobileMenu : false ,
  isSearchOpen : false ,
  isFileMenu : false ,
  isMessageMenu : false ,
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
    setIsNotitficationMenu : (state , action) => {
      state.isNotificationMenu = action.payload ;
    } ,
    setIsMobileMenu : (state , action) => {
      state.isMobileMenu = action.payload ;
    } , 
    setIsSearchOpen : (state , action) => {
      state.isSearchOpen = action.payload ;
    } ,
    setIsFileOpen : (state , action) => {
      state.isFileMenu = action.payload ;
    } ,
    setIsMessageMenu : (state , action) => {
      state.isMessageMenu = action.payload ;
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
  setIsMobileMenu,
  setIsNewGroup ,
  setIsNotitficationMenu, 
  setIsSearchOpen,
  setIsFileOpen ,
  setSelectedDeleteChat,
  setUploadingLoader ,
  setIsMessageMenu ,
} = miscSlice.actions
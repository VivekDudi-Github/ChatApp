import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react' ;

const api = createApi({
  reducerPath : 'api' ,
  baseQuery : fetchBaseQuery({baseUrl : '/api/v1'}) ,
  tagTypes : ['Chats' , 'User'] ,

  endpoints : (builder) => ({
    myChats : builder.query({
      query : () => ({
        url : '/chat/rooms' ,
        credentials : 'include'
      })
    }) ,

    SearchUsers : builder.query({
      query : (name) => ({
        url : `/user/search/?name=${name}` ,
        credentials : 'include' ,
      }) ,
      providesTags : ['User'] ,
    }) , 

    getNotification : builder.query({
      query : () => ({
        url : `/user/notifications` ,
        credentials : 'include' ,
      }) ,
      keepUnusedDataFor : 0 ,
    }) , 

    sendFreindRequest : builder.mutation({
      query : (data) => ({
        url : "/user/request" ,
        method : "PUT" ,
        credentials : "include"  ,
        body : data
      }) , 
      invalidatesTags : ["User"]
    }) ,

    AnswerFriendRequest :  builder.mutation({
      query : (data) => ({
        url : '/user/request' ,
        method : "PATCH" ,
        credentials : 'include'  , 
        body : data 
      }) ,
      invalidatesTags : ["User"]
    }) ,

    getRoomDetails : builder.query({
      query : ({room , populate =false}) => {
        let url = `/chat/${room}`
        if(populate) url = url+"?populate=true"

        return {
          url : url ,
          credentials : 'include' ,
        }} ,
      providesTags : ["Chats"] ,
    }) ,
    
    getMessages : builder.query({
      query : ({room , populate =false}) => {
        let url = `/chat/${room}`
        if(populate) url = url+"?populate=true"

        return {
          url : url ,
          credentials : 'include' ,
        }} ,
      providesTags : ["Chats"] ,
    }) ,

  })
})

export default api ;
export const { 
  useMyChatsQuery , 
  useLazySearchUsersQuery ,
  useSendFreindRequestMutation , 
  useAnswerFriendRequestMutation ,
  useGetNotificationQuery ,
  useGetRoomDetailsQuery ,
} = api
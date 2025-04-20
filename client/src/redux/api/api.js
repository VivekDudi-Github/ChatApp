import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react' ;

const api = createApi({
  reducerPath : 'api' ,
  baseQuery : fetchBaseQuery({baseUrl : '/api/v1'}) ,
  tagTypes : ['Chats' , 'User' , "Messages"] ,

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
      query : ({roomId , pageNo}) => ({        
          url : `/chat/message/${roomId}/?page=${pageNo}` ,
          credentials : 'include' ,
        }) ,
        providesTags : ((result , error ,{roomId , pageNo}) => 
          [{type : 'Messages' , id : `${roomId}-${pageNo}`}])
      }) ,

    SendAttachments :  builder.mutation({
      query : ({data , RoomId}) => {
        return {
        url : `/chat/message/${RoomId}` ,
        method : "POST" ,
        credentials : 'include'  , 
        body : data 
      }} ,
      invalidatesTags : ((result , error , {RoomId , pageNo}) => 
        [{type : 'Messages' , id : `${RoomId}-${pageNo}`}] )
    }) ,

    myGroup : builder.query({
      query : () => ({
        url : '/chat/my_group' ,
        credentials : 'include'
      }) , 
      invalidatesTags : ["Chats"]
    }) ,

    getMyFriends :  builder.query({
      query : ({room}) => {
        let url = room ?  `/user/friends/?room=${room}` : '/user/friends'
        return {
          url : url ,
          credentials : 'include' ,
          method : 'GET' ,
        }} ,
      providesTags : ["Chats"] ,
    }) ,

    CreatenewGroup : builder.mutation({
      query : ({name , members}) => ({
        url : '/chat/new_group' ,
        method : "POST" ,
        credentials : 'include'  , 
        body : {members , name} 
      }) ,
      invalidatesTags : ["Chats"]
    }) ,

    renameGroup : builder.mutation({
      query : ({room , name}) => ({
        url : `/chat/rename/${room}` ,
        method : "PUT" ,
        credentials : "include"  ,
        body : {name : name}
      }) , 
      invalidatesTags : ["Chats"]
    }) ,

    removeGroupMembers : builder.mutation({
      query : ({room , members = []}) => ({
        url : `/chat/members/${room}` ,
        method : "DELETE" ,
        credentials : "include"  ,
        body : {members : [...members]}
      }) , 
      invalidatesTags : ["Chats"]
    }) ,

    addGroupMembers : builder.mutation({
      query : ({room , members = []}) => ({
        url : `/chat/members/${room}` ,
        method : "PUT" ,
        credentials : "include"  ,
        body : {members : [...members]}
      }) , 
      invalidatesTags : ["Chats"]
    }) ,

    availableFriends : builder.query({
      query: (room) => ({
        url : room ? 'user/friends/?room='+room : 'user/friends'  ,
        credentials : 'include' ,
      }) , 
      invalidatesTags : ["User"]
    }) ,

    deleteGroup : builder.mutation({
      query : (room) => ({
        url : `/chat/room/${room}` ,
        credentials : 'include' ,
        method : 'DELETE'
      }) ,
      invalidatesTags : ['Chats']
    }) , 

    deleteMessage : builder.mutation({
      query : ({messageId , roomId , pageNo}) => ({
        url : `/chat/message/${messageId}` ,
        credentials : 'include' ,
        method : 'DELETE'
      }) ,
      invalidatesTags : ((result , error ,{roomId , pageNo}) => [
        {type : 'Messages' , id : `${roomId , pageNo}` }
      ])
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
  useGetMessagesQuery ,
  useSendAttachmentsMutation ,
  useMyGroupQuery ,
  useGetMyFriendsQuery ,
  useCreatenewGroupMutation ,
  useRenameGroupMutation ,
  useAvailableFriendsQuery ,

  useDeleteMessageMutation ,

  useDeleteGroupMutation ,
  useRemoveGroupMembersMutation ,
  useAddGroupMembersMutation ,
} = api
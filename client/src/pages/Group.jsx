import React, { lazy, Suspense, useEffect, useState } from 'react'
import {Backdrop, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography} from '@mui/material'
import {Add as AddIcon, Delete as DeleteIcon, Done, Edit as EditIcon, KeyboardBackspaceOutlined, Menu as MenuIcon, MenuOpen, OpenInBrowser} from '@mui/icons-material'
import {useNavigate, useSearchParams} from 'react-router-dom'
import { memo } from 'react';
import { StyledLink } from '../components/styles/StylesComponent';
import AvatarCard from '../shared/AvatarCard'
import { sampleGroup, sampleUser } from '../shared/data';
import UserItem from '../shared/UserItem';
import { useGetRoomDetailsQuery, useMyGroupQuery, useRenameGroupMutation } from '../redux/api/api';
import { UseAsyncMutation, useErrors } from '../components/hook/hooks';
import { LayoutLoader } from '../components/layout/Loaders';
const DeleteDialog = lazy(() => import('../shared/DeleteDialog'))
const AddMemberDialog = lazy(() => import('../shared/AddMemberDialog'))


function Group() {
const navigate = useNavigate() ;
const CurrentGroup_id = useSearchParams()[0].get('groups')


const [isMobileOpen, setisMobileOpen] = useState(false) ;
const [IsEdit , setIsEdit] = useState(false) ;

const [members, setMembers] = useState([]) ;
const [AddMember, setAddMember] = useState(false)

const [GroupName , setGroupName] = useState('') ;
const [NewGroupName , setNewGroupName] = useState('') ;


const[ConfirmDeleteDialog , setConfirmDeleteDialog] = useState(false)


const myGroups = useMyGroupQuery() ;
const groupDetails = useGetRoomDetailsQuery({room : CurrentGroup_id , populate : true} , {skip : !CurrentGroup_id })
const [renameGroupApi , renameGroupIsLoading] = UseAsyncMutation(useRenameGroupMutation)


const errors = [
  {
  isError : myGroups?.isError ,
  error : myGroups?.error?.data?.error ,
  } ,
  {
    isError : groupDetails.isError ,
    error : groupDetails?.error ,
    fallback : groupDetails.isError ? ()=> navigate('/') : null ,
    toastText : groupDetails.isError ? groupDetails?.error?.data?.error : null
  }
]

useErrors(errors)

useEffect(() => {
  if(groupDetails.data){
    setGroupName(groupDetails.data.data.name)
    setMembers(groupDetails?.data?.data?.members)
  }
  return () => {
    setGroupName('')
    setMembers([])
    setIsEdit(false)
  }
} , [groupDetails.data])


const handleMobile = () => {
  setisMobileOpen(prev => !prev)
} 

const updateGroupName = () => {
  renameGroupApi("Updating Group Name" ,{room : CurrentGroup_id , name : NewGroupName})
  setGroupName(NewGroupName)
  setIsEdit(false)
  myGroups.refetch()
}

const DeleteGroupHandler = () => {
  
}

const addMembersHandler = () => {
  setAddMember(true)
}

const removeMemberHandler = (id) =>{

} 


useEffect(() => {
  if(CurrentGroup_id && !myGroups.isLoading ){

  const group =  myGroups.data.data.filter(g => g._id == CurrentGroup_id)
  

  setGroupName(group[0].name)
  setNewGroupName(group[0].name)
}
  return () => {
    setGroupName('')
    setNewGroupName('')
    setIsEdit(false)
  }
} , [CurrentGroup_id , myGroups.isLoading])


const iconBtns = 
  <>
    <Tooltip title='back'>
      <IconButton
      sx={{
        position : 'absolute' , 
        top : '1rem' , 
        right : '1rem' ,
        color : 'black' , 
        ":hover" : {
          bgcolor : 'black' ,
          color : 'white'
        }
      }}
      onClick={handleMobile}
      >
        <MenuIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title='back'>
      <IconButton
      sx={{
        position : 'absolute' , 
        top : '1rem' , 
        left : '1rem' ,
        color : 'rgb(200,200,200)' , 
        bgcolor : 'black' , 
        ":hover" : {
          bgcolor : 'black'
        }
      }}
      onClick={() => navigate('/')}
      >
        <KeyboardBackspaceOutlined />
      </IconButton>
    </Tooltip>
  </>



  return myGroups.isLoading? (
    <LayoutLoader />
  ) : (
    <Grid container height={'100vh'}>
      <Grid item 
      sx={{
        display : {
          xs : 'none' , 
          sm : 'block' 
        } ,
        color : 'white' ,
        bgcolor : '#000'
      }}
      sm={4}
      >
        <GroupList myGroup={myGroups?.data?.data} CurrentGroup_id={CurrentGroup_id} />
      </Grid>

      {CurrentGroup_id ?
      <>
      <Grid item xs={12} sm={8}
        sx={{
          display : 'flex' , 
          flexDirection : 'column' ,
          position : 'relative' , 
          padding : ' 1rem 3rem' , 
          alignItems : 'center'
        }}>

        {/* buttons */}
        {iconBtns}


        {/* Group Name */}
        <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} padding={'3rem'} spacing={'1rem'}>
          {IsEdit ? 
          <>
            <TextField value={NewGroupName}  onChange={e => setNewGroupName(e.target.value)}/>
            <IconButton onClick={updateGroupName} disabled={renameGroupIsLoading} ><Done/></IconButton>
          </> 
          :
          <>
            <Typography variant='h5'>{GroupName}</Typography>
            <IconButton onClick={() => setIsEdit(true)}><EditIcon/></IconButton>
          </>}
        </Stack>


        {/* Members */}
        <Typography alignSelf={'flex-start'} margin={'1rem'} variant='body1'>Members</Typography>
        <Stack boxSizing={'border-box'} maxWidth={'45rem'} margin={'0 0 1rem'} width={'100%'} padding={{ sm : '1rem' ,xs :'0' ,md:'1rem 4rem'}}  height={'50vh'} overflow={'auto'}>
          {members.map((u) => (
            <UserItem user={u} key={u._id} UserAdded handler={removeMemberHandler}
            styling={{
                boxShadow : ' 0 0 0.5rem rgba(0,0,0,0.5)' ,
                padding : '1rem' , 
                borderRadius : '1rem' , 
                bgcolor : 'black' , 
                color : 'white' ,
                hover : {
                  bgcolor : 'none'
                }
              }}
            />
          ))}
        </Stack>
        <Stack p={{ xs :'0' ,sm : '1rem',md:'1rem 4rem'}} sx={{transitionDuration : '200ms'}} gap={'5px'} direction={'row'}>
          <Button size='large' variant='contained' sx={{ fontSize : '0.8rem' , transitionDuration : '200ms'}} startIcon={<AddIcon/>} onClick={addMembersHandler}>Add Members</Button>
          <Button size='large' color='error' sx={{bgcolor : '#ddd' , fontSize : '0.8rem' , transitionDuration : '200ms'}} startIcon={<DeleteIcon/>} onClick={() => setConfirmDeleteDialog(true)}>Delete Group</Button>
          
        </Stack>
      </Grid>

      {
        ConfirmDeleteDialog && 
        <Suspense fallback={<Backdrop />}>
          <DeleteDialog handleClose={() => setConfirmDeleteDialog(false)} deleteHandler={DeleteGroupHandler} open={ConfirmDeleteDialog} >
            Do you Really want to delete this group ?
          </DeleteDialog>
        </Suspense>
      }

      {
        AddMember && 
        <Suspense fallback={<Backdrop />}>
          <AddMemberDialog handleClose={() => setAddMember(false)} deleteHandler={DeleteGroupHandler} open={ConfirmDeleteDialog} />
        </Suspense>
      }</>
    :
      <></>
    }

      <Drawer 
      sx={{
        display : {
          xs : 'block' , 
          sm : 'none' ,
        } , 
      }} open={CurrentGroup_id ? isMobileOpen : true} onClose={() => setisMobileOpen(false)}>
      <GroupList w={'50vw'} myGroup={myGroups?.data?.data} CurrentGroup_id={CurrentGroup_id} />
      </Drawer>
    </Grid>
  )
}

export default Group


const GroupList = ({w='100%' , myGroup = [] , CurrentGroup_id}) => {
  return <Stack bgcolor={'black'} color={'white'} overflow={'auto'} height={'100%'} width={w} >
    {myGroup.length > 0 ? 
    myGroup.map((g , index) => <GeoupListItems group={g} CurrentGroup_id={CurrentGroup_id} key={index}/> )
    : 
    <Typography p={'1rem'} textAlign={'center'}>No Group</Typography>
    }
  </Stack>
}



const GeoupListItems =memo (({group , CurrentGroup_id}) => {
  const {name , avatar , _id} = group ;

  return (
  <StyledLink to={`?groups=${_id}`} onClick={e => {if(CurrentGroup_id ===_id)  e.preventDefault()}  }>
    <Stack 
    sx={{
      ":hover":{
        bgcolor : 'rgba(255,255,255,0.3)'
      } ,
      transitionDuration : '200ms' ,
      padding : '3px'
    }} 
    direction={'row'} 
    spacing={'1rem'} alignItems={'center'}>
      <AvatarCard avatar={[avatar]}/>
      <Typography>{name}</Typography>
    </Stack>
  </StyledLink>)
})



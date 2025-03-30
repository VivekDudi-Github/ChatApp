import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, TextField, Typography } from '@mui/material';
import UserItem from '../../shared/UserItem';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {useCreatenewGroupMutation, useGetMyFriendsQuery} from '../../redux/api/api'
import {useErrors , UseAsyncMutation } from '../hook/hooks'
import {setIsNewGroup} from '../../redux/reducer/misc'
import toast from 'react-hot-toast';

function NewGroup() {
  const dispatch = useDispatch() ;
  const {isNewGroup} = useSelector(state => state.misc)

  const {data  ,isError , error ,isLoading} = useGetMyFriendsQuery('') ;

  useErrors([{isError , error}])

  const [createNewGroup , newGroupIsLoading  ] = UseAsyncMutation(useCreatenewGroupMutation) ; 
  
  
  
  
  const [groupName , setGroupName] = useState('') ;
  const [members, setMembers] = useState([]) ;


  let selectMemeberHandler = (id) => {
    setMembers((prev) => prev.includes(id) ? 
    prev.filter(i => i !== id) : 
    [...prev , id]
  )} ;
  

  const submitHandler =async () => {
    if(!groupName) {return toast.error('Please provide the name for group.')} 
    if(members.length < 2) {return toast.error('Please select atleast two members to create a new group.')}
    console.log("shuru");
    
    await createNewGroup('Creating new group' ,{name : groupName , members : members})
    
    closeHandler()
  } ;
  
  const closeHandler = () => dispatch(setIsNewGroup(false))

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs : '1rem' , sm : '2rem'}} sx={{width : '25rem' }} spacing={'2rem'} >
        <DialogTitle textAlign={'center'} variant='h5'>
          Create New Group
        </DialogTitle>

        <TextField label='Group Name' placeholder='New Group' value={groupName} onChange={e => setGroupName(e.target.value)} />

        <Typography>Members</Typography>
        {isLoading ?(
          <Skeleton />
        ) : (
          <Stack>
            {data.data.map((u , i) => {
            return (
              <UserItem user={u} key={i} UserAdded={members.includes(u._id)} handler={() =>selectMemeberHandler(u._id)} />
            )
          })}
          </Stack>
        )}
          <Stack direction={'row'} justifyContent={'space-between'} margin={'0.25rem'}>
            <Button variant='text' onClick={closeHandler} disabled={newGroupIsLoading}  color='error'>Cancel</Button>
            <Button variant='contained' onClick={submitHandler} disabled={newGroupIsLoading} >Create</Button>
          </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup

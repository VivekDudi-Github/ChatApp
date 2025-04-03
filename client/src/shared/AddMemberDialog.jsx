import { Button, Dialog, DialogActions, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React , {useEffect, useState} from 'react'
import UserItem from './UserItem'
import { useAvailableFriendsQuery} from '../redux/api/api'
import toast from 'react-hot-toast'
import { useErrors } from '../components/hook/hooks'

function AddMemberDialog({handleClose , AddNewMemberHandler , room}) {
  const [members, setMembers] = useState([])
  const [users, setUsers] = useState([])

  const {data , isLoading, isError , error , refetch} = useAvailableFriendsQuery(room )
  
  
  useErrors([{isError , error}])
  
  useEffect(() => {
    if(data){
      setUsers(data.data)
  }
  } , [data])

  useEffect(() => {refetch()} , [])

  const AddMemberSubmitHandler = () => {
    AddNewMemberHandler(members) ;
    closeHandler() ;
  } ;
  const closeHandler = () => {
    setMembers([])
    handleClose() ;  
  } ;

  const selectMemberHandler = (id) => {
    setMembers((prev) => prev.includes(id) ? 
    prev.filter(i => i !== id) : 
    [...prev , id]
  )}

  

  return (
    <Dialog open onClose={closeHandler}>
      <Stack minWidth={'20rem'} p={'1rem 0'}>
        <DialogTitle textAlign={'center'}>Add Members</DialogTitle>

        {isLoading ? (<Skeleton/>
          ) : (
            <Stack>
            { users.length > 0 ? 
            users.map((u) => (
              <UserItem key={u._id} user={u} UserAdded={members.includes(u._id)} handler={selectMemberHandler} />
            )) 
            :
            <Typography textAlign={'center'} margin={'2rem'} >No friends</Typography>
            
          }
          </Stack>
          )
        }

        <DialogActions >
          <Button color='error' onClick={closeHandler}>Cancel</Button>
          <Button color='primary' variant='contained' onClick={AddMemberSubmitHandler} disabled={ users.length == 0} >Add Members</Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialog
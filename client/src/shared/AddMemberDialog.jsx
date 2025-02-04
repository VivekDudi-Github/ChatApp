import { Button, Dialog, DialogActions, DialogTitle, Stack, Typography } from '@mui/material'
import React , {useEffect, useState} from 'react'
import { sampleUser } from './data'
import UserItem from './UserItem'

function AddMemberDialog({isLoading ,handleClose , AddNewMemberHandler , chat_id}) {
  const [members, setMembers] = useState([])
  const [users ,setUsers] = useState(sampleUser) 

  
  const AddMemberSubmitHandler = () => {} ;
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

        <Stack>
          { users.length > 0 ? 
          users.map((u) => (
            <UserItem key={u.user_id} user={u} UserAdded={members.includes(u.user_id)} handler={selectMemberHandler} />
          )) 
          :
          <Typography textAlign={'center'} margin={'2rem'} >No friends</Typography>
          
        }
        </Stack>
        <DialogActions >
          <Button color='error' onClick={closeHandler}>Cancel</Button>
          <Button color='primary' variant='contained' onClick={AddMemberSubmitHandler} disabled={isLoading || users.length == 0} >Add Members</Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialog
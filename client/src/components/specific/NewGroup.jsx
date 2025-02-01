import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, TextField, Typography } from '@mui/material';
import UserItem from '../../shared/UserItem';
import { sampleUser } from '../../shared/data';
import { useState } from 'react';
function NewGroup() {
  const users = sampleUser
  
  const [groupName , setGroupName] = useState('')
  const [openDialog , setopenDialog] = useState(true) ;
  const [members, setMembers] = useState([])

  let selectMemeberHandler = (id) => {
    setMembers((prev) => prev.includes(id) ? 
    prev.filter(i => i !== id) : 
    [...prev , id]
  )} ;
  
  const submitHandler = () => {} ;
  return (
    <Dialog open={openDialog}>
      <Stack p={{ xs : '1rem' , sm : '2rem'}} sx={{width : '25rem' }} spacing={'2rem'} >
        <DialogTitle textAlign={'center'} variant='h5'>
          Create New Group
        </DialogTitle>

        <TextField label='Group Name' placeholder='New Group' value={groupName} onChange={e => setGroupName(e.target.value)} />

        <Typography>Members</Typography>
          <Stack>
            {users.map((u , i) => {
            return (
              <UserItem user={u} key={i} UserAdded={members.includes(u.user_id)} handler={() =>selectMemeberHandler(u.user_id)} />
            )
          })}
          </Stack>

          <Stack direction={'row'} justifyContent={'space-between'} margin={'0.25rem'}>
            <Button onClick={() => setopenDialog(false)} variant='text' color='error'>Cancel</Button>
            <Button variant='contained'>Create</Button>
          </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup

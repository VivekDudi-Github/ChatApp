import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, TextField, Typography } from '@mui/material';
import UserItem from '../../shared/UserItem';
import { sampleUser } from '../../shared/data';
function NewGroup() {
  const users = sampleUser
  let selectMemeberHandler = () => {}
  return (
    <Dialog open>
      <Stack p={{ xs : '1rem' , sm : '3rem'}} sx={{width : '25rem' }} spacing={'2rem'} >
        <DialogTitle textAlign={'center'} variant='h4'>
          New Group
        </DialogTitle>

        <TextField />

        <Typography>Members</Typography>
          <Stack>
            {users.map((u , i) => {
            return (
              <UserItem user={u} key={i} handler={selectMemeberHandler} />
            )
          })}
          </Stack>

          <Stack direction={'row'} margin={'0.25rem'}>
            <Button variant='text' color='error'>Cancel</Button>
            <Button variant='contained'>Create</Button>
          </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup

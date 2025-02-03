import { Button, Dialog, DialogActions, DialogTitle, Stack } from '@mui/material'
import React from 'react'
import { sampleUser } from './data'
import UserItem from './UserItem'

function AddMemberDialog({isLoading , AddNewMemberHandler , chat_id}) {
  return (
    <Dialog open>
      <Stack minWidth={'20rem'} p={'1rem 0'}>
        <DialogTitle textAlign={'center'}>Add Members</DialogTitle>

        <Stack>
          {sampleUser.map((u) => (
            <UserItem key={u.user_id} user={u} UserAdded={null} handler={AddNewMemberHandler} />
          ))}
        </Stack>
        <DialogActions >
          <Button color='error'>Cancel</Button>
          <Button color='primary' variant='contained' onClick={AddNewMemberHandler} disabled={isLoading}>Add Members</Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialog
import { Dialog, DialogTitle, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import UserItem from '../../shared/UserItem'
import {sampleUser} from '../../shared/data'

function Search() {
const [users , setUsers] = useState(sampleUser)
function addFriendHandler(params) {
}
const IsLoadingSendFreindRequest = false

  const [searchValue , setSearchValue] = useState('')
  return (
    <Dialog open>
      <Stack p={'2rem'} direction={'column'} width={'25rem'}>
        <DialogTitle textAlign={'center'}>
          Find People
        </DialogTitle>
        <TextField 
        label=''
        variant='outlined'
        size='small'
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        />

        <List>
          {users.map((u , i) => {
            return (
              <UserItem user={u} key={i} handler={addFriendHandler} handlerIsLoading={IsLoadingSendFreindRequest}/>
            )
          })}
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search
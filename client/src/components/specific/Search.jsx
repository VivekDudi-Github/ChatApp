import { Dialog, DialogTitle, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserItem from '../../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearchOpen } from '../../redux/reducer/misc'
import { useLazySearchUsersQuery } from '../../redux/api/api'

function Search() {
  const dispatch = useDispatch() ;
  const {isSearchOpen} = useSelector(state => state.misc )
  
  const [users , setUsers] = useState([])
  const [searchValue , setSearchValue] = useState('')
  const addFriendHandler = () => {}
  const IsLoadingSendFreindRequest = false ;


  const [searchUser] = useLazySearchUsersQuery()

  useEffect(() => {
    const timoutId = setTimeout(() => {
      searchUser(searchValue)
      .then((res) => setUsers(res.data.data))
      .catch((e) => console.log(e)
      )
    } , 1000)
    
    return () => {clearTimeout(timoutId)}
  } , [searchValue])

  return (
    <Dialog  open={isSearchOpen} onClose={() => dispatch(setIsSearchOpen(false))} >
      <Stack p={'2rem'} direction={'column'} width={'25rem'} >
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

        <div style={{transition : 'height 0.3s ease-in-out' , height : users.length * 60 + 'px'}} >
          {users.map((u , i) => {
            return (
              <UserItem user={u} key={i} handler={addFriendHandler} handlerIsLoading={IsLoadingSendFreindRequest}/>
            )
          })}
        </div>
      </Stack>
    </Dialog>
  )
}

export default Search
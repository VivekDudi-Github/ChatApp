import { ListItem, ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileOpen } from '../../redux/reducer/misc'
import { Image } from '@mui/icons-material';

function FileMenu({anchorEl}) {
  const dispatch = useDispatch() ;
  const fileOpen = useSelector(state => state.misc.isFileMenu) ;


  const handleFileClose = () => {
    dispatch(setIsFileOpen(false))
  }


  return (
    <Menu anchorEl={anchorEl} open={fileOpen} onClose={handleFileClose}    >
      <div style={{width : '10rem' ,}}>
        <MenuList>
          
          <MenuItem>
            <Tooltip title={'Image'}>
              <Image/>
            </Tooltip>
            <ListItemText style={{marginLeft : '0.5rem'}}>Image</ListItemText>
            <input type="file" multiple accept='image/png , image/jpeg , image/gif' style={{display : 'none'}} />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  )
}

export default FileMenu
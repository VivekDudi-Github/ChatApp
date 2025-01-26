import React from 'react'
import {AppBar, Box, IconButton, Toolbar, Tooltip, Typography} from '@mui/material'
import {Add as AddIcon, Group as GroupIcon, Menu as MenuIcon, Search as SearchIcon} from '@mui/icons-material'

function Header() {
  const handleMobile = () => {}
  const openNewGroup = () => {}
  const openSearchDialog = () => {}
  const NavigateToGroup = () => {} 

  return (
    <Box sx={{flexGrow : '1' }} height={'4rem'}>
      
      <AppBar position='static' sx={{
        bgcolor : '#ea7070'
      }} >
        
        <Toolbar>
          <Typography variant='h6' sx={{
            display : { xs : 'none' , sm : 'block'}
          }} 
          >
            Mail.com
          </Typography>
          
          <Box  sx={{
            display : { xs : 'block' , sm : 'none'}
          }} 
          >
            <IconButton color='inherit' onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Box sx={{
            flexGrow : 1
          }} />

          <Box>
            <Tooltip title='Search'>
              <IconButton 
              color='inherit'
              size='large'
              onClick={openSearchDialog}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='New Group'>
              <IconButton 
              color='inherit'
              size='large'
              onClick={openNewGroup}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Manage Group'>
              <IconButton 
              color='inherit'
              size='large'
              onClick={NavigateToGroup}
              >
                <GroupIcon />
              </IconButton>
            </Tooltip>
          </Box>

        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
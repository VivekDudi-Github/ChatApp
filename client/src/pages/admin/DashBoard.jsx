import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Widgets} from '@mui/icons-material'
import { CurvButton, StyledSearchFeild } from '../../components/styles/StylesComponent'

import moment from 'moment'

function DashBoard() {
  return (
    <AdminLayout>
        <Container component={'main'}>
          {AppBar}

          <Stack> Char Area</Stack>

          {Widgets}

        </Container>
    </AdminLayout>
  )

}

const AppBar = (
  <Paper elevation={3} sx={{ position : 'relative', padding : '2rem' , margin : '4rem 0 1rem 0' , borderRadius : '1rem'}}>
    <Stack alignItems={'center'} flexWrap={'wrap'}  spacing={'0.5rem'} direction={'row'} >
      <AdminPanelSettingsIcon sx={{fontSize : '2rem'}}/>
      <StyledSearchFeild  placeholder='Search...'/>
      <Box flexGrow={1} />
      <CurvButton >Search</CurvButton>


      <Typography sx={{fontSize : '0.75rem' , color : '#888' ,right : '2rem' , bottom : '0.7rem' , position : 'absolute'}}>
        {moment().format('MMMM DD YYYY , h:mm a')}
      </Typography>

    </Stack>
  </Paper>
) 

export default DashBoard
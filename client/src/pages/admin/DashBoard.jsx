import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Person as PersonIcon} from '@mui/icons-material'
import { CurvButton, StyledSearchFeild } from '../../components/styles/StylesComponent'

import moment from 'moment'
import { DoughnutChart, LineChart } from '../../components/specific/Chart'

function DashBoard() {
  return (
    <AdminLayout>
        <Container component={'main'}>
          {AppBar}

          <Stack direction={'2rem'} spacing={'2rem'} flexWrap={'wrap'}> 
            <Paper
            elevation={3}
            sx={{
              padding : '2rem 3.5rem' ,
              borderRadius : '1rem' ,
              maxWidth : '45rem' , 
              width : '100%'
            }}>
              <Typography variant='h5'>Last Messages</Typography>
              <LineChart />
            </Paper>

            <Paper
            elevation={3}
            sx={{
              padding : '1rem' ,
              borderRadius : '1rem' ,
              display : 'flex' ,
              maxWidth : '25rem' , 
              width : '100%' ,
              position: 'relative' ,
              alignItems: 'center' , 
              justifyContent : 'center' ,
              height : '25rem'
            }}>
                
              <DoughnutChart />
              <Stack 
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
              >
                <GroupIcon /> <Typography>vs</Typography>

                <PersonIcon/>  
              </Stack>

            </Paper>
          </Stack>

          <Stack 
           direction={{
            xs: "column",
            sm: "row",
          }}
          spacing="2rem"
          justifyContent="space-between"
          alignItems={"center"}
          margin={"2rem 0"}
          >
            <Widgets title={'users'} value={34} icon={<PersonIcon/>}/>
            <Widgets title={'Chats'} value={35} icon={<GroupIcon/>}/>
            <Widgets title={'Messages'} value={455} icon={<MessageIcon/>} />
          </Stack>

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

const Widgets = ({title , icon, value}) => (
  
    <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1.5rem",
      width: {
        sm : '33%' ,
        xs : '100%' ,
      } 
    }}
      >
      <Stack alignItems={"center"} spacing={"1rem"}>
        <Typography
          sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid rgba(0,0,0,0.9)`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          }} >
          {value}
        </Typography>
        <Stack>
          {icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
)
export default DashBoard
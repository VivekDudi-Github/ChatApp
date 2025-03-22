import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileOpen, setUploadingLoader } from '../../redux/reducer/misc'
import { AudioFile,  FileUpload , Image,  VideoCameraFront,  } from '@mui/icons-material';
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../../redux/api/api';

function FileMenu({anchorEl ,RoomId}) {
  const VideoRef = useRef(null) ;
  const AudioRef = useRef(null) ;
  const ImageRef = useRef(null) ;
  const OtherFileRef = useRef(null) ;

  const dispatch = useDispatch() ;
  const fileOpen = useSelector(state => state.misc.isFileMenu) ;


  const [sendAttachments] = useSendAttachmentsMutation()


  const RefClick = ref => ref.current.click() ;

  const fileChangeHandler = async(e , key) => {
    const files = Array.from(e.target.files) ;

    if(files.length <= 0) return ;
    
    if(files.length > 5) return toast.error(`You can only upload upto 5 ${key} at a time`)
  
    dispatch(setUploadingLoader(true))

    const toastId  = toast.loading(`Sending ${key}`)
    dispatch(setIsFileOpen(false))
  
    try {
      const myForm = new FormData();
      files.forEach((file) => {  
        myForm.append("files", file); 
      });

      const res = await sendAttachments({data : myForm , RoomId })

      if(res.data){
        toast.success(`${key} sent successfully` , {id : toastId})
      }else{
        toast.error(`${key} failed to send` , {id : toastId})
      }


    } catch (error) {
      toast.error(error , {id : toastId})
    } finally {
      dispatch(setUploadingLoader(false))
    }  
  } 

  const handleFileClose = () => {
    dispatch(setIsFileOpen(false))
  }
  

  return (
    <Menu anchorEl={anchorEl} open={fileOpen} onClose={handleFileClose}    >
      <div style={{width : '10rem' ,}}>
        <MenuList>
          
          <MenuItem onClick={() => RefClick(ImageRef)}>
            <Tooltip title={'Image'}>
              <Image/>
            </Tooltip>
            <ListItemText style={{marginLeft : '0.5rem'}}>Image</ListItemText>
            <input 
              type="file" 
              multiple accept='image/png , image/jpeg , image/jpg , image/gif' style={{display : 'none'}} 
              onChange={(e) => fileChangeHandler(e , 'image')}
              ref={ImageRef}
            />
          </MenuItem>

          <MenuItem onClick={() => RefClick(AudioRef)}>
            <Tooltip title={'audio'}>
              <AudioFile/>
            </Tooltip>
            <ListItemText style={{marginLeft : '0.5rem'}}>Audio</ListItemText>
            <input 
              type="file" 
              multiple accept='audio/mp3 , audio/wav , audio/mpeg , audio/ogg , ' style={{display : 'none'}} 
              onChange={(e) => fileChangeHandler(e , 'audio')}
              ref={AudioRef}
            />
          </MenuItem>

          <MenuItem onClick={() => RefClick(VideoRef)}>
            <Tooltip title={'Video'}>
              <VideoCameraFront/>
            </Tooltip>
            <ListItemText style={{marginLeft : '0.5rem'}}>Video</ListItemText>
            <input 
              type="file" 
              multiple accept='video/mp4' style={{display : 'none'}} 
              onChange={(e) => fileChangeHandler(e , 'video')}
              ref={VideoRef}
            />
          </MenuItem>

          <MenuItem onClick={() => RefClick(OtherFileRef)}>
            <Tooltip title={'Other File'}>
              <FileUpload/>
            </Tooltip>
            <ListItemText style={{marginLeft : '0.5rem'}}>Files</ListItemText>
            <input 
              type="file" 
              multiple accept='*' style={{display : 'none'}} 
              onChange={(e) => fileChangeHandler(e , 'file')}
              ref={OtherFileRef}
            />
          </MenuItem>


        </MenuList>
      </div>
    </Menu>
  )
}

export default FileMenu
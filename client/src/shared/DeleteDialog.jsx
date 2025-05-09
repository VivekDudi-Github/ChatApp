import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

function DeleteDialog({children  , openDelete = false , handleClose , deleteHandler , item}) {
  return (
    <Dialog open={openDelete} onClose={handleClose}>
      <DialogTitle>
        Confirm Delete {item && item}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {children}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button color={'primary'} onClick={handleClose}>Cancel</Button>
        <Button color='error' onClick={deleteHandler} >Confirm</Button>
      </DialogActions>

    </Dialog>
  )
}

export default DeleteDialog
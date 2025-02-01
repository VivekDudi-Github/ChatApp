import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

export const VisuallyHiddenInput = styled('input')({
    border : 0 , 
    clip : 'rect( 0 0 0 0 )', 
    height : 1 , 
    margin : -1 , 
    overflow : 'hidden' , 
    padding : 0  , 
    position : "absolute" , 
    whiteSpace : "nowrap"  , 
    width : 1 
})

export const StyledLink = styled(LinkComponent)({
    textDecoration : 'none' , 
    color : "inherit" , 
    padding : '1 rem' ,
    ":hover" : {
        textDecoration : '#f0f0f0'
    } 
})

export const InputBox = styled('input')`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 2.75rem;
  border-radius: 1.5rem;
  background-color: rgba(0,0,0);
  color : rgb(200,200,200)
`
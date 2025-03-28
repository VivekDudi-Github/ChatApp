import React from 'react'
import { BouncingSkeleton } from '../components/styles/StylesComponent'

function TypingLoader() {
  return (
    <div style={{
      display : 'flex' ,
      justifyContent : 'row' ,
      gap : '10px' ,
      color : 'black' , 
      borderRadius : '5px' , 
      position : 'sticky' ,
      bottom : '0px' , 
      left : '5%' ,
      zIndex : '100' , 
    }}>
      <BouncingSkeleton
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        style={{
          animationDelay: "0.3s",
        }}
      />
      <BouncingSkeleton
        style={{
          animationDelay: "0.5s",
        }}
      />
      <BouncingSkeleton
        style={{
          animationDelay: "0.7s",
        }}
      />
      
      
    </div>

  )
}

export default TypingLoader

import React from 'react'
import {Helmet} from 'react-helmet-async'

function Title({Title = 'Chating..' , Description = 'Chat App'}) {
  return (
    <Helmet>
      <title>
        {Title}
      </title>
      <meta  name='description' content={Description}/>
    </Helmet>
  )
}

export default Title
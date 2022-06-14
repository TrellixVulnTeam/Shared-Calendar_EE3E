import React from 'react'
import styledComponents from 'styled-components'

const AlertMessage = styledComponents.div`
    text-align: center;
    color: red;
    border-radius: 5px;
    font-size: 12px;
    margin-top: 8px;
`

function Alert({alertMessage}) {
  return (
    <AlertMessage>{alertMessage}</AlertMessage>
  )
}

export default Alert
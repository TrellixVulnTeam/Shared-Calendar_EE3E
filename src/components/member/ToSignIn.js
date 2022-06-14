import React, { useState } from 'react'
import styledComponents from 'styled-components'
import { Link, useNavigate } from "react-router-dom";

const SignInUp = styledComponents.div`
    margin-top: 60px;
`

const Span = styledComponents.span`
    color: ${props => props.active ? '#FFFFFF' : 'rgba(255,255,255,0.75);'};
    font-weight: ${props => props.active ? 'bold' : ''}
`

const linkStyle = {
    color: 'rgba(255,255,255,0.75)', 
    textDecoration: 'none', 
};

const Or = styledComponents.span`
    color: rgba(255,255,255,0.75);
    margin: 0 16px;
`

function ToSignIn() {
  return (
    <SignInUp>
      <Link to="/" style={linkStyle}>登入</Link><Or>或是</Or><Span active>註冊帳號</Span>
    </SignInUp> 
  )
}

export default ToSignIn
import React, { useState, useEffect } from 'react';
import styledComponents, { keyframes } from 'styled-components'
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Logo from '../components/member/MemberLogo';
import MemberError from '../components/member/MemberError';
import ToSignUp from '../components/member/ToSignUp';
import SignInForm from '../components/member/SignInForm';

const Container = styledComponents.div`
    background-color: #2ecc87;
    min-height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

function SignIn() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <Container>
            <Logo />
            <ToSignUp />
            <SignInForm 
                mail={mail}
                setMail={setMail}
                password={password}
                setPassword={setPassword}
                showErrorMessage={showErrorMessage}
                setShowErrorMessage={setShowErrorMessage}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
            {
                showErrorMessage && (
                    <MemberError
                        errorMessage={errorMessage}
                    />
                )
            }
        </Container>
    )
}

export default SignIn
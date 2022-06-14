import React, { useState } from 'react'
import styledComponents from 'styled-components'
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Logo from '../components/member/MemberLogo';
import MemberError from '../components/member/MemberError';
import Notice from '../components/member/MemberNotice';
import ForgotForm from '../components/member/ForgotForm';

const Container = styledComponents.div`
    background-color: #2ecc87;
    min-height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

function Forgot() {
    const [mail, setMail] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");    

    return (
        <Container>
            <Logo />
            <Notice />

            <ForgotForm 
                mail={mail}
                setMail={setMail}
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

export default Forgot
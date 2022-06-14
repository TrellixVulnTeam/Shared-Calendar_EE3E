import React, { useState } from 'react'
import styledComponents from 'styled-components'
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { disappear } from "./duplicateFunction";

const Form = styledComponents.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const MailBlock = styledComponents.div`
    width: 100%;
    height: 60px;
    margin-top: 30px;
    background-color: #ffffff;
    border-radius: 4px;
`

const Mail = styledComponents.div`
    position: relative;
    display: inline-block;
    width: 100%;
    outline: 0;
    width: 100%;
    height: 40px;
    width: 100%;
    height: 60px;
    box-shadow: none;
`

const Input = styledComponents.input`
    box-sizing: border-box;
    padding-left: 20px;
    background-color: #ffffff;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    padding: 0px 36px 0px 16px;
    color: rgb(33, 33, 33);
    font-size: 0.875rem;
    border: 0px;
    outline: 0px;
    cursor: text;
`

const Button = styledComponents.button`
    margin-top: 30px;
    padding: 0 10px;
    border-radius: 3px;
    cursor: pointer;
    color: #2ecc87;
    background-color: #ffffff;

    border: none;
    outline: none;
    width: 295px;
    height: 60px;

    &:hover {
        color: rgba(33, 33, 33, 1);
        opacity: 0.4;
    }
`

const BackSignInLink = styledComponents(Link)`
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    margin-top: 30px;
    color: rgb(255, 255, 255);
    &:hover {
        color: rgba(33, 33, 33, 1);
        opacity: 0.4;
    }
`

function ForgotForm({mail, setMail, showErrorMessage, setShowErrorMessage, errorMessage, setErrorMessage}) {
    let navigate = useNavigate();

    function resetPassword() {
        const auth = getAuth();
        sendPasswordResetEmail(auth, mail)
            .then(() => {
                // Password reset email sent!
                // ..
                console.log('Password reset email sent');
                navigate('/');
            })
            .catch((error) => {
                const errorC = error.code;
                const errorM = error.message;
                disappear(setShowErrorMessage);
                setErrorMessage(errorC);
            }
        );
    }

    return (
        <Form>
            <MailBlock>
                <Mail>
                    <Input type="email" placeholder="電子信箱" value={mail} onChange={e => setMail(e.target.value)} />
                </Mail>
            </MailBlock>

            <Button onClick={resetPassword}>發送</Button>

            <BackSignInLink to='/'>返回登入</BackSignInLink>
        </Form>
    )
}

export default ForgotForm
import React, { useState, useEffect } from 'react';
import styledComponents, { keyframes } from 'styled-components'
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { disappear } from "./duplicateFunction";

const Form = styledComponents.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const MailPasswordBlock = styledComponents.div`
    width: 100%;
    height: 120px;
    margin-top: 30px;
    background-color: #ffffff;
    border-radius: 4px;
`

const MailPassword = styledComponents.div`
    position: relative;
    display: inline-block;
    outline: 0;
    width: 100%;
    height: 60px;
`

const Input = styledComponents.input`
    padding-left: 20px;
    font-family: inherit;
    background-color: #ffffff;
    border-radius: 4px;
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
    width: 100%;
    height: 100%;
    padding: 0px 36px 0px 16px;
    border: 0px;
    outline: 0px;
    cursor: text;
`

const Border = styledComponents.div`
    height: 0;
    margin: 0 20px;
    border: none;
    border-top: 1px #e9ebed solid;
`

const ForgotPasswordLink = styledComponents(Link)`
    margin: 22px 0;
    color: #FFFFFF;
    // font-size: 12px;
    text-decoration: underline;
    color: rgba(255,255,255,0.75), 
`

const Button = styledComponents.button`
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

function SignInForm({mail, setMail, password, setPassword, showErrorMessage, setShowErrorMessage, errorMessage, setErrorMessage}) {

    let navigate = useNavigate();

    function signInAccount() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, mail, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                const uid = user.uid
                const userMail = user.email
                // 印出使用者 ID
                // console.log(uid);
                // 拿到全部行程的資料                
                navigate('/calendar', { state: { userUid: uid, mail: userMail } });
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
            <MailPasswordBlock>
                <MailPassword>
                    <Input type="email" placeholder="電子信箱" value={mail} onChange={e => setMail(e.target.value)} />
                </MailPassword>
                <Border></Border>
                <MailPassword>
                    <Input type="password" placeholder="8〜32字的密碼" value={password} onChange={e => setPassword(e.target.value)} />
                </MailPassword> 
            </MailPasswordBlock>

            <ForgotPasswordLink to='/forgot'>忘記密碼請往這裡</ForgotPasswordLink>
            
            <Button onClick={signInAccount}>登入</Button>
        </Form>        
    )
}

export default SignInForm
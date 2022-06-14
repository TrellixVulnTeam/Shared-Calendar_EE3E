import React, { useState, useEffect } from 'react';
import styledComponents, { keyframes } from 'styled-components'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
// Firebase Firestore
import db from '../../firebase';
import { collection, addDoc } from "firebase/firestore"; 
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

const AgreePrivacyPolicy = styledComponents.p`
    margin: 22px 0;
    color: #FFFFFF;
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

function SignUpForm({mail, setMail, password, setPassword, showErrorMessage, setShowErrorMessage, errorMessage, setErrorMessage}) {
    let navigate = useNavigate();

    function signUpAccount() {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, mail, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                const uid = user.uid
                const userMail = user.email

                addMemberInfo(uid, userMail)

                // console.log(`${user}, 使用已註冊`);
                navigate('/calendar', { state: { userUid: uid, mail: userMail } });
            })
            .catch((error) => {
                const errorC = error.code;
                const errorM = error.message;
                disappear(setShowErrorMessage);
                setErrorMessage(errorC);
            });
    }

    const addMemberInfo = async (uid, userMail) => {
        // Add a new document with a generated id.
        const memberRef = await addDoc(collection(db, "members"), {
            uid: uid,
            mail: userMail,
        });
        console.log("Document written with ID: ", memberRef.id);
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

            <AgreePrivacyPolicy>同意使用條款與隱私權政策，繼續進行</AgreePrivacyPolicy>

            <Button onClick={signUpAccount}>同意條款，開始註冊</Button>
        </Form>
    )
}

export default SignUpForm
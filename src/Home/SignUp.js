import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import MemberError from '../components/member/MemberError';
import styledComponents from 'styled-components'
import Logo from '../components/member/MemberLogo';
import ToSignIn from '../components/member/ToSignIn';
import SignUpForm from '../components/member/SignUpForm';
// Firebase Firestore
import db from '../firebase.js';
import { collection, addDoc } from "firebase/firestore"; 

const Container = styledComponents.div`
    background-color: #2ecc87;
    min-height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

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

function SignUp() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
    <Container>
        <Logo />
        <ToSignIn />
        {/* Form <-> div */}
        <SignUpForm 
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

export default SignUp
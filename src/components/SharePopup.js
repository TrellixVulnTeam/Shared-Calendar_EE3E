import React, { useEffect, useState, useContext } from 'react';
import styledComponents from 'styled-components'
// Firebase Firestore
import db from '../firebase.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import MemberError from './member/MemberError.js';
import { Popup } from './calendar/calendarCSS.js';

const Inner = styledComponents.div`
    position: absolute;
    left: 10%;
    right: 10%;
    top: 30%;
    bottom: 30%;
    margin: auto;
    background: white;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Flex = styledComponents.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 24px;
    width: 80%;
    justify-content: center;
`

const FlexButton = styledComponents(Flex)`
    justify-content: space-around;
    width: 75%;
`

const InputMail = styledComponents.input`
    margin-left: 8px;
    padding: 8px;
    font-size: 16px;
    cursor: text;
    width: 175px;

    border-radius: 4px;
    border: 1px solid #ddd;
    box-shadow: 0 0 0 1000px #fff inset;
    transform: translateX(0) translateY(0);
    transition: border 0.25s linear, transform 0.25s linear;
  
    &:focus {
        border-color: lightblue;
        border-width: 2px;
        outline: none;
        transform: translateX(-1px) translateY(-1px);
    }    
`

const AuthorityText = styledComponents.p`
    font-size: 16px;
`

const CheckIcon = styledComponents.span`
    margin: 0 8px;
    line-height: 16px;
`

const Button = styledComponents.button`
    padding: 0 10px;
    border: none;
    outline: none;

    width: 40%;
    height: 50px;

    cursor: pointer;
    border-radius: 5px;

    font-weight: bold;

    color: ${props => props.add ? 'rgb(255, 255, 255)' : 'rgb(143, 143, 143)'};
    background-color: ${props => props.add ? 'rgb(46, 204, 135)' : 'rgb(255, 255, 255)'};

    &:hover {
      opacity: 0.8;
    }
`

function SharePopup({friendMail, setFriendMail, uid, userMail, setShowSharePopup}) {
    const [shareCalendarLevel, setShareCalendarLevel] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");    

    async function addDataInAuthority() {
        // Step1(檢查)
        const q = query(collection(db, "members"), where("mail", "==", friendMail));
        const querySnapshot = await getDocs(q);

        if(querySnapshot.docs.length > 0) {
            // Step2(成功)
            const docRef = await addDoc(collection(db, "authority"), {
                // 使用者本人
                myUid: uid,
                myMail: userMail, 
                friendUid: querySnapshot.docs[0].data().uid, 
                friendMail: querySnapshot.docs[0].data().mail,                
                read: shareCalendarLevel, 
            });

            // Step3(清空欄位數值、關閉 Popup)
            setFriendMail('');
            setShareCalendarLevel(false);
            setShowSharePopup(false);            
        } else {
            // Step2(失敗)
            console.log('Step2(失敗)');
            disappear();
            setErrorMessage('查無此人');
        }
    }

    const disappear = () => {
        setShowErrorMessage(true);        
        const timer = setTimeout(() => {
            setShowErrorMessage(false);
            // Step3(初始值)
            setFriendMail('');
            setShareCalendarLevel(false);
        }, 2000);
        return () => clearTimeout(timer);
    }

    return (
        <Popup
            onClick={() => {
                setFriendMail('');
                setShareCalendarLevel(false);
                setShowSharePopup(false);                
            }}
        >
            <Inner
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {/* 電子郵件 */}
                <Flex>
                    <span className="material-symbols-outlined">
                        forward_to_inbox
                    </span>
                    <label>
                        <InputMail 
                            type='email'
                            value={friendMail}
                            onChange={e => {setFriendMail(e.target.value)}}
                        />                                
                    </label>
                </Flex>
                {/* 觀看 或 編輯 */}
                <Flex>
                    <AuthorityText>給予權限</AuthorityText>
                    {
                        shareCalendarLevel ? (
                            <CheckIcon 
                                className="material-symbols-outlined"
                                onClick={() => setShareCalendarLevel(false)}
                            >
                                radio_button_checked
                            </CheckIcon>
                        ) : (
                            <CheckIcon 
                                className="material-symbols-outlined"
                                onClick={() => setShareCalendarLevel(true)}
                            >
                                radio_button_unchecked
                            </CheckIcon>
                        )
                    }
                    {
                        shareCalendarLevel ? (
                            <p>閱讀、編輯</p>
                        ) : (
                            <p>閱讀</p>
                        )
                    }
                </Flex>                 
                
                <FlexButton>
                    <Button onClick={addDataInAuthority} add>加入月曆</Button>
                    <Button onClick={() => setShowSharePopup(false)} close>關閉視窗</Button>
                </FlexButton>
                
                {
                    showErrorMessage && (
                        <MemberError
                            errorMessage={errorMessage}
                        />
                    )
                }                    
            </Inner>
        </Popup>
    )
}

export default SharePopup
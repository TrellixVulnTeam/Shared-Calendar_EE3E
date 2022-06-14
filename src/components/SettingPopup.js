import React, { useEffect, useState, useContext } from 'react';
import styledComponents from 'styled-components'
// Firebase Firestore
import db from '../firebase.js';
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, where, getDocs, orderBy, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import DoubleCheckPopup from './DoubleCheckPopup.js';
import { Popup } from './calendar/calendarCSS.js';

const Inner = styledComponents.div`
  position: absolute;
  left: 10%;
  right: 10%;
  top: 15%;
  bottom: 15%;
  margin: auto;
  background: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const FlexButton = styledComponents.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
`

const ManageAuthority = styledComponents.div`
`

const List = styledComponents.ul`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1 1 150px;
`

const Item = styledComponents.li`
    cursor: pointer;
    border: 1px solid #E8E8E8;
    padding: 8px 16px;
    text-align: center;
    margin-bottom: 8px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    width: 75%;
    margin: 0 auto;

    &:hover {
        opacity: 0.5;
    }    
`

const Subtitle = styledComponents.h2`
    text-align: center;
    margin-bottom: 8px;
`

const FriendMail = styledComponents.p`
    // width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;  
`

const Button = styledComponents.button`
    padding: 0 10px;

    border: none;
    outline: none;

    width: 30%;
    height: 50px;


    cursor: pointer;
    border-radius: 5px;

    font-weight: bold;

    color: ${props => props.logout ? 'rgb(255, 255, 255)' : 'rgb(143, 143, 143)'};
    background-color: ${props => props.logout ? 'rgb(46, 204, 135)' : 'rgb(255, 255, 255)'};

    &:hover {
        opacity: 0.8;
    }
`

function SettingPopup({readFriend, setReadFriend, editFriend, setEditFriend, setShowSettingPopup}) {
    const [showDoubleCheck, setShowDoubleCheck] = useState(false);
    const [doubleCheckMessageKey, setDoubleCheckMessageKey] = useState('');

    let navigate = useNavigate();

    function logOut() {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            // navigate('/calendar', { state: { userUid: uid, mail: userMail } });  
            navigate('/');
        }).catch((error) => {
            // An error happened.
            console.log('錯誤訊息', error);
        });    
    }

    return (
        <Popup
            onClick={() => {
                setShowSettingPopup(false);
            }}
        >
            <Inner
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {/* 朋友給我的權限(閱讀) */}
                <List>
                    <Subtitle>閱讀的權限</Subtitle>
                    {
                        readFriend.length>0 && (
                            readFriend.map(item => (
                                <Item 
                                    key={item.key}
                                    // onClick={() => deleteFriendAuthority(item.key)}
                                    onClick={() => {
                                        setShowDoubleCheck(true);
                                        setDoubleCheckMessageKey(item.key)
                                    }}
                                >
                                    <FriendMail>{item.friendMail}</FriendMail>
                                    <p>X</p>
                                </Item>
                            ))
                        )
                    }               
                </List>
                {/* 朋友給我的權限(編輯) */}
                
                <List>
                    <Subtitle>編輯的權限</Subtitle>
                    {
                        editFriend.length>0 && (
                            editFriend.map(item => (
                                <Item 
                                    key={item.key}
                                    // onClick={() => deleteFriendAuthority(item.key)}
                                    onClick={() => {
                                        setShowDoubleCheck(true);
                                        setDoubleCheckMessageKey(item.key)
                                    }}                                    
                                >
                                    <FriendMail>{item.friendMail}</FriendMail>
                                    <p>X</p>
                                </Item>
                            ))
                        )
                    }                    
                </List>

                <FlexButton>
                    <Button onClick={logOut} logout>會員登出</Button>
                    <Button onClick={() => setShowSettingPopup(false)} close>關閉視窗</Button>
                </FlexButton>     
            </Inner>

            {
                showDoubleCheck && (
                    <DoubleCheckPopup 
                        doubleCheckMessageKey={doubleCheckMessageKey}
                        setShowDoubleCheck={setShowDoubleCheck}
                    />
                )
            }
        </Popup>
  )
}

export default SettingPopup
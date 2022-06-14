import React, { useEffect, useState, useContext } from 'react';
import styledComponents from 'styled-components'
// Firebase Firestore
import db from '../firebase.js';
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, where, getDocs, orderBy } from 'firebase/firestore';
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

const List = styledComponents.ul`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1 1 150px;
  flex: ${props => props.myself ? '0' : '1'} 1 ${props => props.myself ? '75px' : '100px'};
`

const Item = styledComponents.li`
    cursor: pointer;
    border: 1px solid #E8E8E8;
    padding: 8px;
    text-align: center;
    margin-bottom: 8px;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;    

    color: ${props => props.active && 'white'};
    font-weight: ${props => props.active === true ? 'bold' : ''};
    // background-color: ${props => props.active ? 'rgba(51, 181, 229, 1)' : ''};
    background-color: ${props => props.active ? '#a0c4e6' : ''};
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

const Button = styledComponents.button`
    padding: 0 10px;

    border: none;
    outline: none;

    height: 50px;

    width: 75%;
    margin: 0 auto;

    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
    color: rgb(255, 255, 255);
    background-color: rgb(46, 204, 135);
    &:hover {
        opacity: 0.8;
    }
`

function AccountPopup({setShowAccountPopup, uid, schedules, setSchedules, setActivities, setUniqueArr, friendCalendar, setFriendCalendar, friendUid, readFriend, editFriend, iReadFriend, iEditFriend, setFriendUid, canEditCalendar, setCanEditCalendar, standardDate}) {
    // 步驟一：月曆上哪一天很忙碌呢
    async function busyDays(userUid) {
        const q = query(collection(db, "activities"), where("uid", "==", userUid));
        const querySnapshot = await getDocs(q);
        setSchedules(querySnapshot.docs.map(doc => (
            {
                "key": doc.id, 
                "activity": doc.data().activity,
                "note": doc.data().note,
                "category": doc.data().category, 
                "standardDateTime": new Date(doc.data().standardDateTime.seconds*1000),
                "start": new Date(doc.data().start.seconds*1000),
                "end": new Date(doc.data().end.seconds*1000),
                "notificationDateTime": new Date(doc.data().notificationDateTime.seconds*1000)
            }
        )))
        // 提醒視窗關閉
        setShowAccountPopup(false);
    }
    // 步驟二：將忙碌的日期顯示於月曆數字的背景顏色上 
    useEffect(() => {
        let repeatNumber = [];
        schedules.map(doc => {
          repeatNumber.push(doc.standardDateTime.getDate())
        });
        setUniqueArr([...new Set(repeatNumber)])
    }, [schedules])

    // 步驟一：當日行程是什麼呢
    async function todaySchedules(userUid) {
        let specifyDateTime = Date.parse(`2022-07-${new Date().getDate()<10?'0':''}${new Date().getDate()}T08:00`);
        specifyDateTime = new Date(specifyDateTime);

        const q = query(collection(db, 'activities'), where('standardDateTime', '==', specifyDateTime), where("uid", "==", userUid));

        const querySnapshot = await getDocs(q);

        setActivities(querySnapshot.docs.map(doc => (
            {
                "key": doc.id, 
                "activity": doc.data().activity,
                "note": doc.data().note,
                "category": doc.data().category, 
                "standardDateTime": new Date(doc.data().standardDateTime.seconds*1000),
                "start": new Date(doc.data().start.seconds*1000),
                "end": new Date(doc.data().end.seconds*1000),
                "notificationDateTime": new Date(doc.data().notificationDateTime.seconds*1000), 
                "notMyself": doc.data().notMyself, 
            }
        ))) ;
    }

    // 步驟一：
    async function addSchedules(userUid) {
        let specifyDateTime = Date.parse(`${standardDate}T08:00`);
        specifyDateTime = new Date(specifyDateTime);

        const q = query(collection(db, 'activities'), where('standardDateTime', '==', specifyDateTime), where("uid", "==", userUid));

        const querySnapshot = await getDocs(q);
        setActivities(querySnapshot.docs.map(doc => (
            {
                "key": doc.id, 
                "activity": doc.data().activity,
                "note": doc.data().note,
                "category": doc.data().category, 
                "standardDateTime": new Date(doc.data().standardDateTime.seconds*1000),
                "start": new Date(doc.data().start.seconds*1000),
                "end": new Date(doc.data().end.seconds*1000),
                "notificationDateTime": new Date(doc.data().notificationDateTime.seconds*1000), 
                "notMyself": doc.data().notMyself, 
            }
        ))) ;
    }    

    function checkUserActive(item) {
        // 非使用者本人
        if (friendCalendar===true) {
            if (item.friendUid === friendUid) {
                return true
            }
        }
    }

    return (
        <Popup
            onClick={() => {
                setShowAccountPopup(false);
            }}        
        >
            <Inner
                onClick={(e) => {
                    e.stopPropagation();
                }}            
            >
                <Subtitle>自己的帳戶</Subtitle>
                {/* 我給朋友的權限 */}
                <List myself>
                    <Item
                        onClick={() => {
                            busyDays(uid);
                            todaySchedules(uid);
                            setFriendCalendar(false);
                            setCanEditCalendar(true);
                            addSchedules(uid);
                        }}
                        // 本人月曆
                        active={!friendCalendar}
                    >
                        我的帳戶 / Read:{readFriend.length} / Edit:{editFriend.length}
                    </Item>
                </List>
                {/* 朋友給我的權限(閱讀) */}
                <List>
                    <Subtitle>閱讀的權限</Subtitle>
                    {
                        iReadFriend.length>0 && (
                            iReadFriend.map(item => (
                                <Item 
                                    key={item.key}
                                    onClick={() => {
                                        busyDays(item.friendUid);
                                        todaySchedules(item.friendUid);
                                        addSchedules(item.friendUid);
                                        setFriendCalendar(true);
                                        setCanEditCalendar(false);
                                        setFriendUid(item.friendUid);
                                    }}
                                    // 閱讀朋友的月曆
                                    active={checkUserActive(item)}
                                >
                                    {item.friendMail}
                                </Item>
                            ))
                        )
                    }
                </List>
                {/* 朋友給我的權限(編輯) */}
                <List>
                    <Subtitle>編輯的權限</Subtitle>
                    {
                        iEditFriend.length>0 && (
                            iEditFriend.map(item => (
                                <Item 
                                    key={item.key}
                                    onClick={() => {
                                        busyDays(item.friendUid);
                                        todaySchedules(item.friendUid);
                                        addSchedules(item.friendUid);
                                        setFriendCalendar(true);
                                        setCanEditCalendar(true);
                                        setFriendUid(item.friendUid);
                                    }}
                                    // 閱讀/編輯朋友的月曆
                                    active={checkUserActive(item)}
                                >
                                    {item.friendMail}
                                </Item>
                            ))
                        )
                    }
                </List>
                <Button onClick={() => setShowAccountPopup(false)}>關閉視窗</Button>
            </Inner>
        </Popup>
    )
}

export default AccountPopup
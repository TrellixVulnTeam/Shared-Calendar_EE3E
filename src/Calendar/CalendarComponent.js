import React, { useEffect, useState, createContext, useContext } from 'react';
// styled-components
import styledComponents from 'styled-components';
// react-modal-sheet
import Sheet from 'react-modal-sheet';
// Firebase Firestore
import db from '../firebase.js';
import { collection, addDoc, query, onSnapshot, doc, updateDoc, where, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarDay } from '../components/calendar/calendarCSS';

function CalendarComponent({item, friendCalendar, friendUid, uid, activities, setActivities, standardDate, setStandardDate, setInputDate, schedules, setSchedules, uniqueArr, setUniqueArr}) {
  // 當日行程
  useEffect(() => {
    async function getData() {
      let specifyDateTime = Date.parse(`2022-07-${new Date().getDate()<10?'0':''}${new Date().getDate()}T08:00`);
      specifyDateTime = new Date(specifyDateTime);
  
      const q = query(collection(db, 'activities'), where('standardDateTime', '==', specifyDateTime), where("uid", "==", uid)); // userUid
  
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
    getData();
  }, [uid]);

    // 點選日曆上的數字，動態更新當日行程
    const searchEvent = async(e) => {
        // 湊日期
        let dateTime = `2022-07-${e.target.textContent<10?'0':''}${e.target.textContent}T08:00`;
        dateTime = Date.parse(dateTime)
        dateTime = new Date(dateTime);

        setStandardDate(`2022-07-${e.target.textContent<10?'0':''}${e.target.textContent}`);
        setInputDate(`2022-07-${e.target.textContent<10?'0':''}${e.target.textContent}`);


        if(friendCalendar) {
            // 朋友的當日行程
            const q = query(collection(db, 'activities'), where('standardDateTime', '==', dateTime), where("uid", "==", friendUid));
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
            )));
        } else {
            // 使用者本人的當日行程
            const q = query(collection(db, 'activities'), where('standardDateTime', '==', dateTime), where("uid", "==", uid));
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
            )));
        }
    }

    // 步驟一：月曆上哪一天很忙碌呢 
    useEffect(() => {
        if (friendCalendar) {
            const q = query(collection(db, "activities"),  where("uid", "==", friendUid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
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
            });
            });
        } else {
            const q = query(collection(db, "activities"),  where("uid", "==", uid)); // userUid
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
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
            });
            });
        }
    }, [uid, friendCalendar])
    // 步驟二：將忙碌的日期顯示於月曆數字的背景顏色上 
    useEffect(() => {
        let repeatNumber = [];
        schedules.map(doc => {
            repeatNumber.push(doc.standardDateTime.getDate())
        });
        setUniqueArr([...new Set(repeatNumber)])
    }, [schedules])

    function checkBusy(item) {
        if (uniqueArr.indexOf(item)!==-1) {
            return true
        }
    }

    return (
    <CalendarDay
        onClick={(e) => searchEvent(e)}
        active={`${item+1<10?'0':''}${item+1}` === `${standardDate.charAt(standardDate.length-2)}${standardDate.charAt(standardDate.length-1)}` ? true : false}
        busy={checkBusy(item+1)===true && true}
    >
        {`${item+1}`}
    </CalendarDay>
    )
}

export default CalendarComponent
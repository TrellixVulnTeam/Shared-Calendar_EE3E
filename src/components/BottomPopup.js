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
`

const Item = styledComponents.li`
  cursor: pointer;
  border: 1px solid #E8E8E8;
  padding: 8px;
  text-align: center;
  margin-bottom: 8px;
  &:hover {
    opacity: 0.5;
  }
  border-radius: 5px;
`

const ItemTime = styledComponents.p`
  color: #8F9BB3;
`
const ItemTitle = styledComponents.h3`
  font-size: 22px;
  color: #222B45;
`
const ItemNote = styledComponents.p`
  color: #8F9BB3;
`
const ItemCategory = styledComponents.span`
  color: #8F9BB3;
`

const Button = styledComponents.button`
  padding: 0 10px;

  border: none;
  outline: none;
  font-weight: bold;

  width: 100%;
  height: 50px;

  cursor: pointer;
  font-weight: bold;
  border-radius: 5px;
  color: rgb(255, 255, 255);
  background-color: rgb(46, 204, 135);
  &:hover {
    opacity: 0.8;
  }
`

function BottomPopup({setShowBottomPop, news, setNews, setStandardDate, setInputDate, uid, setActivities}) {
  async function closeModalJumpToTheActivity(item) {
    setShowBottomPop(false);

    setStandardDate(`2022-07-${item.standardDateTime.getDate()<10?'0':''}${item.standardDateTime.getDate()}`);
    setInputDate(`2022-07-${item.standardDateTime.getDate()<10?'0':''}${item.standardDateTime.getDate()}`);

    const q = query(collection(db, 'activities'), where('standardDateTime', '==', item.standardDateTime), where("uid", "==", uid));

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
      }
    )));
  }
  return (
    <Popup
      onClick={() => {
        setShowBottomPop(false);
      }}
    >
      <Inner
          onClick={(e) => {
              e.stopPropagation();
          }}
      >
        <List>
          {
            news.length>0 && (
              news.map((item) => (
                <Item key={item.key} onClick={() => closeModalJumpToTheActivity(item)}>
                  <ItemTime>
                    {`${item.start.getHours()}:${item.start.getMinutes()<10?'0':''}${item.start.getMinutes()}~${item.end.getHours()}:${item.end.getMinutes()<10?'0':''}${item.end.getMinutes()}`}
                    <ItemCategory>．{item.category}</ItemCategory>                  
                  </ItemTime>
                  <ItemTitle>{item.activity}</ItemTitle>
                  <ItemNote>{item.note}</ItemNote>
                </Item>
              ))

            )
          }
        </List>
        <Button onClick={() => setShowBottomPop(false)}>關閉視窗</Button>
      </Inner>
    </Popup>
  )
}

export default BottomPopup
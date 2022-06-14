import React, { useEffect, useState, useContext } from 'react';
// styled-components
import styledComponents from 'styled-components';
// react-modal-sheet
import Sheet from 'react-modal-sheet';
// Firebase Firestore
import db from '../firebase.js';
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, where, getDocs } from 'firebase/firestore';
// useContext Hook
import { ScheduleItemContext } from '../App.js';
// 提示訊息
import Alert from '../components/Alert.js';

const Popup = styledComponents.div`
    position: ${props => props.isOpen && 'fixed'};
    width: ${props => props.isOpen && '100%'};
    height: ${props => props.isOpen && '100%'};
    top: ${props => props.isOpen && '0'};
    left: ${props => props.isOpen && '0'};
    right: ${props => props.isOpen && '0'};
    bottom: ${props => props.isOpen && '0'};
    margin: ${props => props.isOpen && 'auto'};
    background-color: ${props => props.isOpen && 'rgba(0, 0, 0, 0.5)'};    
`

const Content = styledComponents.div`
    padding: 0 8px;
`
const Title = styledComponents.h3`
    font-size: 22px;
    text-align: center;
    margin-bottom: 16px;
`
const InputActivity = styledComponents.input`
    padding: 8px;
    margin: 0 auto 16px auto;
    border-radius: 4px;
    border: 1px solid #ddd;
    box-shadow: 0 0 0 1000px #fff inset;
    transform: translateX(0) translateY(0);
    transition: border 0.25s linear, transform 0.25s linear;
    
    display: block;
    text-align: center;
    width: 50%;
    @media (min-width: 600px) {
        width: 75%;
    }

    &:focus {
        border-color: lightblue;
        border-width: 2px;
        outline: none;
        transform: translateX(-1px) translateY(-1px);
    }
`

const InputNote = styledComponents.textarea`
    padding: 8px;
    margin: 0 auto 16px auto;
    border-radius: 4px;
    border: 1px solid #ddd;

    display: block;
    width: 75%; 

    box-shadow: 0 0 0 1px rgba(11, 65, 110, 0), 0 0 0 100px hsl(1, 100%, 0) inset;
    transition: border 0.25s linear, box-shadow 0.25s linear;
  
    &:-webkit-autofill {
        box-shadow: 0 0 0 1px rgba(11, 65, 110, 0), 0 0 0 100px hsl(1, 100%, 0) inset;
    }
  
    &:focus {
        border-color: #0b41a0;
        box-shadow: 0 0 0 1px rgba(11, 65, 110, 1), 0 0 0 100px hsl(1, 100%, 100%) inset;
        outline: none;
    }
`

const FlexModalDateTime = styledComponents.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 16px;
    justify-content: center;
`

const FlexDateTime = styledComponents.div`
    display: flex;
    align-items: center;
    flex-direction: row;

    margin:  0 ${props => props.remindMe ? '8px' : props.startTime ? '8px' : ''} 0 ${props => props.remindMe ? '8px' : ''};
    @media (min-width: 600px) {
        margin:  0 ${props => props.remindMe ? '48px' : props.startTime ? '48px' : ''} 0 ${props => props.remindMe ? '48px' : ''};
    }
`

const InputDateTime = styledComponents.input`
  margin-left: 8px;

  width: ${props => props.notifications && "45px"};
  text-align: ${props => props.notifications && "right"};
  margin-right: ${props => props.notifications && "8px"};

  padding: 0.25em 0.125em;
  border: 1px solid#34495e;
  color: #34495e;
  font-weight: bold;
`

const SelectCategory = styledComponents.select`
  margin-left: 8px;

  padding: 0.25em 0.125em;
  border: 1px solid#34495e;
  color: #34495e;
  font-weight: bold;
`

const CreateEvent = styledComponents.div`
  padding: 14px;
  text-align: center;

  font-weight: bold;
  cursor: pointer;
  width: 80%;
  margin: 0 auto;
  border-radius: 5px;
  color: rgb(255, 255, 255);
  background-color: rgb(46, 204, 135);
  &:hover {
    opacity: 0.8;
  }
`
const DeleteEditEvent = styledComponents.div`
  display: flex;
  justify-content: space-evenly;
`

const DeleteEvent = styledComponents.div`
    text-align: center;

    padding: 0 10px;
    border: none;
    outline: none;

    width: 40%;
    height: 50px;

    cursor: pointer;
    border-radius: 5px;

    font-weight: bold;

    color: rgb(143, 143, 143);
    background-color: rgb(255, 255, 255);
    line-height: 50px;

    &:hover {
        opacity: 0.8;
    }  
`
const EditEvent = styledComponents.div`
    text-align: center;
    padding: 0 10px;
    border: none;
    outline: none;

    width: 40%;
    height: 50px;

    cursor: pointer;
    border-radius: 5px;

    font-weight: bold;

    color: rgb(255, 255, 255);
    background-color: rgb(46, 204, 135);
    line-height: 50px;

    &:hover {
        opacity: 0.8;
    }
`

function ModalSheet({notify, changeNotify, uid, setActivities, modalState, changeModalState, newEvent, inputActivity, typeInputActivity, inputNote, typeInputNote, standardDate, changeStandardDate, inputDate, changeInputDate, inputTimeStart, changeInputTimeStart, inputTimeEnd, changeInputTimeEnd, inputActivityLength, changeInputActivityLength, getData, inputCategory, changeInputCategory, friendCalendar, friendUid}) {
    const scheduleItemKey = useContext(ScheduleItemContext);

    async function getData() {
        let specifyDateTime = Date.parse(`${standardDate}T08:00`);
        specifyDateTime = new Date(specifyDateTime);
        
        if (friendCalendar) {
            const q = query(collection(db, "activities"), where("standardDateTime", "==", specifyDateTime), where("uid", "==", friendUid));
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
                //   "uid": uid,
                }
            ))) ;            
        } else {
            const q = query(collection(db, "activities"), where("standardDateTime", "==", specifyDateTime), where("uid", "==", uid));
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
                //   "uid": uid,
                }
            ))) ;            
        }
    }

    // 新增活動
    const addActivity = async() => {
        if(inputActivity.length > 0) {
            let standardDateTime = Date.parse(`${standardDate}`);
            let start = Date.parse(`${inputDate}T${inputTimeStart}`);
            let end = Date.parse(`${inputDate}T${inputTimeEnd}`);
    
            if(start > end) {
                changeInputActivityLength('結束時間比開始時間早');
            } else {
                changeModalState(false);
                standardDateTime = new Date(standardDateTime);
                start = new Date(start);
                end = new Date(end);
                let notificationDateTime = new Date(start - notify*60000);
                
                if (friendCalendar) {
                    try {
                        await addDoc(collection(db, 'activities'), {
                            activity: inputActivity, 
                            note: inputNote,
                            category: inputCategory.value, 
                            standardDateTime: standardDateTime, 
                            start: start, 
                            end: end,
                            uid: friendUid,
                            notificationDateTime: notificationDateTime,
                            // 非本人更新
                            notMyself: true,                             
                        })
                        // 取得資料
                        getData();
                    } catch (error) {
                        console.log("Error adding document", error);
                    }                      
                } else {
                    try {
                        await addDoc(collection(db, 'activities'), {
                            activity: inputActivity, 
                            note: inputNote,
                            category: inputCategory.value, 
                            standardDateTime: standardDateTime, 
                            start: start, 
                            end: end,
                            uid: uid,
                            notificationDateTime: notificationDateTime, 
                            // 本人更新
                            notMyself: false,                              
                        })
                        // 取得資料
                        getData();
                    } catch (error) {
                        console.log("Error adding document", error);
                    }                    
                }
            }
        } else if (inputActivity.length === 0) {
            changeInputActivityLength('Event 不為空');
        }
    }

    // 更新活動
    const editActivity = async() => {
        const activityRef = doc(db, 'activities', scheduleItemKey);

        let standardDateTime = Date.parse(`${standardDate}`);
        let start = Date.parse(`${inputDate}T${inputTimeStart}`);
        let end = Date.parse(`${inputDate}T${inputTimeEnd}`);

        if(start > end) {
            changeInputActivityLength('結束時間比開始時間早');
        } else if(inputActivity.length === 0) {
            changeInputActivityLength('Event 不為空');
        } else {
            changeModalState(false);
            standardDateTime = new Date(standardDateTime);
            start = new Date(start);
            end = new Date(end);
            let notificationDateTime = new Date(start - notify*60000);

            if (friendCalendar) {
                try {
                    //  更新資料
                    await updateDoc(activityRef, {
                        activity: inputActivity, 
                        note: inputNote,
                        category: inputCategory.value, 
                        standardDateTime: standardDateTime, 
                        start: start, 
                        end: end, 
                        uid: friendUid,
                        notificationDateTime: notificationDateTime, 
                        // 非本人更新
                        notMyself: true, 
                    });
                    // 取得資料
                    getData();
                    // L1：如果「活動資訊」有異動, 就需刪掉原本在 notifications 資料庫裡面的提醒消息
                    // L2：如果「notificationDateTime」的資料有異動, 就需刪掉原本在 notifications 資料庫裡面的提醒消息
                } catch (error) {
                    console.log("Error updating document", error);
                }               
            } else {
                try {
                    //  更新資料
                    await updateDoc(activityRef, {
                        activity: inputActivity, 
                        note: inputNote,
                        category: inputCategory.value, 
                        standardDateTime: standardDateTime, 
                        start: start, 
                        end: end, 
                        uid: uid,
                        notificationDateTime: notificationDateTime, 
                        // 本人更新
                        notMyself: false,                         
                    });
                    // 取得資料
                    getData();
                    // L1：如果「活動資訊」有異動, 就需刪掉原本在 notifications 資料庫裡面的提醒消息
                    // L2：如果「notificationDateTime」的資料有異動, 就需刪掉原本在 notifications 資料庫裡面的提醒消息
                } catch (error) {
                    console.log("Error updating document", error);
                }        
            } 
        }
    }
    // 刪除活動
    const deleteActivity = async() => {
        await deleteDoc(doc(db, "activities", scheduleItemKey));
        getData();

        changeModalState(false);
    }

    return (
        <Popup isOpen={modalState} onClick={() => changeModalState(false)}>

        <Sheet isOpen={modalState} onClose={() => changeModalState(false)}  snapPoints={[500, 400, 100, 0]} onClick={(e)=>e.stopPropagation()}>
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                    <Content>
                        <Title>
                            {newEvent ? 'Add New Event' : 'Edit or Delete'}
                        </Title>
                        {/* 活動 */}
                        <div>
                            <InputActivity 
                                type='text'
                                placeholder='Event name*'
                                value={inputActivity}
                                onChange={e => typeInputActivity(e.target.value)}
                            />

                        </div>

                        {/* 備註 */}
                        <div>
                            <InputNote 
                                placeholder='Type the note here...'
                                rows={3}
                                maxLength={30}
                                value={inputNote}
                                onChange={e => typeInputNote(e.target.value)}
                            />
                        </div>

                        {/* 日期 */}
                        <FlexModalDateTime>
                            <FlexDateTime>
                                <span className="material-symbols-outlined">
                                    schedule
                                </span>
                                <label>
                                    <InputDateTime 
                                        type='date' 
                                        value={inputDate} 
                                        onChange={e => {
                                                changeInputDate(prev => (e.target.value));
                                                changeStandardDate(prev => (e.target.value));
                                            }                                        
                                        } 
                                        min="2022-07-01" 
                                        max="2022-07-31"
                                    />
                                </label>
                            </FlexDateTime>
                            <FlexDateTime remindMe>
                                <span className="material-symbols-outlined">
                                    notifications
                                </span>
                                <label>
                                    <InputDateTime notifications
                                        type='number' 
                                        value={notify} 
                                        onChange={e => {
                                                changeNotify(prev => (e.target.value));
                                            }                                        
                                        } 
                                        min="0" 
                                        max="60"
                                    />                                    
                                </label>
                                分
                            </FlexDateTime>
                            
                            <FlexDateTime>                            
                                <span className="material-symbols-outlined">
                                    category
                                </span>
                                <label>
                                    <SelectCategory value={inputCategory.value} onChange={e => changeInputCategory({value: e.target.value})}>
                                        <option value="台塑">台塑</option>
                                        <option value="網球">網球</option>
                                        <option value="家人">家人</option>
                                        <option value="其它">其它</option>
                                        <option value="彭彭">彭彭</option>
                                    </SelectCategory>
                                </label>
                            </FlexDateTime>

                        </FlexModalDateTime>

                        {/* 起始時間 */}
                        <FlexModalDateTime>
                            <FlexDateTime startTime>
                                <span className="material-symbols-outlined">
                                    arrow_forward
                                </span>                
                                <InputDateTime type='time' value={inputTimeStart} onChange={e => changeInputTimeStart(e.target.value)} />
                            </FlexDateTime>
                            <FlexDateTime>
                                <span className="material-symbols-outlined">
                                    arrow_back
                                </span>  
                                <InputDateTime type='time' value={inputTimeEnd} onChange={e => changeInputTimeEnd(e.target.value)} />
                            </FlexDateTime>
                        </FlexModalDateTime>

                        {
                            newEvent ? (
                                <CreateEvent onClick={addActivity}>
                                    <p>Create Event</p>
                                </CreateEvent>                
                            ) : (
                                <DeleteEditEvent>
                                    <DeleteEvent onClick={deleteActivity}>
                                        <p>Delete Event</p>
                                    </DeleteEvent>
                                    <EditEvent onClick={editActivity}>
                                        <p>Edit Event</p>  
                                    </EditEvent>
                                </DeleteEditEvent>
                            )
                        }

                        {inputActivityLength !== "" ? <Alert alertMessage={inputActivityLength} /> : ''}
                    </Content>
                </Sheet.Content>
            </Sheet.Container>

            <Sheet.Backdrop />
        </Sheet>

        </Popup>
  )
}

export default ModalSheet
import React, { useEffect, useState, createContext, useContext } from 'react';
// styled-components
import styledComponents from 'styled-components';
// react-modal-sheet
import Sheet from 'react-modal-sheet';
// Firebase Firestore
import db from '../firebase.js';
import { collection, addDoc, query, onSnapshot, doc, updateDoc, where, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate, useLocation } from "react-router-dom";
import { Wrapper, Container, Calendar, CalendarHeader, CalendarHeaderItem, CalendarDays, CalendarDay, Schedule, ScheduleList, ScheduleItem, ScheduleItemTime, ScheduleItemTitle, ScheduleItemNote, ScheduleItemCategory } from '../components/calendar/calendarCSS';

function ScheduleComponent({item, canEditCalendar, setOpen, setNewEvent, setKey, setInputActivity, setInputNote, setInputCategory, setStandardDate, setInputDate, setInputTimeStart, setInputTimeEnd, setNotify, setInputActivityLength}) {
    function eventChange({key, activity, note, start, end, notificationDateTime, category}) {
        setOpen(true);
        setNewEvent(false);

        setKey(key);
        setInputActivity(activity);
        setInputNote(note);
        setInputCategory({value: category});
        
        let date = `${start.getFullYear()}-${start.getMonth()<10?'0':''}${start.getMonth()+1}-${start.getDate()<10?'0':''}${start.getDate()}`
        setStandardDate(date);
        setInputDate(date);
        let timeStart = `${start.getHours()<10?'0':''}${start.getHours()}:${start.getMinutes()<10?'0':''}${start.getMinutes()}`
        setInputTimeStart(timeStart);
        let timeEnd = `${end.getHours()<10?'0':''}${end.getHours()}:${end.getMinutes()<10?'0':''}${end.getMinutes()}`
        setInputTimeEnd(timeEnd);

        setNotify((Date.parse(start) - Date.parse(notificationDateTime))/60000);

        setInputActivityLength(false);        
    }
    return (
        <ScheduleItem 
            edit={canEditCalendar}
            onClick={() => eventChange(item)}
        >
            <ScheduleItemTime>
                {`${item.start.getHours()}:${item.start.getMinutes()<10?'0':''}${item.start.getMinutes()}~${item.end.getHours()}:${item.end.getMinutes()<10?'0':''}${item.end.getMinutes()}`}
                <ScheduleItemCategory>．{item.category}{'   '}{item.notMyself?'．外人異動過':''}</ScheduleItemCategory>
            </ScheduleItemTime>                      
            <ScheduleItemTitle>{item.activity}</ScheduleItemTitle>
            <ScheduleItemNote>{item.note}</ScheduleItemNote>
        </ScheduleItem>        
    )
}

export default ScheduleComponent
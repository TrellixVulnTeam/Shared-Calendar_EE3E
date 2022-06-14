import React, { useEffect, useState, createContext, useContext } from 'react';
// styled-components
import styledComponents from 'styled-components';
// react-modal-sheet
import Sheet from 'react-modal-sheet';
// CSS Reset
import "./style/document-reset.css";
import "./style/customize-reset.css";
// Firebase Firestore
import db from './firebase.js';
import { collection, addDoc, query, onSnapshot, doc, updateDoc, where, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate, useLocation } from "react-router-dom";
import { Wrapper, Container, Calendar, CalendarHeader, CalendarHeaderItem, CalendarDays, CalendarDay, Schedule, ScheduleList, ScheduleItem, ScheduleItemTime, ScheduleItemTitle, ScheduleItemNote, ScheduleItemCategory } from './components/calendar/calendarCSS';

// 頁首
import Header from './components/calendar/Header.js';
// 日曆
import CalendarComponent from './Calendar/CalendarComponent';
// 當日行程
import ScheduleComponent from './Schedule/ScheduleComponent';
// 頁尾
import Footer from './Footer/Footer.js';
// 彈出視窗(新增/編輯活動)
import ModalSheet from './Modal/ModalSheet.js';
// 彈出視窗(活動提醒通知訊息)
import BottomPopup from './components/BottomPopup';
// 彈出視窗(分享連結)
import SharePopup from './components/SharePopup';
// 彈出視窗(帳號管理)
import AccountPopup from './components/AccountPopup';
// 彈出視窗(設定)
import SettingPopup from './components/SettingPopup';

// 行程的 Key 值
export const ScheduleItemContext = createContext();

function App() {
  // 建立元素數目為 31，內容為 [0, 1, ..., 30]
const [counters, setCounters] = useState([...Array(31).keys()]);
  // 新增、編輯的 React Modal Sheet & 左側的 Side Navigation
  const [isOpen, setOpen] = useState(false); // 開發 true 正式 false
  const [newEvent, setNewEvent] = useState(true); // 新增 => true 編輯、刪除 => false
  const [key, setKey] = useState(''); // EditActivity & DeleteActivity
  // Event Name 為空、結束時間比開始時間早 ==> 跳出 Alert 字樣
  const [inputActivityLength, setInputActivityLength] = useState("");
  // Event Name *
  const [inputActivity, setInputActivity] = useState(''); 
  // Type the note here ...
  const [inputNote, setInputNote] = useState('');
  // 標準時間，利用時間篩選行程
  const [standardDate, setStandardDate] = useState(`2022-07-${new Date().getDate()<10?'0':''}${new Date().getDate()}`);
  const [inputDate, setInputDate] = useState(`2022-07-${new Date().getDate()<10?'0':''}${new Date().getDate()}`);
  // 開始時間
  const [inputTimeStart, setInputTimeStart] = useState('00:00');
  // 結束時間
  const [inputTimeEnd, setInputTimeEnd] = useState('00:00');
  // Firebase Firestore ... 行程、備註、日期、時間 ... 等資訊
  const [activities, setActivities] = useState([]);
  // 提醒時間（Input）
  const [notify, setNotify] = useState(0);
  // 現在時間 - 提醒時間 = 開始時間
  const [bell, setBell] = useState([]);
  // 使用者 ID
  const [uid, setUid] = useState('');
  // 朋友的 ID
  const [friendUid, setFriendUid] = useState('');
  // 使用者 Email
  const [userMail, setUserMail] = useState('');
  // 活動分類
  // const [inputCategory, setInputCategory] = useState('台塑');
  const [inputCategory, setInputCategory] = useState({value: '台塑'});
  // 哪一天有行程
  const [schedules, setSchedules] = useState([]);
  const [uniqueArr, setUniqueArr] = useState([]);
  // 彈出視窗(提醒): true 或 false
  const [showBottomPop, setShowBottomPop] = useState(false);  // 開發 true 正式 false
  // 彈出視窗(分享): true 或 false
  const [showSharePopup, setShowSharePopup] = useState(false);  // 開發 true 正式 false
  // 彈出視窗(設定): true 或 false
  const [showSettingPopup, setShowSettingPopup] = useState(false);  // 開發 true 正式 false
  // 彈出視窗(人物): true 或 false
  const [showAccountPopup, setShowAccountPopup] = useState(false);  // 開發 true 正式 false
  // 新的提醒資訊 + 新的提醒資訊
  const [news, setNews] = useState([])
  // 提醒 Icon 右上的小紅點
  const [realtime, setRealtime] = useState(false);
  // 你的行事曆想要分享給誰 ?
  const [friendMail, setFriendMail] = useState('');
  // 判斷現在是在本人的月曆還是在好友的月曆(本人:false、非本人:true)
  const [friendCalendar, setFriendCalendar] = useState(false);
  // 可以編輯月曆（本人、使用者給朋友的權限）True（可以編輯）False（不能編輯）
  const [canEditCalendar, setCanEditCalendar] = useState(true);
  // 使用者本人 --> 朋友
  const [readFriend, setReadFriend] = useState([]);
  const [editFriend, setEditFriend] = useState([]);
  // 朋友 --> 使用者本人 
  const [iReadFriend, setIReadFriend] = useState([]);
  const [iEditFriend, setIEditFriend] = useState([]);

  const { state } = useLocation();
  // const { userUid, mail } = state;
  let navigate = useNavigate();

  useEffect(() => {
    if (state === null) {
      navigate('/');
    } else {
      const { userUid, mail } = state;
      setUid(userUid);
      setUserMail(mail);
    }
  }, [])

  // 現在時間 dateTime
  const [dateTime, setDateTime] = useState(`2022-07-${new Date().getDate()<10?'0':''}${new Date().getDate()}T${new Date().getHours()<10?'0':''}${new Date().getHours()}:${new Date().getMinutes()<10?'0':''}${new Date().getMinutes()}`);
  useEffect(()=> {
    // setInterval
    const interval = setInterval(() => {
      setDateTime(`2022-07-${new Date().getDate()<10?'0':''}${new Date().getDate()}T${new Date().getHours()<10?'0':''}${new Date().getHours()}:${new Date().getMinutes()<10?'0':''}${new Date().getMinutes()}`);
    }, 6000);
    return () => clearInterval(interval);
  }, [])

  // 將此用者所擁有的行程資料置入 bell 裡面
  useEffect(() => {
    async function getData() {
        const q = query(collection(db, "activities"), where("uid", "==", uid), orderBy('notificationDateTime')); // userUid
        const querySnapshot = await getDocs(q);

        setBell(querySnapshot.docs.map(doc => (
          {
            "key": doc.id, 
            "activity": doc.data().activity,
            "note": doc.data().note,
            "category": doc.data().category, 
            "standardDateTime": new Date(doc.data().standardDateTime.seconds*1000),
            "start": new Date(doc.data().start.seconds*1000),
            "end": new Date(doc.data().end.seconds*1000),
            "notificationDateTime": new Date(doc.data().notificationDateTime.seconds*1000),
            "uid": doc.data().uid, 
          }
        )));
    }
    getData();
  }, [uid, dateTime])

  // 現在時間(dateTime) - 提醒時間 = 開始時間
  const [runOnce, setRunOnce] = useState(false);
  useEffect(() => {
    if (bell) {
      let tempArray = [];
      bell.forEach((item) => {
        // 提醒時間
        let remindDateTime = new Date(item.notificationDateTime)*1000;
        // 現在時間
        let nowDateTime = Date.parse(dateTime)*1000;
        if(nowDateTime === remindDateTime) {
          // setState(pre=> [...pre,{包物件}]) 
          // setRing(prevData => ([...prevData, item])); 

          setRunOnce(true);

          tempArray.push(item);
        } else {
          // 此時此刻是沒有活動需要被通知，但之前的提醒訊息需要被顯示
          if(runOnce === false) {            
            getDataInNotificationsDB();
          }
        }
      })
      // 將資料依序放入 notifications 資料庫中
      addDataInNotificationsDB(tempArray);  
    }
  }, [bell]);

  useEffect(() => {
    if(runOnce === true) {
      if (news.length > 0) {
        setRealtime(true);
      }
    }
  }, [news])

  const addDataInNotificationsDB = async(arrayContainsObjectData) => {
    arrayContainsObjectData.forEach(async(item) => {
      // 比對有沒有「重複」的活動，如果有的話將之前的那筆「更新」，如果沒有的話將資料「新增」
      checkDuplicateData(item)
    })
  }

  const checkDuplicateData = async(item) => {
    const q = query(collection(db, "notifications"), where("key", "==", item.key));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length>0) {
      //需要提醒的活動「更新」至 notifications 資料庫裡面
      const notificationRef = doc(db, "notifications", querySnapshot.docs[0].id);
      try {
        await updateDoc(notificationRef, {
          key: item.key, 
          activity: item.activity, 
          note: item.note,
          category: item.category,
          uid: item.uid,
          standardDateTime: item.standardDateTime, 
          start: item.start, 
          end: item.end,
          notificationDateTime: item.notificationDateTime, 
        });
        // 將資料置入資料庫後將資料取出置入 news 變數裡面
        getDataInNotificationsDB();
      } catch (error) {
        console.log("Error adding document", error);
      }            
    } else {
      //需要提醒的活動「新增」至 notifications 資料庫裡面
      try {
        await addDoc(collection(db, 'notifications'), {
            key: item.key, 
            activity: item.activity, 
            note: item.note,
            category: item.category,
            uid: item.uid,
            standardDateTime: item.standardDateTime, 
            start: item.start, 
            end: item.end,
            notificationDateTime: item.notificationDateTime, 
        });
        // 將資料置入資料庫後將資料取出置入 news 變數裡面
        getDataInNotificationsDB();
      } catch (error) {
        console.log("Error adding document", error);
      }  
    }
  }

  const getDataInNotificationsDB = async() => {
    const q = query(collection(db, "notifications"), where("uid", "==", uid)); // userUid

    const querySnapshot = await getDocs(q);

    setNews(querySnapshot.docs.map(doc => (
      {
        "key": doc.id, 
        "activity": doc.data().activity,
        "note": doc.data().note,
        "category": doc.data().category, 
        "standardDateTime": new Date(doc.data().standardDateTime.seconds*1000),
        "start": new Date(doc.data().start.seconds*1000),
        "end": new Date(doc.data().end.seconds*1000),
        "notificationDateTime": new Date(doc.data().notificationDateTime.seconds*1000),
        "uid": doc.data().uid,       
      }
    )));
  }

  // 誰可以「觀看」你的 Calendar
  useEffect(() => {
    const q = query(collection(db, "authority"), where("myUid", "==", uid), where("read", "==", false)); // userUid
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setReadFriend(querySnapshot.docs.map(doc => (
        {
          "key": doc.id,                    
          "friendMail": doc.data().friendMail, // 朋友的電子郵件
        }
      )));
    });
  }, [userMail]);
  // 誰可以「編輯」你的 Calendar
    useEffect(() => {
      const q = query(collection(db, "authority"), where("myUid", "==", uid), where("read", "==", true)); // userUid
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setEditFriend(querySnapshot.docs.map(doc => (
          {
            "key": doc.id,
            "friendMail": doc.data().friendMail,  // 朋友的電子郵件
          }
        )));
      });
    }, [userMail]);
  // 朋友分享給我權限(閱讀、編輯)
  // 朋友分享給我「觀看」權限
  useEffect(() => {
    const q = query(collection(db, "authority"), where("friendMail", "==", userMail), where("read", "==", false)); // mail
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setIReadFriend(querySnapshot.docs.map(doc => (
        {
          'key': doc.id, 
          'friendMail': doc.data().myMail, // 好友的 mail
          'friendUid': doc.data().myUid, // 好友的 id
        }
      )));
    });
  }, [userMail]);
  // 朋友分享給我「編輯」權限
  useEffect(() => {
    const q = query(collection(db, "authority"), where("friendMail", "==", userMail), where("read", "==", true)); // mail
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setIEditFriend(querySnapshot.docs.map(doc => (
        {
          'key': doc.id, 
          'friendMail': doc.data().myMail, // 好友的 mail
          'friendUid': doc.data().myUid, // 好友的 id
        }
      )));
    });
  }, [userMail]);  

  return (
    <ScheduleItemContext.Provider value={key}>
      <Wrapper>
        {/* header */}
        <Header />

        <Container>
          <Calendar>
            <CalendarHeader>
              <CalendarHeaderItem>Sun</CalendarHeaderItem>
              <CalendarHeaderItem>Mon</CalendarHeaderItem>
              <CalendarHeaderItem>Tue</CalendarHeaderItem>
              <CalendarHeaderItem>Wed</CalendarHeaderItem>
              <CalendarHeaderItem>Thu</CalendarHeaderItem>
              <CalendarHeaderItem>Fri</CalendarHeaderItem>
              <CalendarHeaderItem>Sat</CalendarHeaderItem>
            </CalendarHeader>
            <CalendarDays>
              <CalendarDay notCurrent>26</CalendarDay>
              <CalendarDay notCurrent>27</CalendarDay>
              <CalendarDay notCurrent>28</CalendarDay>
              <CalendarDay notCurrent>29</CalendarDay>
              <CalendarDay notCurrent>30</CalendarDay>
              {
                counters.length>0 && (
                  counters.map(item => (
                    <CalendarComponent 
                      key={item+1}
                      item={item}
                      friendCalendar={friendCalendar}
                      friendUid={friendUid}
                      uid={uid}
                      activities={activities}
                      setActivities={setActivities}
                      standardDate={standardDate}
                      setStandardDate={setStandardDate}
                      setInputDate={setInputDate}
                      schedules={schedules}
                      setSchedules={setSchedules}
                      uniqueArr={uniqueArr}
                      setUniqueArr={setUniqueArr}                
                    />

                  ))
                )
              }
              <CalendarDay notCurrent>1</CalendarDay>
              <CalendarDay notCurrent>2</CalendarDay>
              <CalendarDay notCurrent>3</CalendarDay>
              <CalendarDay notCurrent>4</CalendarDay>
              <CalendarDay notCurrent>5</CalendarDay>
              <CalendarDay notCurrent>6</CalendarDay>
            </CalendarDays>
          </Calendar>

          <Schedule>
            <ScheduleList>
              {
                activities.map((item) => (
                    <ScheduleComponent 
                        key={item.key}
                        item={item}
                        canEditCalendar={canEditCalendar}
                        setOpen={setOpen}
                        setNewEvent={setNewEvent}
                        setKey={setKey}
                        setInputActivity={setInputActivity}
                        setInputNote={setInputNote}
                        setInputCategory={setInputCategory}
                        setStandardDate={setStandardDate}
                        setInputDate={setInputDate}
                        setInputTimeStart={setInputTimeStart}
                        setInputTimeEnd={setInputTimeEnd}
                        setNotify={setNotify}
                        setInputActivityLength={setInputActivityLength}
                    />
                  )
                ) 
              }
            </ScheduleList>
          </Schedule>
        </Container>
      </Wrapper>

      {/* footer */}
      <Footer 
        changeModalState={setOpen}
        changeNewEvent={setNewEvent}
        cleanInputActivity={setInputActivity}
        cleanInputNote={setInputNote}
        cleanInputCategory={setInputCategory}
        resetStandardDate={setStandardDate}
        resetInputDate={setInputDate}
        resetInputTimeStart={setInputTimeStart}
        resetInputTimeEnd={setInputTimeEnd}
        inputActivityLength={inputActivityLength}
        changeInputActivityLength={setInputActivityLength}
        setShowBottomPop={setShowBottomPop}
        news={news}
        realtime={realtime}
        changeRealtime={setRealtime}
        setShowSharePopup={setShowSharePopup}
        setShowAccountPopup={setShowAccountPopup}
        friendCalendar={friendCalendar}
        canEditCalendar={canEditCalendar}
        setShowSettingPopup={setShowSettingPopup}
      />

      {/* react modal sheet */}
      <ModalSheet
        modalState={isOpen}
        changeModalState={setOpen}
        newEvent={newEvent}
        uid={uid}
        setActivities={setActivities}
        inputActivity={inputActivity}
        typeInputActivity={setInputActivity}
        inputNote={inputNote}
        typeInputNote={setInputNote}
        standardDate={standardDate}
        changeStandardDate={setStandardDate}
        inputDate={inputDate}
        changeInputDate={setInputDate}
        inputTimeStart={inputTimeStart}
        changeInputTimeStart={setInputTimeStart}
        inputTimeEnd={inputTimeEnd}
        changeInputTimeEnd={setInputTimeEnd}
        inputActivityLength={inputActivityLength}
        changeInputActivityLength={setInputActivityLength}
        notify={notify}
        changeNotify={setNotify}
        inputCategory={inputCategory}
        changeInputCategory={setInputCategory}
        friendCalendar={friendCalendar}
        friendUid={friendUid}
      />

      {/* 提醒 Popup */}
      {
        showBottomPop && (
          <BottomPopup 
            setShowBottomPop={setShowBottomPop}
            news={news}
            setNews={setNews}
            setStandardDate={setStandardDate}
            setInputDate={setInputDate}
            uid={uid}
            setActivities={setActivities}
          />
        )
      }
      {/* 分享 Popup */}
      {
        showSharePopup && (
          <SharePopup 
            friendMail={friendMail}
            setFriendMail={setFriendMail}
            uid={uid}
            userMail={userMail}
            setShowSharePopup={setShowSharePopup}
          />
        )
      }
      {/* 管理帳號 Popup */}
      {
        showAccountPopup && (
          <AccountPopup 
            uid={uid}
            setShowAccountPopup={setShowAccountPopup}
            schedules={schedules}
            setSchedules={setSchedules}
            setUniqueArr={setUniqueArr}
            setActivities={setActivities}
            friendCalendar={friendCalendar}
            setFriendCalendar={setFriendCalendar}
            readFriend={readFriend}
            editFriend={editFriend}
            iReadFriend={iReadFriend}
            iEditFriend={iEditFriend}
            friendUid={friendUid}
            setFriendUid={setFriendUid}
            canEditCalendar={canEditCalendar}
            setCanEditCalendar={setCanEditCalendar}
            standardDate={standardDate} // test
          />
        )
      }
      {/* 設定 Popup */}
      {
        showSettingPopup && (
          <SettingPopup 
            readFriend={readFriend}
            setReadFriend={setReadFriend}
            editFriend={editFriend}
            setEditFriend={setEditFriend}
            // iReadFriend={iReadFriend}
            // setIReadFriend={setIReadFriend}
            // iEditFriend={iEditFriend}
            // setIEditFriend={setIEditFriend}
            setShowSettingPopup={setShowSettingPopup}
          />
        )
      }
    </ScheduleItemContext.Provider>
  )
}

export default App
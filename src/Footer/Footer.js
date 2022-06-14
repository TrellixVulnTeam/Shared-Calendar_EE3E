import React, { useState, useEffect } from 'react'
// styled-components
import styledComponents, {keyframes} from 'styled-components';

const StickyFooter = styledComponents.footer`
    position: sticky;
    bottom: 0px;
    background-color: #fff;
    border-top: 1px solid #E8E8E8;

    display: flex;
    justify-content: space-around;

    padding: 8px 0px;

    height: 65px;

    grid-row: 2 / -1;
`

const Flex = styledComponents.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    cursor: pointer;

    position: relative;

    pointer-events: ${props => props.readOnly && 'none'};
    opacity: ${props => props.readOnly && '0.7'};

    pointer-events: ${props => props.edit===false ? 'none' : ''};
    opacity: ${props => props.edit===false ? '0.7' : ''};

    // animation: ${props => props.create && bounce} 2s linear infinite;
    animation: ${props => props.create && bounce} 2s linear 3;
    background-color: ${props => props.create && 'rgb(46, 204, 135)'};
    color: ${props => props.create && 'rgb(255,255,255)'};
    border-radius: ${props => props.create && '25px'};
    width: ${props => props.create && '50px'}50px;
    height: ${props => props.create && '50px'};
`

// Create the keyframes
const bounce = keyframes`
    0% {
        transform: scale(1,1) translate(0px, 0px);
    }

    30%{
        transform: scale(1,0.8) translate(0px, 10px); 
    }

    75%{
        transform: scale(1,1.1) translate(0px, -25px); 
    }

    100% {
        transform: scale(1,1) translate(0px, 0px);
    }
`;

const MarkNews = styledComponents.div`
    position: absolute;
    width: 15px;
    height: 15px;
    line-height: 15px;
    border-radius: 50%;
    background-color: ${props => props.news && 'red'};
    right: 12.5px;
    top: -5px;
    text-align: center;
    font-size: 8px;
`

function Footer({changeModalState, changeNewEvent, cleanInputActivity, cleanInputNote, cleanInputCategory, resetStandardDate, resetInputDate, resetInputTimeStart, resetInputTimeEnd, inputActivityLength, changeInputActivityLength, setShowBottomPop, news, realtime, changeRealtime, setShowSharePopup, setShowAccountPopup, friendCalendar, canEditCalendar, setShowSettingPopup}) {   
    // 按下「建立」按鈕，清除所有所需的 state
    const resetState = () => {
        changeModalState(prev => {
            return true;
        });
        changeNewEvent(prev => {
            return true;
        });
        cleanInputActivity(prev => {
            return '';            
        });
        cleanInputNote(prev => {
            return '';
        });
        cleanInputCategory(prev => {
            return {value: '台塑'};
        })
        // resetStandardDate(prev => {
        //     return `2022-07-${new Date().getDate()<10?'0':''}${new Date().getDate()}T08:00`;
        // });
        // resetInputDate(prev => {
        //     return `2022-07-${new Date().getDate()<10?'0':''}${new Date().getDate()}`;
        // });
        resetInputTimeStart(prev => {
            return `${new Date().getHours()<10?'0':''}${new Date().getHours()}:00`;
        });
        resetInputTimeEnd(prev => {
            return `${new Date().getHours()<10?'0':''}${new Date().getHours()}:00`;
        });
        changeInputActivityLength(prev => {
            return "";
        });
    }

    function read() {
        setShowBottomPop(true);
        changeRealtime(false);
    }

    return (
        <StickyFooter>      
            <Flex
                readOnly={friendCalendar}
                onClick={read}
            >
                <MarkNews news={realtime && true} />
                <span className="material-symbols-outlined">
                notifications
                </span>
                <span>提醒</span>
            </Flex>
            <Flex
                readOnly={friendCalendar}
                onClick={() => setShowSharePopup(true)}
            >
                <span className="material-symbols-outlined">
                share
                </span> 
                <span>分享</span>
            </Flex>            
            <Flex
                edit={canEditCalendar}
                onClick={resetState}
                create
            >
                <span className="material-symbols-outlined">
                add
                </span>
                <span>建立</span>
            </Flex>

            <Flex
                onClick={() => setShowAccountPopup(true)}
            >
                <span className="material-symbols-outlined">
                manage_accounts
                </span> 
                <span>人物</span>
            </Flex>            
            <Flex
                readOnly={friendCalendar}
                onClick={() => setShowSettingPopup(true)}          
            >
                <span className="material-symbols-outlined">
                tune
                </span>
                <span>設定</span>
            </Flex>
        </StickyFooter>
    )
}

export default Footer
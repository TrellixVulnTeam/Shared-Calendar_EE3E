import React, { useEffect, useState, useContext } from 'react';
import styledComponents from 'styled-components'
// Firebase Firestore
import db from '../firebase.js';
import { doc, deleteDoc } from 'firebase/firestore';

const Inner = styledComponents.div`
    border: 1px solid #e8e8e8;
    position: fixed;
    padding: 8px;
    text-align: center;
    top: 50%;
    left: 50%;
    width: 250px;
    height: 125px;
    transform: translate(-50%, -50%);
    color: rgb(46, 204, 135);
    background-color: rgb(255, 255, 255);

    display: flex;
    flex-direction: column;
    justify-content: space-around;    
`

const FlexButton = styledComponents.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
`

const Button = styledComponents.button`
    padding: 0 10px;

    border: none;
    outline: none;

    width: 40%;
    height: 25px;

    cursor: pointer;
    border-radius: 5px;

    font-weight: bold;

    color: ${props => props.delete ? 'rgb(255, 255, 255)' : 'rgb(143, 143, 143)'};
    background-color: ${props => props.delete ? 'rgb(46, 204, 135)' : 'rgb(255, 255, 255)'};

    &:hover {
        opacity: 0.8;
    }
`

function DoubleCheckPopup({doubleCheckMessageKey, setShowDoubleCheck}) {
    async function deleteFriendAuthority(doubleCheckMessageKey) {
        console.log(doubleCheckMessageKey);
        await deleteDoc(doc(db, "authority", doubleCheckMessageKey)); 
        setShowDoubleCheck(false);
    }

    return (
            <Inner
                onClick={(e) => {
                    e.stopPropagation();
                }}                
            >
                <div>確定要刪除嗎</div>

                <FlexButton>
                    <Button onClick={() => deleteFriendAuthority(doubleCheckMessageKey)} delete>刪除</Button>
                    <Button onClick={() => setShowDoubleCheck(false)} close>關閉視窗</Button>
                </FlexButton>
            </Inner>
    )
}

export default DoubleCheckPopup
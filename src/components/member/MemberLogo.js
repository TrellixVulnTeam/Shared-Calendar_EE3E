import React from 'react'
import styledComponents from 'styled-components';

const SmallTalk = styledComponents.p`
    margin-top: 13px;
    color: rgba(255,255,255,0.75);
`

const Title = styledComponents.h1`
    width: 254px;
    height: 48px;
    background: url(https://assets.timetreeapp.com/timetree-5949695b8124c04807c03878790fb063.png) center top no-repeat;
    background-size: contain;
    text-indent: 9999px;
`

function Logo() {
    return (
        <>
            <Title></Title>
            <SmallTalk>將大家的預定集中到一個行事曆上</SmallTalk>
        </>
    )
}

export default Logo
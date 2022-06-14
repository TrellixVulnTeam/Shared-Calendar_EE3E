import React, { useEffect, useState, useContext } from 'react';
import styledComponents from 'styled-components'

const Popup = styledComponents.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(0, 0, 0, 0.5);    
`

const Inner = styledComponents.div`
    position: absolute;
    padding: 8px;
    text-align: center;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 3%;
    color: rgb(46, 204, 135);
    background-color: rgb(255, 255, 255);
`

function MemberError({errorMessage}) {
    return (
        <Popup>
            <Inner>
                {errorMessage}
            </Inner>
        </Popup>
    )
}

export default MemberError
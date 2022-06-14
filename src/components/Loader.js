import React, { useState } from 'react';
import styledComponents, { keyframes } from 'styled-components'

// LoadingDots
const BounceAnimation = keyframes`
    0% { margin-bottom: 0; }
    50% { margin-bottom: 15px }
    100% { margin-bottom: 0 }
`;

const DotWrapper = styledComponents.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 48.5%;
    transform: translate(-50%, -50%);
    z-index: 1;
`;

const Dot = styledComponents.div`
    background-color:#2ecc87;    
    border-radius: 50%;
    width: 20px;
    height: 20px;
    &:nth-child(2) {
        margin: 0 8px;
    }
    /* Animation */
    animation: ${BounceAnimation} 0.5s linear infinite;
    animation-delay: ${props => props.delay};
`;

function Loader() {
  return (
    <DotWrapper>
        <Dot delay="0s" />
        <Dot delay=".1s" />
        <Dot delay=".2s" />
    </DotWrapper>
  )
}

export default Loader
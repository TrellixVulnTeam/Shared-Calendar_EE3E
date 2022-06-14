import React, { useState } from 'react'
import styledComponents from 'styled-components'

const NoticeBlock = styledComponents.div`
    margin-top: 60px;
    color: rgb(255, 255, 255);
    font-weight: bold;
`

function Notice() {
    return (
        <NoticeBlock>
            <p>將發送密碼重新設定信至下列電子郵件。</p>
        </NoticeBlock>
    )
}

export default Notice
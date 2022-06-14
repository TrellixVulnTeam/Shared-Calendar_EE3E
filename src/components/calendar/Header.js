import React from 'react';
// styled-components
import styledComponents from 'styled-components';

const StickyHeader = styledComponents.header`
  position: sticky;
  top: 0px;
  background-color: #fff;
  border-bottom: 1px solid #E8E8E8;

  padding: 8px 8px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
`

const MobileTitle = styledComponents.h1`
  font-size: 22px;
  text-align: center;
  grid-column: 2 / 3;
`

function Header() {
  return (
    <>
      <StickyHeader>
        <MobileTitle>2022年7月</MobileTitle>
      </StickyHeader>
    </>
  )
}

export default Header
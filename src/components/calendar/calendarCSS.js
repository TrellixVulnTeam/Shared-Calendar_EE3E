// styled-components
import styledComponents from 'styled-components';

export const Wrapper = styledComponents.div`
    grid-row: 1 / 2; // 父層 Grid
    display: flex;
    flex-direction: column;
`

export const Container = styledComponents.section`
    flex: 1 1;  // 父層 Flex
    display: flex;
    flex-direction: column;
    padding: 8px;
`

export const Calendar = styledComponents.div`
    border: 1px solid black;
    text-align: center;
`

export const CalendarHeader = styledComponents.ul`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding-bottom: 4px;
`

export const CalendarHeaderItem = styledComponents.li`
    justify-self: stretch;
`

export const CalendarDays = styledComponents.ul`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
`

export const CalendarDay = styledComponents.li`
    position: relative;
    justify-self: stretch;
    padding: 8px 0;
    margin: 4px;
    cursor: pointer;
    // 非七月
    z-index: ${props => props.notCurrent ? '-1' : ''};
    opacity: ${props => props.notCurrent ? '0.3' : ''};
    // 有行程
    background-color: ${props => props.busy ? '#78BE20' : ''};
    // 點擊
    color: ${props => props.active === true ? 'white' : ''};
    font-weight: ${props => props.active === true ? 'bold' : ''};
    // background-color: ${props => props.active ? 'rgba(51, 181, 229, 1)' : ''};
    background-color: ${props => props.active ? '#a0c4e6' : ''};
    // 滑鼠游移 ING
    &:hover { 
        color: black;
        // background-color: rgb(250, 250, 250);
        background-color: #e9f2f9;
    }
`

export const Schedule = styledComponents.div`
    flex: 1 1 150px;
    overflow-y: auto;
`

export const ScheduleList = styledComponents.ul`
`

export const ScheduleItem = styledComponents.li`
    margin-top: 8px;
    border: 1px solid #E8E8E8;
    padding: 8px;
    border-radius: 5px;

    pointer-events: ${props => props.edit===false ? 'none' : ''};
    opacity: ${props => props.edit===false ? '0.7' : ''};
    cursor: pointer;
    &:hover {
        opacity: 0.5;
    }
`

export const ScheduleItemTime = styledComponents.p`
    color: #8F9BB3;
`
export const ScheduleItemTitle = styledComponents.h3`
    font-size: 22px;
    color: #222B45;
`
export const ScheduleItemNote = styledComponents.p`
    color: #8F9BB3;
`

export const ScheduleItemCategory = styledComponents.span`
    color: #8F9BB3;
`

export const Popup = styledComponents.div`
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
import React from 'react'
import Header from "../../components/Header";
import './style.css'
function MeetingPage() {
    return (
        <div className='meeting__container'>
            
            <div className='meeting__header'>
                <h1>Realification</h1>
            </div>
            <div className="side__nav">
                <span className='active'>Home</span>
                <span>chat</span>
                <span>Meet</span>
                <span>Noti</span>
            </div>
            <div className='main__container'>
                main
            </div>
            <div className='chart__section'>
                chart
            </div>
            <div className='btn__section'>
                btn
            </div>


        </div>
    )
}

export default MeetingPage

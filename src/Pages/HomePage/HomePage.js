import React from 'react'
import './style.css'
import Header from "../../components/Header";
function HomePage() {
    return (

        <div>

            <Header />
        
        <div className='container'>
           
            <div className='left__container'>
                <h1> Premium video meetings based on <span>  AI </span> </h1>
                <h2>Make your student always happy</h2>

                <div className='new__meeting'>
                     New Meeting
                </div>

                <div className="__or">--or--</div>


                <div className="join__meeting">

                        <input className="input__box" type="text" placeholder="paste link" />
                        <button className="join__btn">Join</button>
                </div>


            </div>


            <div className='rigth__container'>
                <img src="../../lap.png" />
            </div>

        </div>

        </div>
    )
}


export default HomePage

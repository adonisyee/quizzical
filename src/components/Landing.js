import React from 'react'
import "../css/styles.css"

export default function Landing(props) {
    return (
        <div className='landing-container'>
            <h1 className="landing-title">Quizzical</h1>
            <p className="landing-description">Take a trivia quiz and see how you do!</p>
            <button className="landing-button" onClick={props.getQuestions}>Start Quiz</button>
        </div>
    )
}

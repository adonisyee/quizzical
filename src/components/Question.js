import React from 'react'
import "../css/styles.css"
import {nanoid} from "nanoid"

export default function Question(props) {

    const answerButtons = props.answers.map((answer) => {
        return (
                <div key={nanoid()} className="answers-selection">
                    <input
                        type="radio"
                        className={`${answer[1]}${props.showAnswers ? ' showAnswers' : ''}`}
                        id={answer[0]+props.id}
                        name={props.id}
                        value={answer[0]}
                        onChange={props.handleChange}
                        checked={props.formData[props.id] === answer[0]}
                        disabled={props.showAnswers}
                    />
                    <label htmlFor={answer[0]+props.id}>{decodeURIComponent(answer[0])}</label>
                </div>
            )
    })

    return (
        <div className='question-container'>
            <h2 className="question-question">{decodeURIComponent(props.question)}</h2>
            <div className="question-answers">
                {answerButtons}
            </div>
        </div>
    )
}

import React from "react"
import "./css/styles.css";
import Landing from "./components/Landing"
import Question from "./components/Question"
import {nanoid} from "nanoid"

export default function App() {
    const [questionData, setQuestionData] = React.useState([])
    const [showQuestions, setShowQuestions] = React.useState(false)
    const [showAnswers, setShowAnswers] = React.useState(false)
    const [formData, setFormData] = React.useState(initializeForm(10))

    //randomize order of array
    function shuffle(array) {
        let currentIndex = array.length,  randomIndex
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
        }
        return array
    }

    //initialize empty question answers
    function initializeForm(numQuestions) {
        const emptyForm = {}
        for (let i=0; i<numQuestions; i++) {
            emptyForm[i] = ''
        }
        return emptyForm
    }

    //get quiz questions from API and set state to display them
    function getQuestions() {
        fetch("https://opentdb.com/api.php?amount=10&encode=url3986")
        .then(res => res.json())
        .then(data => {
            const results = data.results.map((result) => join_answers(result))
            setQuestionData(results)
        })
        setShowQuestions(true)
    }

    //combine correct and incorrect answers, add record of which is which and shuffle them
    function join_answers(result) {
        const answer_choices = result.incorrect_answers.map((answer) => {
            return [answer, 'incorrect']
        })
        const correct = [result.correct_answer, 'correct']
        answer_choices.push(correct)
        let answer_choices_shuffled = []
        if (answer_choices.length === 2) {
            if (answer_choices[0][0]==='True') {
                answer_choices_shuffled = answer_choices
            } else {
                answer_choices_shuffled = [answer_choices[1], answer_choices[0]]
            }
        } else {
            answer_choices_shuffled = shuffle(answer_choices)
        }
        const updated_result = {
            ...result,
            'answers': answer_choices_shuffled
        }
        return updated_result
    }

    //reset questions to play again
    function playAgain() {
        getQuestions()
        toggleShowAnswers()
        setFormData(initializeForm(10))
    }

    //get number of correct answers given
    function getNumCorrect() {
        let numCorrect = 0
        for (let i=0; i<questionData.length; i++) {
            if (questionData[i].correct_answer === formData[i]) {
                numCorrect += 1
            }
        }
        return numCorrect
    }

    //toggle show answers, used to end game
    function toggleShowAnswers() {
        setShowAnswers(prevMode => !prevMode);
    }

    //update form
    function handleChange(event) {
        const {name, value} = event.target
        setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }))
    }

    //create question components from data
    const questions = []
    for (let i=0; i< questionData.length; i++) {
        questions.push((
            <Question
                key={nanoid()}
                id={i}
                question={questionData[i].question}
                answers={questionData[i].answers}
                formData={formData}
                handleChange={handleChange}
                showAnswers={showAnswers}
            />
        ))
    }

    return (
        <div className="container">
            <div className="blob1"></div>
            <div className="blob2"></div>
            {showQuestions ?
                <form className="questions-form">
                    {questions}
                    {showAnswers &&
                        <h3 className='show-score'>You scored {getNumCorrect()}/{questionData.length} correct answers</h3>
                    }
                    <button
                        type="button"
                        className="questions-check_button"
                        onClick={showAnswers ? playAgain : toggleShowAnswers}>
                        {showAnswers ? "Play Again" : "Check Questions"}
                    </button>
                </form>
                 :
                <Landing getQuestions={getQuestions}/>
            }

        </div>
    )
}

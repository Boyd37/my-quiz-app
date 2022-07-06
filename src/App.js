import React, { useEffect } from "react";
import Question from "./components/Question";
import { nanoid } from 'nanoid'

export default function App(){

    const [score, setScore] = React.useState(0)
    const [quizStart, setQuizStart] = React.useState(false)
    const [questionList, setQuestionList] = React.useState([])
    const [answers, setAnswers] = React.useState([])
    const [quizSubmit, setQuizSubmit] = React.useState(false)
    const [reset, setReset] = React.useState(false)

    function startQuiz(){
        //hides intro screen
        setQuizStart(true)
    }

    function resetQuiz(){
        //resets all state and flips reset status of quiz
        setQuestionList([])
        setAnswers([])
        setQuizSubmit(false)
        setScore(0)
        setReset(prevReset => !prevReset)
    }

    React.useEffect(()=> {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple&encode=url3986")
            .then(res => res.json())
            .then(data => {
                const questionArray = data.results
                const formattedQuestions = questionArray.map(question => {
                    return {questionTitle: question.question,
                            chosenOption: "",
                            correctAnswer: question.correct_answer,
                            allAnswers: shuffleAnswers(question.incorrect_answers, question.correct_answer),
                            id: nanoid()
                    }
                })  
                setQuestionList(formattedQuestions)
            })
    }, [reset])


    function shuffleAnswers(answerArray, correctAnswer){
        const randNum = Math.floor(Math.random()*4)
        answerArray.splice(randNum, 0, correctAnswer)
        return answerArray
    }

    function handleClick(id, answer) {
        if (quizSubmit){
            return
        }

        //if no item in answers array has an id equal to the question beind answered add answer object to array
        if (!answers.some(item => item.id === id)){
            setAnswers(prevAnswers => [...prevAnswers, {id: id, answer: answer}])
        //if item in array shares id equal to the question being answered map over array returning items as they are until item with shared id is found, then update that item object with a new answer
        } else {
            setAnswers(prevAnswers => {
                return prevAnswers.map(item => item.id === id ? {...item, answer: answer} : item)
            })
        }
        
        //update question with matching id with its chosen answer
        setQuestionList(prevQuestionList => {
            return prevQuestionList.map(question => {
                return question.id === id? {...question, chosenOption: answer} : question
            })
        }) 
    }

    function checkAnswers(){
        //for each element in answer array find same item id in question array
        answers.forEach(answer => {
            const correct = questionList.find(item => item.id === answer.id)

            if (correct.correctAnswer === answer.answer){
                setScore(prevScore => prevScore + 1)
            }
        })
        setQuizSubmit(true)
    
    }
            
    


    const questionElements = questionList.map(question => {
        return <Question
        key = {question.id}
        {...question}
        handleClick = {handleClick}
        quizSubmit = {quizSubmit} />

    })

    return(
        <main>
            {!quizStart? 
                <div className="start-display">
                    <h1 className="start-title">Quizz App</h1>
                    <p className="start-description">Quick fun quizzes!</p>
                    <button className="start-btn" onClick={startQuiz}>Start quiz</button> 
                </div>
                : 
                <div className="question-list">
                    {questionElements}
                    {
                        !quizSubmit? <button className="submit-btn" onClick={checkAnswers}>Check answers</button>
                        :
                        <div className="submit-container">
                            <p className="score-display">{`You scored ${score}/5 correct answers`}</p>
                            <button className="reset-btn" onClick={resetQuiz}>Play again</button>
                        </div>
                    }
                </div>    
            }
        </main>        
    )
}
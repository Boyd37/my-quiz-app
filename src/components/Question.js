import React from "react";

export default function Question(props){
    const answerOptions = props.allAnswers

    const answerElements = answerOptions.map(choice => {
        let className ="answer-option"
        if (choice === props.chosenOption) {
            className += " selected"
        }

        if (props.quizSubmit){
            if (choice === props.chosenOption && choice !== props.correctAnswer){
                className += " red"
            } else if (choice === props.correctAnswer){
                className += " green"
            } else {
                className += " not-correct"
            }
        }

        return (
            <div
                key = {choice}
                className={className}
                onClick={() => props.handleClick(props.id, choice)}>
                    {decodeURIComponent(choice)}
            </div>
        )
    })


    return(
        <div className="question-card">
            <h2 className="question-title">{decodeURIComponent(props.questionTitle)}</h2>
            <div className="answer-list">
                {answerElements}
            </div>    
        </div>
    )
}
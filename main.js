const setHighScoreCookie = highScore => {
    const daysToLast = 30
    let date = new Date()
    date.setTime(date.getTime() + (daysToLast * 24 * 60 * 60 * 1000))
    expires = `; expires=${date.toUTCString()}`
    document.cookie = `highscore=${highScore}${expires}; path=/`
}

const getHighScoreCookie = _ => {
    let highScoreCookie = document.cookie
    if (highScoreCookie.indexOf('highscore=') == 0) return highScoreCookie.substring('highscore='.length, highScoreCookie.length)
    return null
}


let correctAnswersStreak = 0
let badAnswers = ''
let rndCity
let rightAnswer

$(_ => {
    let highScoreFromCookie = getHighScoreCookie()
    if (highScoreFromCookie != null) {
        updateHighScore(highScoreFromCookie)
    }
    rndCity = getRndCity()
    changeCity(rndCity)
    $("#btn").click(() => {
        processAnswer()
    })
})

const processAnswer = _ => {
    check()
    updateHighScore(correctAnswersStreak)
    rndCity = getRndCity()
    changeCity(rndCity)
}

const changeCity = newCity => {
    $("#input").val("")
    $("#town").text(newCity)
}

function getRndCity() {
    let statesKeys = Object.keys(states)
    let rndStateCitiesArr = states[statesKeys[statesKeys.length * Math.random() << 0]]
    let rndCity = rndStateCitiesArr[rndStateCitiesArr.length * Math.random() << 0]
    return rndCity
}

const check = _ => {
    let input = $("#input").val()
    let formattedInput = input[0].toUpperCase() + Array.from(input).slice(1).join('').toLowerCase()

    let wasWrong = true
    for (const [state, cities] of Object.entries(states)) {
        if (cities.includes(rndCity)) rightAnswer = state
        if (state == formattedInput && cities.includes(rndCity)) wasWrong = false
    }
    wasWrong
        ? processWrongAnswer(input, rightAnswer)
        : processCorrectAnswer()
}

const updateHighScore = newScore => {
    if ($("footer").text() < newScore) {
        $("footer").text(newScore)
        setHighScoreCookie(newScore)
    }
}

const processWrongAnswer = (wrongAnswer, correctAnswer) => {
    let formattedWrongAnswer = wrongAnswer[0].toUpperCase() + Array.from(wrongAnswer).slice(1).join('').toLowerCase()
    $("#error").css("color", "#c23616")
    $("#error").text(`${formattedWrongAnswer} Correct answer: ${correctAnswer}`)
    correctAnswersStreak = 0
    badAnswers = formattedWrongAnswer + ', '
    $("section").prepend(badAnswers)
}

const processCorrectAnswer = _ => {
    correctAnswersStreak++
    $("#error").css("color", "#059435")
    $("#error").text(correctAnswersStreak)
}

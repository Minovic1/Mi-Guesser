let currentNumber, currentMin, currentMax, attempts;
let timer;
let timeLeft;
let gameCallback;

function randomNum(min, max) {
    return Math.floor(min + (max - min + 1) * Math.random());
}

function startGame(min, max, time) {
    clearInterval(timer); 
    currentNumber = randomNum(min, max);
    currentMin = min;
    currentMax = max;
    attempts = 0;
    timeLeft = time; 

    const userGuessInput = document.getElementById('user-guess');
    userGuessInput.value = '';
    userGuessInput.placeholder = "Your guess";
    userGuessInput.disabled = false;
    userGuessInput.focus();

    userGuessInput.removeEventListener('keydown', handleKeyDown);
    userGuessInput.addEventListener('keydown', handleKeyDown);

    document.getElementById('feedback-icon').innerHTML = "";
    document.getElementById('submit-button').disabled = false;
    document.getElementById('end-game-message').style.display = 'none';
    document.getElementById('win-message').style.display = 'none';
    document.getElementById('fail-message').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    document.getElementById('timer-progress').style.width = "100%"; 
    startTimer(time);
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        submitGuess();
    }
}

function startTimer(duration) {
    timeLeft = duration;
    const timerBar = document.getElementById('timer-progress');
    timerBar.style.width = "100%";

    timer = setInterval(() => {
        timeLeft--;
        let widthPercentage = (timeLeft / duration) * 100;
        timerBar.style.width = widthPercentage + "%";

        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame(false); 
        }
    }, 1000);
}

function submitGuess() {
    const userGuessInput = document.getElementById('user-guess');
    const feedbackIcon = document.getElementById('feedback-icon');
    const guess = parseInt(userGuessInput.value);

    if (isNaN(guess)) {
        feedbackIcon.innerHTML = 'error';
        feedbackIcon.style.color = "red";
        return;
    }

    attempts++;
    if (guess === currentNumber) {
        feedbackIcon.innerHTML = 'check_circle';
        feedbackIcon.style.color = "green";
        clearInterval(timer);
        userGuessInput.disabled = true;
        document.getElementById('submit-button').disabled = true;
        showWinMessage('Success!');
        setTimeout(() => {
            document.getElementById('win-message').style.display = 'none';
            closeGame();
            sendGameResult(true);
        }, 3000);
    } else if (guess < currentNumber) {
        feedbackIcon.innerHTML = 'arrow_upward';
        feedbackIcon.style.color = "yellow";
    } else {
        feedbackIcon.innerHTML = 'arrow_downward';
        feedbackIcon.style.color = "red";
    }
    userGuessInput.value = '';
}

function showWinMessage(message) {
    const winMessage = document.getElementById('win-message');
    winMessage.textContent = message;
    winMessage.style.display = 'block';
}

function showFailMessage(message) {
    const failMessage = document.getElementById('fail-message');
    failMessage.textContent = message;
    failMessage.style.display = 'block';
    setTimeout(() => {
        failMessage.style.display = 'none';
    }, 3000);
}

function sendGameResult(success) {
    fetch(`https://${GetParentResourceName()}/gameResult`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({ success })
    });
}

window.addEventListener('message', function(event) {
    if (event.data.action === 'open') {
        startGame(event.data.min, event.data.max, event.data.time);
    } else if (event.data.action === 'close') {
        closeGame();
    }
});

function closeGame() {
    clearInterval(timer); 
    document.getElementById('game').style.display = 'none';
    fetch(`https://${GetParentResourceName()}/closegame`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({})
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }
        return resp.json();
    })
    .then(data => {
        if (data.status === 'ok') {
        } else {
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function endGame(won) {
    clearInterval(timer);
    document.getElementById('user-guess').disabled = true;
    document.getElementById('submit-button').disabled = true;
    if (won) {
        showWinMessage('Congratulations, you won!');
        setTimeout(() => {
            document.getElementById('win-message').style.display = 'none';
            closeGame();
        }, 5000);
    } else {
        showFailMessage('Failed!');
        setTimeout(() => {
            document.getElementById('fail-message').style.display = 'none';
            closeGame();
            sendGameResult(false);
        }, 3000);
    }
}

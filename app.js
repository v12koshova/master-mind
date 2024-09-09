const buttons = document.querySelectorAll('[data-id].color')
const resetButton = [...document.querySelectorAll('.new-game')]

let winCombination  = []
let guessedCombination = []
let rows = [...document.querySelectorAll('.field-row')]
let row = document.querySelectorAll('.field-row.active .field-pin-place')


buttons.forEach(button => {
    button.addEventListener('click', handleClick)
})
document.querySelector('.delete-color').addEventListener('click', () => {
    guessedCombination.pop()
    row[guessedCombination.length].style.backgroundColor = '#f2f3f8'
})
resetButton.forEach(btn => {
        btn.addEventListener("click", () => {
            initializeGame();
        })
    }
);
initializeGame()
function initializeGame() {
    winCombination = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5).slice(0, 4)
  
    guessedCombination = []

    document.querySelector('.field-row.active').classList.remove('active')

    let pins = [...document.querySelectorAll('.field-row .field-pin-place')]
    pins.forEach(pin => {
        pin.style.backgroundColor = '#f2f3f8'
    })

    let answerPins = [...document.querySelectorAll('.field-answer-pin')]
    answerPins.forEach(pin => {
        pin.classList.remove(pin.classList[1])
    })
    
    rows.at(-1).classList.add('active')
    row = document.querySelectorAll('.field-row.active .field-pin-place')

    document.querySelector('.modal-wrap').style.display = 'none'
    document.querySelector('#modal-window').close()
}

function handleClick(e) {
    guessedCombination.push(+e.target.dataset.id)
    row[guessedCombination.length - 1].style.backgroundColor = e.target.style.backgroundColor
    if (guessedCombination.length === 4) {
        checkCombination()
        nextRow()
        guessedCombination = []
    }
}


function checkCombination() {
  let correct = 0;
  let includes = 0;
  let winCombinationCopy = [...winCombination];
  for (let i = 0; i < 4; i++) {
    if (guessedCombination[i] === winCombinationCopy[i]) {
      correct++;
      winCombinationCopy[winCombinationCopy.indexOf(guessedCombination[i])] =
        null;
    }
  }

  if (correct === 4) finishGame(true);
  else {
    for (let i = 0; i < 4; i++) {
      if (guessedCombination[i] !== winCombinationCopy[i]) {
        if (winCombinationCopy.includes(guessedCombination[i])) {
          includes++;
          winCombinationCopy[
            winCombinationCopy.indexOf(guessedCombination[i])
          ] = null;
        }
      }
    }
  }

  setAnswers(correct, includes);
}

function nextRow() {
    const index = rows.findIndex(row => row.classList.contains('active'))

    if (index === 0) {
        finishGame(false)
    } else {
        rows[index].classList.remove('active')
        rows[index - 1].classList.add('active')

        row = document.querySelectorAll('.field-row.active .field-pin-place')
    }
}

function setAnswers(correct, includes) {
    const answersPins = document.querySelectorAll('.field-row.active .field-answer-pin')
    for (let i = 0; i < 4; i++) {
        if (correct) {
            answersPins[i].classList.add('correct')
            correct--
        } else if (includes) {
            answersPins[i].classList.add('includes')
            includes--
        }
    }
}

function finishGame(result) {
    const text = document.querySelector('.modal-wrap .text')
    if (result) {
        text.textContent = "Congratulations!"
    } else {
        text.textContent = "Don't worry! Try again!"
    }
  document.querySelector(".modal-wrap").style.display = "block";
  document.querySelector("#modal-window").showModal();
  let pins = [...document.querySelectorAll(".modal-pins .field-pin-place")];
  pins.forEach((pin, i) => {
    pin.style.backgroundColor = document.querySelector(
      `[data-id='${winCombination[i]}'].color`
    ).style.backgroundColor;
  });
}
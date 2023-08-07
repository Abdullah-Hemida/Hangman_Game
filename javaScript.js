// letters that will we use
let letters = "abcdefghijklmnopqrstuvwxyz@#$%^&*()";
let arrayOfLetters = Array.from(letters);

// select all mussic effects
let startGameSound = document.querySelector(".start-game");
let trueletter = document.querySelector(".true");
let falseletter = document.querySelector(".false");
let successGame = document.querySelector(".success");
let gameOver = document.querySelector(".faild");
let clostofail = document.querySelector(".clostofail");
let mussicGame = setInterval(() => {
  startGameSound.play();
}, 10000);

// create span of letters
arrayOfLetters.forEach((letter) => {
  let letterSection = `<span class="letter-box">${letter.toLocaleUpperCase()}</span>`;
  let letterBox = document.querySelector(".letter-boxes");
  letterBox.insertAdjacentHTML("beforeend", letterSection);
});

// fetch source of words from json file
fetch("http://localhost:8080/hangManGame/hangmanWords.json")
  .then((respons) => respons.json())
  .then((words) => {
    ManageWord(words);   
  });

function ManageWord(words) {
  randomValueWord = getRandomWord(words);
  CreatLetterGuess(randomValueWord);
}

// get Random word.
function getRandomWord(words) {
  let myKey = Object.keys(words);
  let randomKeyNumber = Math.floor(Math.random() * myKey.length);
  let randomKey = myKey[randomKeyNumber];
  document.querySelector(".category-info span").innerHTML = randomKey;
  let randomValue = words[randomKey];
  let randomNumberValue = Math.floor(Math.random() * randomValue.length);
  return randomValue[randomNumberValue].toLowerCase();
  
}

// creat letter guess.
function CreatLetterGuess(randomValueWord) {
  let wordLetters = Array.from(randomValueWord);  
  wordLetters.forEach((wordLetter) => {
    let mySpan = document.createElement("span");
    if (wordLetter === " ") {
      mySpan.classList.add("with-space");
      mySpan.textContent = "-";
    }
    let myGeussLetter = document.querySelector(".letter-guess");
    myGeussLetter.appendChild(mySpan);
  });
  CheckLetters( wordLetters)  
}

function CheckLetters(wordLetters) {
  // when letter is clicked
  let countStatFalse = 0;
  let countStatTrue = 0;
  document.addEventListener("click", (e) => {
    if (e.target.className === "letter-box") {
      e.target.classList.add("clicked");
      let selectedLetter = e.target.textContent.toLowerCase();
      let status = false;
      wordLetters.forEach((wordletter, wordletterIndex) => {
        // if the clicked letter is true
        if (selectedLetter === wordletter) {
          lettersucceded(selectedLetter,wordletterIndex);
          status = true;
          countStatTrue++;
        }
      });
      // if number of attemps = number of letters
      let myRexp = / /g;
      let filteredwordLetters = randomValueWord.replace(myRexp, "");
      if (countStatTrue === filteredwordLetters.length) {
        GameSuccess(countStatFalse);
      }
      // if clicked letter is false
      if (status === false) {
        countStatFalse++;
        letterFailed(countStatFalse);
      }
    }
  });
}

function lettersucceded(selectedLetter,wordletterIndex) {
  let mygeussLetterSpans = document.querySelectorAll(".letter-guess span");
  trueletter.play();
  mygeussLetterSpans[wordletterIndex].innerHTML = selectedLetter;
}

function letterFailed(countStatFalse) {
  falseletter.play();
  document
    .querySelector(".hang-man-draw")
    .classList.add(`appear-${countStatFalse}`);
  if (countStatFalse === 6) {
    clostofail.play();
  }
  // whene number of attemps = 8
  if (countStatFalse === 8) {
    GameOver(countStatFalse);
  }
}

// the poppup of game success
function GameSuccess(countStatFalse) {
  DisableClick();
  clearInterval(mussicGame);
  successGame.play();
  // create poppup
  let mySuccessPopup = `<div class="my-popup">
                           <button class="close-button onclick="closeThePupup()">X</button>
                           <span class="the-message">Game Sucsess</span>
                           <span class="the-word">the word is: <span> ${randomValueWord}</span></span>
                           <span class="the-level"> your level is: <span>${Math.round(
                             ((8 - countStatFalse) / 8) * 100
                           )}%</span></span>
                           </div>`;

  document.body.insertAdjacentHTML("afterbegin", mySuccessPopup);
  //whene close popup
  let myClosButton = document.querySelector(".close-button");
  myClosButton.addEventListener("click", () => {
    let mySuccessPopup = document.querySelector(".my-popup");
    mySuccessPopup.style.display = "none";
  });
}

// the poppup of game over
function GameOver(countStatFalse) {
  DisableClick();
  clearInterval(mussicGame);
  gameOver.play();
  // create poppup
  let myfailedPopup = `<div class="my-popup">
                   <button class="close-button onclick="closeThePupup()">X</button>
                   <span class="the-message">Game Over</span>
                   <span class="the-word">the word is: <span> ${randomValueWord}</span></span>
                   <span class="the-level"> your level is: <span>${Math.round(
                    ((8 - countStatFalse) / 8) * 100
                   )}%</span></span>
                   </div>`;

  document.body.insertAdjacentHTML("afterbegin", myfailedPopup);
  //whene close popup
  let myClosButton = document.querySelector(".close-button");
  myClosButton.addEventListener("click", () => {
    let myfailedPopup = document.querySelector(".my-popup");
    myfailedPopup.style.display = "none";
  });
}

function DisableClick() {
  let allLetterBoxes = document.querySelectorAll(".letter-boxes span");
  allLetterBoxes.forEach((L) => {
    L.classList.add("disable-Click");
  });
}
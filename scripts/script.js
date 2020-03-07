var timeEl = document.getElementById("timer");
var secondsLeft = 70;
var timerInterval;

var qTitle = document.getElementById("Question");
var c1El = document.getElementById("btnA1");
var c2El = document.getElementById("btnA2");
var c3El = document.getElementById("btnA3");
var c4El = document.getElementById("btnA4");
var sTakeQ = document.getElementById("takeQuiz");
var sScore = document.getElementById("finalScore");
var sMain = document.getElementById("startQuiz");
var msgEl = document.getElementById("result");
var msgDone = document.getElementById("msgQuizDone");
var msgScoreEl = document.getElementById("msgScore");

var numCorrectAnswers = 0;
var numTotalQuestions = 0;
var idxQuestion = 0;  // first question starts at 0
var blnCorrect = false;
var finalscore = 0;
var blnFinalQuestion = false;

sTakeQ.addEventListener("click", function (event) {
  var element = event.target;
  if (element.matches("button")) {
    //which button did they click
    // console.log("button clicked: " + element.id);
    // alert("You clicked the "+element.getAttribute("data-answered")+" answer");

    msgEl.textContent = element.getAttribute("data-answered");
    msgEl.style.color = "red";
    // console.log(msgEl);
    if (element.getAttribute("data-answered") === "Correct") {
      blnCorrect = true;
      msgEl.style.color = "green";
      numCorrectAnswers++;
    } else {
      // incorrect answer, penalize them 15 second
      secondsLeft -= 15;
      checkTimeRemaining();

    }
    // alert("loading next question idxQuestion is"+idxQuestion);
    // load the next question
    idxQuestion++;
    loadQuestion();
  }

});

function loadQuestion() {
  var idxCorrect = -99;
  if (questions[idxQuestion] === undefined) {
    // Now reached the end of file on questions array
    blnFinalQuestion = true;
    //disable the buttons so they cannot keep scoring points!
    disableQuiz();
    return;
  }
  var correctAnswer = questions[idxQuestion].answer;
  numTotalQuestions++;

  //we have a global questions array already in memory, and the current index
  qTitle.textContent = questions[idxQuestion].title;

  //add processing to shuffle the answer choices in case they took this quick before
  questions[idxQuestion].choices.sort(function() {
          return 0.5 - Math.random();
        });


  // find out which choice is the correct one
  for (i = 0; i < questions[idxQuestion].choices.length; i++) {
    if (questions[idxQuestion].choices[i] === correctAnswer) {
      idxCorrect = i;
    }
  }

  c1El.textContent = questions[idxQuestion].choices[0];
  c2El.textContent = questions[idxQuestion].choices[1];
  c3El.textContent = questions[idxQuestion].choices[2];
  c4El.textContent = questions[idxQuestion].choices[3];

  c1El.setAttribute("data-answered", "Incorrect");
  c2El.setAttribute("data-answered", "Incorrect");
  c3El.setAttribute("data-answered", "Incorrect");
  c4El.setAttribute("data-answered", "Incorrect");

  switch (idxCorrect) {
    case 0:
      c1El.setAttribute("data-answered", "Correct");
      break;
    case 1:
      c2El.setAttribute("data-answered", "Correct");
      break;
    case 2:
      c3El.setAttribute("data-answered", "Correct");
      break;
    case 3:
      c4El.setAttribute("data-answered", "Correct");
      break;

  }

}


function setTime() {
  timerInterval = setInterval(function () {
    secondsLeft--;

    if (!secondsLeft > 0) {
      secondsLeft = 0;
    }
    // timeEl.textContent = "Time: "+ secondsLeft;
    timeEl.textContent = "Time: " + secondsLeft.toString().padStart(2, '0');
    checkTimeRemaining();

  }, 1000);
}

function checkTimeRemaining() {

  if (secondsLeft <= 0 || blnFinalQuestion) {
    disableQuiz();
    clearInterval(timerInterval);

    showFinalScore();
  }
}

function showFinalScore() {
  // hide the main section and the quiz section
  sTakeQ.classList.add("d-none")
  // sMain.classList.add("d-none");
  sScore.classList.remove("d-none");
  document.getElementById("msgQuizDone").textContent = "All done!";
  if (!secondsLeft > 0) {
    secondsLeft = 0;
  }

  // var finalscore = 0;
  // had scope issues, made global for now
  finalscore = 0;
  if (numCorrectAnswers > 0) {

    finalscore = Math.round(100 * (numCorrectAnswers / numTotalQuestions) + (0.2 * secondsLeft));
    if (finalscore > 100) {
      finalscore = 100;
    }
  }
  console.log("note: Total questions= " + numTotalQuestions + "\n correct answers= " + numCorrectAnswers + "\n seconds left= " + secondsLeft + "\n final score= " + finalscore);

  document.getElementById("msgScore").textContent = "Your final score is " + finalscore;

  // document.getElementById("msgScore").textContent = "Your final score is "+ (idxCorrect/numTotalQuestions)+(0.2*secondsLeft);
  // completely bogus waste of hours, the 2 lines above this work, and the 2 commented lines below do Not work
  // msgDone.getElementById("msgQuizDone").textContent = "All done!";
  // msgScoreEl.getElementById("msgScore").textContent = "Your final score is "+ (idxCorrect/numTotalQuestions)+(0.2*secondsLeft);
}

function takeQuiz() {

  //populate 1st quiz question
  idxQuestion = 0;
  loadQuestion();
  // hide the main section
  sMain.classList.add("d-none");
  sTakeQ.classList.remove("d-none");

  //  start timer 
  setTime();

}

function disableQuiz() {
  c1El.disabled = true;
  c1El.classList.remove("btn-primary");
  c1El.classList.add("btn-secondary");
  c2El.disabled = true;
  c2El.classList.remove("btn-primary");
  c2El.classList.add("btn-secondary");
  c3El.disabled = true;
  c3El.classList.remove("btn-primary");
  c3El.classList.add("btn-secondary");
  c4El.disabled = true;
  c4El.classList.remove("btn-primary");
  c4El.classList.add("btn-secondary");
}

document.querySelector("#startBtn").onclick = function (event) {

  // user clicks the Start Quiz button
  // hide the startQuiz section and show the takeQuiz section

  if (event === null) {
    return;
  }

  takeQuiz();
}



document.querySelector("#submitBtn").onclick = function (event) {

  if (event === null) {
    return;
  }
  //Don't allow user to click submit if they haven't entered initials
  if (document.getElementById("xInitials").value.length === 0) {
    alert("Please enter your initials to submit your quiz score.");
    return;
  }
  if (finalscore === 0) {
    alert("Sorry, more Googlefoo for you - your score must be above a zero to be saved on the wall of fame.");
    return;
  }
  // store final score to localstorage
  // first try to retrieve scores from local storage in case the quiz has been taken before

  Scores = JSON.parse(localStorage.getItem('highscores'));

  if (Scores !== null) {

    Scores.push({
      'initials': document.getElementById("xInitials").value,
      'highscore': finalscore
    });
  } else {
    // Converting to JSON string with JSON.stringify()
    // then saving with localStorage
    Scores = [];
    Scores.push({
      'initials': document.getElementById("xInitials").value,
      'highscore': finalscore
    });
  }
  localStorage.setItem('highscores', JSON.stringify(Scores));
  document.getElementById("submitBtn").disabled = true;
  document.getElementById("submitBtn").remove("btn-primary");
  // document.getElementById("submitBtn").add("btn-secondary");
  sScore.classList.add("d-none");
  document.location.href= "index.html";

}
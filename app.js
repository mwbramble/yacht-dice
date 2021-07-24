const d = document;

d.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));
d.getElementById(localStorage.getItem('theme')).selected = true;

const ONES = d.getElementById('ones-score');
const TWOS = d.getElementById('twos-score');
const THREES = d.getElementById('threes-score');
const FOURS = d.getElementById('fours-score');
const FIVES = d.getElementById('fives-score');
const SIXES = d.getElementById('sixes-score');
const CHOICE = d.getElementById('choice-score');
const QUAD = d.getElementById('quad-score');
const FHOUSE = d.getElementById('fhouse-score');
const SSTRAIGHT = d.getElementById('sstraight-score');
const LSTRAIGHT = d.getElementById('lstraight-score');
const YACHT = d.getElementById('yacht-score');

const CONTAINER = d.getElementById('container');
const RULES = d.getElementById('rules');

let score = 0;
let turnsRemaining = 3;
let lockedDie = 0;
let round = 1;
let roll = [];
let subtotal = 0;
let bonusGiven = false;
let newPlayer = true;
let finalScore = [];

// Placeholder for when I want to control what the dice are.
// function rollDice(){
//   roll = [6, 6, 6, 6, 6];
//   calculateScores(roll);
// }

// Rolls the dice.
function rollDice(){
  if(turnsRemaining > 0 && round <= 12 && lockedDie != 5){
    for(let i = 1; i < 6; i++){
      let currDie = d.getElementById(`d${i}`);
      currDie.classList.add('valid-selectable');
      if(!currDie.classList.contains('selected')){
        let num = Math.floor(Math.random() * 6) + 1;
        currDie.innerHTML = num;
        roll[i - 1] = num;
      }
    }
    turnsRemaining -= 1;
    d.getElementById('turn-num').innerHTML = turnsRemaining;
    calculateScores(roll);
  }
  if(lockedDie === 5){
    alert('You cannot roll when all dice are locked!');
  }
}

// Locks the selected die, making it unusable for the next roll.
function lock(n){
  if(turnsRemaining < 3){
    let currDie = d.getElementById(`d${n}`);
    // currDie.classList.contains('selected') ? currDie.classList.remove('selected') : currDie.classList.add('selected');
    if(currDie.classList.contains('selected')){
      currDie.classList.remove('selected');
      currDie.classList.add('valid-selectable');
    }
    else{
      currDie.classList.remove('valid-selectable');
      currDie.classList.add('selected');
    }
    lockedDie++;
  }
}

// Calculates scoring for every category given the current roll.
function calculateScores(arr){
  let ones = 0, twos = 0, threes = 0, fours = 0, fives = 0, sixes = 0, choice = 0;

  // Sums up ones through sixes, then adds them all together for choice.
  for(let i = 0; i < arr.length; i++){
    switch(arr[i]){
      case 1:
        ones += 1;
        break;
      case 2:
        twos += 2;
        break;
      case 3:
        threes += 3;
        break;
      case 4:
        fours += 4;
        break;
      case 5:
        fives += 5;
        break;
      case 6:
        sixes += 6;
        break;
    }
  }

  choice = ones + twos + threes + fours + fives + sixes;

  // Checks for full house.
  if(FHOUSE.classList.contains('submitted') === false){
    fullHouse(roll, choice);
  }

  // Checks for four of a kind.
  if(QUAD.classList.contains('submitted') === false){
    fourOfKind(roll, choice);
  }

  // Checks for small and large straights.
  const sm1 = [1, 2, 3, 4];
  const sm2 = [2, 3, 4, 5];
  const sm3 = [3, 4, 5, 6];

  const lg1 = [1, 2, 3, 4, 5];
  const lg2 = [2, 3, 4, 5, 6];

  function straightCheck(data, example){
    return example.every(val => data.indexOf(val) >= 0);
  }

  if(SSTRAIGHT.classList.contains('submitted') === false){
    if(straightCheck(arr, sm1) || straightCheck(arr, sm2) || straightCheck(arr, sm3)){
      SSTRAIGHT.innerHTML = 15;
    }
    else{
      SSTRAIGHT.innerHTML = 0;
    }
    SSTRAIGHT.classList.add('valid-option');
  }

  if(LSTRAIGHT.classList.contains('submitted') === false){
    if(straightCheck(arr, lg1) || straightCheck(arr, lg2)){
      LSTRAIGHT.innerHTML = 30;
    }
    else{
      LSTRAIGHT.innerHTML = 0;
    }
    LSTRAIGHT.classList.add('valid-option');
  }

  fillTable(ones, twos, threes, fours, fives, sixes, choice);

  if(YACHT.classList.contains('submitted') === false){
    arr.every(v => v === arr[0]) ? YACHT.innerHTML = 50 : YACHT.innerHTML = 0;
    YACHT.classList.add('valid-option');
  }
}

function fullHouse(arr, sum){
  let count = {};
  for(let n of arr){
    count[n] = (count[n] || 0) + 1;
  }
  let vals = Object.values(count);
  if((vals[0] === 2 && vals[1] === 3 || vals[0] === 3 && vals[1] === 2)){
    FHOUSE.innerHTML = sum;
    FHOUSE.classList.add('valid-option');
  }
  else{
    FHOUSE.innerHTML = 0;
    FHOUSE.classList.add('valid-option');
  }
}

function fourOfKind(arr, sum){
  let count = {};
  for(let n of arr){
    count[n] = (count[n] || 0) + 1;
  }
  let vals = Object.values(count);
  if((vals[0] === 4 || vals[1] === 4)){
    QUAD.innerHTML = sum;
    QUAD.classList.add('valid-option');
  }
  else{
    QUAD.innerHTML = 0;
    QUAD.classList.add('valid-option');
  }
}

// Populates table with remaining potential scores.
function fillTable(ones, twos, threes, fours, fives, sixes, choice){
  ONES.classList.contains('submitted') ? null : (ONES.innerHTML = ones), (ONES.classList.add('valid-option'));
  TWOS.classList.contains('submitted') ? null : (TWOS.innerHTML = twos), (TWOS.classList.add('valid-option'));
  THREES.classList.contains('submitted') ? null : (THREES.innerHTML = threes), (THREES.classList.add('valid-option'));
  FOURS.classList.contains('submitted') ? null : (FOURS.innerHTML = fours), (FOURS.classList.add('valid-option'));
  FIVES.classList.contains('submitted') ? null : (FIVES.innerHTML = fives), (FIVES.classList.add('valid-option'));
  SIXES.classList.contains('submitted') ? null : (SIXES.innerHTML = sixes), (SIXES.classList.add('valid-option'));
  CHOICE.classList.contains('submitted') ? null : (CHOICE.innerHTML = choice), (CHOICE.classList.add('valid-option'));
}

// Clears unsubmitted scores from table.
function clearTable(){
  ONES.classList.contains('submitted') ? null : (ONES.innerHTML = ''), (ONES.classList.remove('valid-option'));
  TWOS.classList.contains('submitted') ? null : (TWOS.innerHTML = ''), (TWOS.classList.remove('valid-option'));
  THREES.classList.contains('submitted') ? null : (THREES.innerHTML = ''), (THREES.classList.remove('valid-option'));
  FOURS.classList.contains('submitted') ? null : (FOURS.innerHTML = ''), (FOURS.classList.remove('valid-option'));
  FIVES.classList.contains('submitted') ? null : (FIVES.innerHTML = ''), (FIVES.classList.remove('valid-option'));
  SIXES.classList.contains('submitted') ? null : (SIXES.innerHTML = ''), (SIXES.classList.remove('valid-option'));
  CHOICE.classList.contains('submitted') ? null : (CHOICE.innerHTML = ''), (CHOICE.classList.remove('valid-option'));
  QUAD.classList.contains('submitted') ? null : (QUAD.innerHTML = ''), (QUAD.classList.remove('valid-option'));
  FHOUSE.classList.contains('submitted') ? null : (FHOUSE.innerHTML = ''), (FHOUSE.classList.remove('valid-option'));
  SSTRAIGHT.classList.contains('submitted') ? null : (SSTRAIGHT.innerHTML = ''), (SSTRAIGHT.classList.remove('valid-option'));
  LSTRAIGHT.classList.contains('submitted') ? null : (LSTRAIGHT.innerHTML = ''), (LSTRAIGHT.classList.remove('valid-option'));
  YACHT.classList.contains('submitted') ? null : (YACHT.innerHTML = ''), (YACHT.classList.remove('valid-option'));
}

// Resets dice for new round.
function resetDice(){
  for(let i = 1; i < 6; i++){
    d.getElementById(`d${i}`).classList.remove('selected');
    d.getElementById(`d${i}`).innerHTML = '';
  }
  lockedDie = 0;
  roll = [];
}

// Submits player's score from that round and advances game to next round.
function selectScore(e){
  if(e.innerHTML !== '' && !e.classList.contains('submitted')){
    if(e.id === 'ones-score' || e.id === 'twos-score' || e.id === 'threes-score' || e.id === 'fours-score' || e.id === 'fives-score' || e.id === 'sixes-score'){
      subtotal += parseInt(e.innerHTML);
    }
    e.classList.add('submitted');
    e.classList.remove('valid-option');
    score += parseInt(e.innerHTML);
    round++;
    turnsRemaining = 3;
    resetDice();
    checkBonus();
    updateDisplays();
    clearTable();
  }
}

function updateDisplays(){
  d.getElementById('round-num').innerHTML = round;
  d.getElementById('score-num').innerHTML = score;
  d.getElementById('turn-num').innerHTML = 3;
  d.getElementById('sub-num').innerHTML = subtotal;
  if(round === 13){
    d.getElementById('display').innerHTML = (`Game Over! Your Score: ${score}`);
    d.getElementById('play-again').classList.remove('hidden');
    for(let i = 1; i < 6; i++){
      let currDie = d.getElementById(`d${i}`);
      currDie.classList.remove('valid-selectable');
    }
    saveScore();
    checkHiScore();
  }
}

function checkBonus(){
  if(!bonusGiven && subtotal >= 63){
    d.getElementById('bonus-num').innerHTML = 35;
    score += 35;
    bonusGiven = true;
  }
}

function checkHiScore(){
  if(!localStorage.getItem('hiScore')){
    localStorage.setItem('hiScore', 0);
  }
  if(score > localStorage.getItem('hiScore')){
    localStorage.setItem('hiScore', score);
  }
  d.getElementById('hiscore-num').innerHTML = localStorage.getItem('hiScore');

  if(!localStorage.getItem('lowScore')){
    localStorage.setItem('lowScore', 322);
  }
  if(score !== 0 && score < localStorage.getItem('lowScore')){
    localStorage.setItem('lowScore', score);
  }

  if(newPlayer){
    localStorage.setItem('hiScore', 0);
    localStorage.setItem('lowScore', null);
  }
  else{
    if(score > localStorage.getItem('hiScore')){
      localStorage.setItem('hiScore', score);
    }
    d.getElementById('hiscore-num').innerHTML = localStorage.getItem('hiScore');

    if(score !== 0 && score < localStorage.getItem('lowScore')){
      localStorage.setItem('lowScore', score);
    }
  }
}

function toggleRules(){
  CONTAINER.classList.contains('hidden') ? CONTAINER.classList.remove('hidden') : CONTAINER.classList.add('hidden');
  RULES.classList.contains('hidden') ? RULES.classList.remove('hidden') : RULES.classList.add('hidden');
}

function showLowScore(){
  // make it not show up if localstorage lowscore is null or something
  if(d.getElementById('lowscore-num').innerHTML === ''){
    d.getElementById('lowscore-num').innerHTML = ` | Low Score: ${localStorage.getItem('lowScore')}`;
  }
  else{
    d.getElementById('lowscore-num').innerHTML = '';
  }
}

function changeTheme(e){
  d.documentElement.setAttribute('data-theme', e);
  localStorage.setItem('theme', e);
}
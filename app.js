// TODO: add personal best score to localstorage

const d = document;

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

let score = 0;
let turnsRemaining = 3;
let round = 1;
let roll = [];
let subtotal = 0;

// Placeholder for when I want to control what the dice are.
// function rollDice(){
//   roll = [6, 6, 6, 6, 6];
//   calculateScores(roll);
// }

// Rolls the dice.
function rollDice(){
  if(turnsRemaining > 0 && round <= 12){
    for(let i = 1; i < 6; i++){
      let currDie = d.getElementById(`d${i}`);
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
}

// Locks the selected die, making it unusable for the next roll.
function lock(n){
  if(turnsRemaining < 3){
    let currDie = d.getElementById(`d${n}`);
    currDie.classList.contains('selected') ? currDie.classList.remove('selected') : currDie.classList.add('selected');
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
  }

  if(LSTRAIGHT.classList.contains('submitted') === false){
    if(straightCheck(arr, lg1) || straightCheck(arr, lg2)){
      LSTRAIGHT.innerHTML = 30;
    }
    else{
      LSTRAIGHT.innerHTML = 0;
    }
  }

  fillTable(ones, twos, threes, fours, fives, sixes, choice);

  if(YACHT.classList.contains('submitted') === false){
    arr.every(v => v === arr[0]) ? YACHT.innerHTML = 50 : YACHT.innerHTML = 0;
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
  }
  else{
    FHOUSE.innerHTML = 0;
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
  }
  else{
    QUAD.innerHTML = 0;
  }
}

// Populates table with remaining potential scores.
function fillTable(ones, twos, threes, fours, fives, sixes, choice){
  ONES.classList.contains('submitted') ? null : ONES.innerHTML = ones;
  TWOS.classList.contains('submitted') ? null : TWOS.innerHTML = twos;
  THREES.classList.contains('submitted') ? null : THREES.innerHTML = threes;
  FOURS.classList.contains('submitted') ? null : FOURS.innerHTML = fours;
  FIVES.classList.contains('submitted') ? null : FIVES.innerHTML = fives;
  SIXES.classList.contains('submitted') ? null : SIXES.innerHTML = sixes;
  CHOICE.classList.contains('submitted') ? null : CHOICE.innerHTML = choice;
}

// Clears unsubmitted scores from table.
function clearTable(){
  ONES.classList.contains('submitted') ? null : ONES.innerHTML = '';
  TWOS.classList.contains('submitted') ? null : TWOS.innerHTML = '';
  THREES.classList.contains('submitted') ? null : THREES.innerHTML = '';
  FOURS.classList.contains('submitted') ? null : FOURS.innerHTML = '';
  FIVES.classList.contains('submitted') ? null : FIVES.innerHTML = '';
  SIXES.classList.contains('submitted') ? null : SIXES.innerHTML = '';
  CHOICE.classList.contains('submitted') ? null : CHOICE.innerHTML = '';
  QUAD.classList.contains('submitted') ? null : QUAD.innerHTML = '';
  FHOUSE.classList.contains('submitted') ? null : FHOUSE.innerHTML = '';
  SSTRAIGHT.classList.contains('submitted') ? null : SSTRAIGHT.innerHTML = '';
  LSTRAIGHT.classList.contains('submitted') ? null : LSTRAIGHT.innerHTML = '';
  YACHT.classList.contains('submitted') ? null : YACHT.innerHTML = '';
}

// Resets dice for new round.
function resetDice(){
  for(let i = 1; i < 6; i++){
    d.getElementById(`d${i}`).classList.remove('selected');
    d.getElementById(`d${i}`).innerHTML = '';
  }
  roll = [];
}

// Submits player's score from that round and advances game to next round.
function selectScore(e){
  if(e.innerHTML !== '' && !e.classList.contains('submitted')){
    if(e.id === 'ones-score' || e.id === 'twos-score' || e.id === 'threes-score' || e.id === 'fours-score' || e.id === 'fives-score' || e.id === 'sixes-score'){
      subtotal += parseInt(e.innerHTML);
    }
    e.classList.add('submitted');
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
    checkHiScore();
  }
}

function checkBonus(){
  if(subtotal >= 63){
    d.getElementById('bonus-num').innerHTML = 35;
    score += 35;
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
}
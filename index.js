window.addEventListener('DOMContentLoaded', (event) => {

  let existingSubmitButton = document.querySelector('#submit-existing')
  let newSubmitButton = document.querySelector('#submit-new')
  let cohortSelect = document.querySelector('#existing-cohort')
  let userForms = document.querySelectorAll(".user-form");
  
  

  let playerMatchesURL = 'http://localhost:3000/player_matches'
  let playersURL = 'http://localhost:3000/players'
  let matchesURL = 'http://localhost:3000/matches'
  
  function getPlayerMatches(){
    fetch(playerMatchesURL)
    .then(res => res.json())
    .then(data => console.log(data))
  }
  function getPlayers() {
    fetch(playersURL)
    .then(res => res.json())
    .then(data => data)
  };
   
  function getMatches(){
    fetch(matchesURL)
    .then(res => res.json())
    .then(data => console.log(data))
  }

  // getPlayers()
  // getMatches()
  // getPlayerMatches()

  // function getUserForms() {
  //   window.onload = function() {
  //     userForms.forEach(form => {
  //       form.style.display = "block";
        
  //     })
  //   }}

  
  newSubmitButton.addEventListener('click', e => {
    e.preventDefault();
    console.log('button clicked')
    let firstName = document.querySelector('#player-first-name').value.toLowerCase();
    let lastName = document.querySelector('#player-last-name').value.toLowerCase();
    let cohort = document.querySelector('#cohort').value
    let username = `${firstName}_${lastName}`
    console.log(username, cohort)   
    
    if (firstName && lastName){
    let data = {
      username: username,
      cohort: cohort
     }
     postFetch(playersURL, data)
    } else {
      console.log(`no info`)
    }

    removeForms(userForms)
    goToMenu(username)
     
  }) 

  existingSubmitButton.addEventListener('click', e => {
    e.preventDefault()
    let studentDropdown = document.getElementById('existing-students');
    var username = studentDropdown.options[studentDropdown.selectedIndex].innerText;
    
    removeForms(userForms)
    goToMenu(username)

  })
  
  cohortSelect.onchange = function() {
    let cohortName = document.querySelector('#existing-cohort').value
    let studentDropdown = document.querySelector('#existing-students')
    studentDropdown.innerHTML = ''
    i = 0
    fetch(playersURL)
    .then(res => res.json())
    .then(data => data.forEach(player => {
      
      if (player.cohort == cohortName){
        let option = document.createElement('option')
        option.setAttribute('value', `${i}`)
        option.innerText = player.username
        studentDropdown.appendChild(option)
        i ++
        console.log(option)
      }
    }));
  }

  function goToMenu(username){
    let greetUser = document.querySelector('.logged-in-user')
    let createButton = document.querySelector('.create-match')
    greetUser.innerHTML = `<u>Welcome, ${username}!</u>`
    createButton.style.display = 'block';
  }

  
  // <---------------Helper Methods------------->
  function postFetch(url, data){
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
      body: JSON.stringify(data)
    }) 
  }

  function removeForms(forms){
    forms.forEach(form => {
      form.style.display = "none";
    })
  }
  //  getUserForms()

})
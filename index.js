window.addEventListener('DOMContentLoaded', (event) => {

  let newSubmitButton = document.querySelector('#submit-new')
  let cohortSelect = document.querySelector('#existing-cohort')

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

  
  newSubmitButton.addEventListener('click', e => {
    e.preventDefault();
    console.log('button clicked')
    let firstName = document.querySelector('#player-first-name').value.toLowerCase();
    let lastName = document.querySelector('#player-last-name').value.toLowerCase();
    let cohort = document.querySelector('#cohort').value
    let username = `${firstName}_${lastName}`
    console.log(username, cohort)   
    
    let data = {
      username: username,
      cohort: cohort
     }

     fetch(playersURL, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
         body: JSON.stringify(data)
     }) 
  }) 
  
  cohortSelect.onchange = function() {
    let cohortName = document.querySelector('#existing-cohort').value
    let studentDropdown = document.querySelector('#existing-students')
    studentDropdown.innerHTML = ''
    fetch(playersURL)
    .then(res => res.json())
    .then(data => data.forEach(player => {
      if (player.cohort == cohortName){
        let option = document.createElement('option')
        option.innerText = player.username
        studentDropdown.appendChild(option)
      }
    }));
  }

})
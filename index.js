window.addEventListener('DOMContentLoaded', (event) => {

  let submitButton = document.querySelector('#submit')
  let playerMatchesURL = 'http://localhost:3000/player_matches'
  let playersURL = 'http://localhost:3000/players'
  
  function getPlayerMatches(){
    fetch(playerMatchesURL)
    .then(res => res.json())
    .then(data => console.log(data))
  }
  
  
  function getPlayers(){
    fetch(playersURL)
    .then(res => res.json())
    .then(data => console.log(data))
  }

  getPlayers()
  getPlayerMatches()

  
  submitButton.addEventListener('click', e => {
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

})
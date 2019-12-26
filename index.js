window.addEventListener('DOMContentLoaded', (event) => {

  let existingSubmitButton = document.querySelector('#submit-existing')
  let newSubmitButton = document.querySelector('#submit-new')
  let cohortSelect = document.querySelector('#existing-cohort')
  let userForms = document.querySelectorAll(".user-form");
  let greetUser = document.querySelector('.logged-in-user')
  
  

  let playerMatchesURL = 'http://localhost:3000/player_matches'
  let playersURL = 'http://localhost:3000/players'
  let matchesURL = 'http://localhost:3000/matches'
  

  
  
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

     hide(userForms)
     fetch(playersURL)
     .then(res => res.json())
     .then(data => goToMainMenu(username, data))
    } else {
      console.log(`no info`)
    }

   
    // goToMainMenu(username)
     
  }) 

  existingSubmitButton.addEventListener('click', e => {
    e.preventDefault()
    let studentDropdown = document.getElementById('existing-students');
    var username = studentDropdown.options[studentDropdown.selectedIndex].innerText;
    
    hide(userForms)
    fetch(playersURL)
    .then(res => res.json())
    .then(data => goToMainMenu(username, data))

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

  function goToMainMenu(username, playersData){
    let logged_in = playersData.find(player => player.username == username)
    let host_id = logged_in.id
    let createMatchButton = document.querySelector('.create-match')
    let joinMatchButton = document.querySelector('.join-match')
    greetUser.innerHTML = `Welcome, ${username}!`
    show(createMatchButton)
    show(joinMatchButton)
    createMatchButton.addEventListener('click', e => {
      let data = {winner_id: null,
        loser_id: null,
        tournament_id: null,
        host_id: host_id.toString()
       }  
       postFetch(matchesURL, data)    
    })
    joinMatchButton.addEventListener('click', e =>{
      showExistingMatches(username, playersData)
    })
  }

  // <---------------Helper Methods------------->
  function showExistingMatches(username, playersData){
    
    fetch(matchesURL)
    .then(res => res.json())
    .then(matchesData => matchesData.forEach(match => {
      let logged_in = playersData.find(player => player.username == username)
      if (match.host_id){
        let hostName = playersData.find(player => player.id == match.host_id).username
        let matchList = document.querySelector('.matches-list')
        let matchLi = document.createElement('li')
        matchLi.innerHTML = `<h5>Match hosted by ${hostName}.</h5>`
        button = document.createElement('button')
        button.innerText = "join"
        button.setAttribute('id', `${match.host_id}`)
        matchList.appendChild(matchLi) 
        matchList.appendChild(button)
        // console.log(logged_in.id)
       
        button.addEventListener('click', e => {
          // console.log(match.host_id)
          let data = {
            player_1_id: match.host_id,
            player_2_id: logged_in.id,
            match_id: match.id
           }
           postFetch(playerMatchesURL, data)

           buttons = document.querySelectorAll('button')
           hide(buttons)
           matchList.style.display = 'none'
           
           greetUser.innerHTML = `You have joined ${hostName}'s match!`

        })
        
      }
      
    }))    
  }


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

  function hide(forms){
    forms.forEach(form => {
      form.style.display = "none";
    })
  }

  function getPlayerMatches(){
    fetch(playerMatchesURL)
    .then(res => res.json())
    .then(data => console.log(data))
  }

  function getPlayers() {
    fetch(playersURL)
    .then(res => res.json())
    .then(data => main)
  };
   
  function getMatches(){
    fetch(matchesURL)
    .then(res => res.json())
    .then(data => console.log(data))
  }

  function show(item){
    item.style.display = 'block';
  }

})
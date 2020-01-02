window.addEventListener('DOMContentLoaded', (event) => {

  let existingSubmitButton = document.querySelector('#submit-existing')
  let newSubmitButton = document.querySelector('#submit-new')
  let cohortSelect = document.querySelector('#existing-cohort')
  let userForms = document.querySelectorAll(".user-form");
  // let greetUser = document.querySelector('.logged-in-user')
  let restartMatchButton = document.querySelector('.restart-match')
  let p1WinCount = 0
  let p2WinCount = 0
  let p1Score = 0
  let p2Score = 0
  let p1ScoreDiv = document.getElementsByClassName('player-1-score')[0]
  let p2ScoreDiv = document.getElementsByClassName('player-2-score')[0]
  let winnerDiv = document.getElementsByClassName('winner')[0]
  let p1WinCountDiv = document.querySelector('.winner-1-count')
  let p2WinCountDiv = document.querySelector('.winner-2-count')
  let gameInfo = document.querySelector('#game-info')
  let playerMatchesURL = 'http://localhost:3000/player_matches'
  let playersURL = 'http://localhost:3000/players'
  let matchesURL = 'http://localhost:3000/matches'
  let matchData
  let statsContainer = document.querySelector('#stats__container')
  let currentMatch = document.querySelector('#current_match')
  let userTotalMatchesDiv = document.querySelector('.stats-total-matches')
  let userWonMatchesDiv = document.querySelector('.stats-won-matches')
  let userLostMatchesDiv = document.querySelector('.stats-lost-matches')
  // clearGameInfo()

  const navLinks = document.querySelectorAll('.nav-link')

  navLinks.forEach((navlink) => {
    navlink.addEventListener('click', (e) => {
      navLinks.forEach(link => {
       document.getElementById(link.dataset.js).classList.remove('show-view');
       })
      document.getElementById(e.currentTarget.dataset.js).classList.add('show-view')
    })
  })


  newSubmitButton.addEventListener('click', e => {
    e.preventDefault();
    let firstName = document.querySelector('#player-first-name').value.toLowerCase();
    let lastName = document.querySelector('#player-last-name').value.toLowerCase();
    let cohort = document.querySelector('#cohort').value
    let username = `${firstName}_${lastName}`

    if (firstName && lastName) {
      let data = {
        username: username,
        cohort: cohort
      }
      hide(userForms)

      fetch(playersURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(() => getPlayers(username))


    } else {
      console.log(`no info`)
    }

    function getPlayers(username) {
      fetch(playersURL)
        .then(res => res.json())
        .then(data => {
          runEvents(username, data)
        })
    }




  })

  existingSubmitButton.addEventListener('click', e => {
    e.preventDefault()
    let studentDropdown = document.getElementById('existing-students');
    var username = studentDropdown.options[studentDropdown.selectedIndex].innerText;

    hide(userForms)
    fetch(playersURL)
      .then(res => res.json())
      .then(data => {
        runEvents(username, data)
      })

  })

  function runEvents(username, data){ 
    populateUserStats(username, data)
    goToMainMenu(username, data)
  }

  cohortSelect.onchange = function () {
    let cohortName = document.querySelector('#existing-cohort').value
    let studentDropdown = document.querySelector('#existing-students')
    studentDropdown.innerHTML = ''
    i = 0
    fetch(playersURL)
      .then(res => res.json())
      .then(data => data.forEach(player => {

        if (player.cohort == cohortName) {
          let option = document.createElement('option')
          option.setAttribute('value', `${i}`)
          option.innerText = player.username
          studentDropdown.appendChild(option)
          i++
        }
      }));
  }

  // <==============================Main Functions=====================================>


  function goToMainMenu(username, playersData) {
    console.log(playersData)
    console.log('gtmm 113')
    let displayUsername = document.querySelector('.display-username')
    displayUsername.innerText = username
    let logged_in = playersData.find(player => player.username == username)
    let host_id = logged_in.id
    username = logged_in.username
    let createMatchButton = document.querySelector('.create-match')
    let joinMatchButton = document.querySelector('.join-match')

    
    createMatchButton.addEventListener('click', e => {
      let data = {
        winner_id: null,
        loser_id: null,
        tournament_id: null,
        host_id: host_id.toString()
      }
      postFetch(matchesURL, data)
      // greetUser.innerHTML = `You have created a match! Please wait for someone to join.`

    })
    joinMatchButton.addEventListener('click', e => {
      showExistingMatches(username, playersData, keepscore)
    })

    statsContainer.classList.add('show-view')

  }







  function showExistingMatches(username, playersData, callback) {
    fetch(matchesURL)
      .then(res => res.json())
      .then(matchesData => matchesData.forEach(match => {
        let logged_in = playersData.find(player => player.username == username)
        if (match.host_id) {
          let hostName = playersData.find(player => player.id == match.host_id).username
          let matchList = document.querySelector('.matches-list')
          let matchLi = document.createElement('li')
          matchLi.innerHTML = `<h5>Match hosted by ${hostName}.</h5>`
          button = document.createElement('button')
          button.innerText = "join"
          button.setAttribute('id', `${match.host_id}`)
          matchList.appendChild(matchLi)
          matchList.appendChild(button)

          button.addEventListener('click', e => {
            let data = {
              player_1_id: match.host_id,
              player_2_id: logged_in.id,
              match_id: match.id
            }

            let data2 = {
              winner_id: null,
              loser_id: null,
              host_id: null
            }
            let updatedMatchURL = `http://localhost:3000/matches/${match.id}`
            fetch(playerMatchesURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(data)
            }).then(patchFetch(updatedMatchURL, data2))

            buttons = document.querySelectorAll('button')
            hide(buttons)
            matchList.style.display = 'none'

            matchData = {
              score: 11,
              hostUsername: hostName,
              loggedInUsername: logged_in.username,
              bestOf: 3,
              hostId: match.host_id,
              loggedInId: logged_in.id,
              matchId: match.id
            }
            // currentMatch.classList.add('show-view')
            // greetUser.innerHTML = `You have joined ${hostName}'s match!`
            callback()
          })
        }
      }))
  }

  let keepscore = () => {
    currentMatch.classList.add('show-view')
    p1WinCount = 0
    p2WinCount = 0
    p1WinCountDiv.innerText = `${matchData.hostUsername}'s win count: ${p1WinCount}`
    p2WinCountDiv.innerText = `${matchData.loggedInUsername}'s win count: ${p2WinCount}`
    hideSingle(restartMatchButton)
    // greetUser.innerHTML = ``
    gameInfo.style.display = 'block';
    document.querySelector('.user-form').style.display = "none"
    let bestOfSets = Math.ceil(matchData.bestOf / 2)

    let displayLimit = document.querySelector('.display-limit')
    displayLimit.innerText = `Score ${matchData.score} points to win!`
    // <div class='player1-name-score'> </div>
    let p1ns = document.querySelector('.player1-name-score')
    let p2ns = document.querySelector('.player2-name-score')
    p1ns.innerText = `${matchData.hostUsername}'s score:`
    p2ns.innerText = `${matchData.loggedInUsername}'s score:`
    if (!matchData.rematch) {
      window.addEventListener("keyup", e => {
        if (e.key === 'ArrowLeft') {
          p1ScoreUp(matchData, bestOfSets)
        } else if (e.key === 'ArrowRight') {
          p2ScoreUp(matchData, bestOfSets)
        } else if (e.key === ',') {
          scoreDown('player1', p1ScoreDiv)
        } else if (e.key === '.') {
          scoreDown('player2', p2ScoreDiv)
        } else {
          console.log('Invalid input')
        }

      })
    }
  }


  



  function winCount(winner, matchData, bestOf) {
    
    if (winner == 'player1') {
      p1WinCount += 1
      p1WinCountDiv.innerText = `${matchData.hostUsername}'s win count: ${p1WinCount}`
      if (p1WinCount == bestOf) {
        displayWinner('player1', matchData)
      }
    } else if (winner == 'player2') {
      p2WinCount += 1
      p2WinCountDiv.innerText = `${matchData.loggedInUsername}'s win count: ${p2WinCount}`
      if (p2WinCount == bestOf) {
        displayWinner('player2', matchData)
      }
    }
  }

  function displayWinner(winner, matchData) {
    
    let updatedMatchURL = `http://localhost:3000/matches/${matchData.matchId}`
    if (winner == 'player1') {
      let data = {
        winner_id: matchData.hostId,
        loser_id: matchData.loggedInId,
        host_id: null
      }
      fetch(updatedMatchURL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(() => afterMatchScreen('player1', matchData))
    } else {
      let data = {
        winner_id: matchData.loggedInId,
        loser_id: matchData.hostId,
        host_id: null
      }
      fetch(updatedMatchURL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(() => afterMatchScreen('player2', matchData))
    }

    


  }

  function populateUserStats(username, playersData){
    console.log(playersData)
    let loggedInId= playersData.find(player => player.username == username).id
    fetch(matchesURL)
    .then(res => res.json())
    .then(allMatches => {
      let userWonMatches = allMatches.filter(function(match){
        return match.winner_id === loggedInId
      })
      let userLostMatches = allMatches.filter(function(match){
        return match.loser_id === loggedInId
      })
      let userTotalMatches = userWonMatches.concat(userLostMatches)
        userWonMatchesDiv.innerText = userWonMatches.length
        userLostMatchesDiv.innerText = userLostMatches.length
        userTotalMatchesDiv.innerText = userTotalMatches.length
    })
  }

  function afterMatchScreen(winner, matchData) {
    let vsRecord = document.querySelector('.vs-record')
    clearGameInfo()
    show(restartMatchButton)
    fetch(matchesURL)
      .then(res => res.json())
      .then(data => {
        let loggedInWonMatches = data.filter(function(match){
          return match.winner_id === matchData.loggedInId && match.loser_id === matchData.hostId 
        })
        let loggedInLostMatches = data.filter(function(match){
          return match.winner_id === matchData.hostId && match.loser_id === matchData.loggedInId
        })
        let loggedInTotalMatches = loggedInWonMatches.concat(loggedInLostMatches)
        vsRecord.innerText = `Your record vs ${matchData.hostUsername} is ${loggedInWonMatches.length}-${loggedInLostMatches.length}`

      })

    let displayLimit = document.querySelector('.display-limit')
    if (winner == 'player1') {
      displayLimit.innerHTML = `<h3>${matchData.hostUsername} won the match!</h3>`
    } else if (winner == 'player2') {
      displayLimit.innerHTML = `<h3>${matchData.loggedInUsername} won the match!</h3> `

    }
    
    if (!matchData.rematch) {
      restartMatchButton.addEventListener('click', e => {

        hideSingle(restartMatchButton)
        let data = {
          winner_id: null,
          loser_id: null,
          host_id: null
        }
        fetch(matchesURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(() => {
            startNewGame(matchData, keepscore)
          })

      })
    }
  }


  function startNewGame(matchData, callback) {


    fetch(matchesURL)
      .then(res => res.json())
      .then(data => {
        playerMatchData = {
          player_1_id: matchData.hostId,
          player_2_id: matchData.loggedInId,
          match_id: data[data.length - 1].id
        }
        postFetch(playerMatchesURL, playerMatchData)

        matchData.rematch = true
        matchData.matchId = data[data.length - 1].id
        callback()
      })
  }




  // <=====================Helper methods======================================>

  // <=======Database functions========>

  function postFetch(url, data) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  function patchFetch(url, data) {
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }

  function getPlayerMatches() {
    fetch(playerMatchesURL)
      .then(res => res.json())
      .then(data => console.log(data))
  }

  function getMatches() {
    fetch(matchesURL)
      .then(res => res.json())
      .then(data => data)
  };




  // <=======Helper methods to keepscore function========>

  function p1ScoreUp(matchData, bestOf) {
    clearWinnerDiv()
    p1Score += 1
    if (p1Score >= matchData.score) {
      if (p1Score - p2Score >= 2) {
        winnerDiv.innerHTML = `<u>${matchData.hostUsername} wins this set!</u>`
        p1Score = 0
        p2Score = 0
        p2ScoreDiv.innerHTML = p2Score
        winCount("player1", matchData, bestOf)
      } else {
        winnerDiv.innerText = 'You must win by 2!'
      }
    }
    p1ScoreDiv.innerHTML = p1Score
  }

  function p2ScoreUp(matchData, bestOf) {
    clearWinnerDiv()
    p2Score += 1
    if (p2Score >= matchData.score) {
      if (p2Score - p1Score >= 2) {
        winnerDiv.innerHTML = `<u>${matchData.loggedInUsername} wins this set!</u>`
        p2Score = 0
        p1Score = 0
        p1ScoreDiv.innerHTML = p1Score
        winCount("player2", matchData, bestOf)
      } else {
        winnerDiv.innerText = 'You must win by 2!'
      }
    }
    p2ScoreDiv.innerHTML = p2Score
  }

  function scoreDown(player, playerDiv) {
    if (player == 'player1' && p1Score != 0) {
      p1Score--
      playerDiv.innerHTML = p1Score
    } else if (player == 'player2' && p2Score != 0) {
      p2Score--
      playerDiv.innerHTML = p2Score
    }
  }



  // <=======HTML show and hide function========>
  function show(item) {
    item.style.display = 'block';
  }

  function hideSingle(item) {
    item.style.display = 'none';
  }

  function clearWinnerDiv() {
    winnerDiv.innerText = ''
  }

  function clearGameInfo() {
    gameInfo.style.display = 'none';

  }

  function hide(forms) {
    forms.forEach(form => {
      form.style.display = "none";
    })
  }





})
const navLinks = document.querySelectorAll('.nav-link')

navLinks.forEach((navlink) => {
  navlink.addEventListener('click', (e) => {
    navLinks.forEach(link => {
       document.getElementById(link.dataset.js).classList.remove('show-view');
    })
    document.getElementById(e.currentTarget.dataset.js).classList.add('show-view')
  })
})
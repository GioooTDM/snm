/* Modal window "Select Playlist" */

// Selection and handling of playlist items
let playlist__sel = document.querySelectorAll('.playlist__sel')

// Toggle a CSS class for each playlist item when clicked to indicate selection
playlist__sel.forEach(function(item) {
    item.addEventListener("click", function() {
        item.classList.toggle("selected")
    })
})


/* Notifiche pop-up */

// Selection of DOM elements related to an alert or notification (toast)
const alert_close = document.querySelector(".alert_close")
const alert__toast = document.querySelector(".alert__toast")

// Hide the alert when its close button is clicked
alert_close.addEventListener("click", ()=>{
    alert__toast.classList.add('d-none')
})


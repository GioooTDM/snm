// Questo codice serve per gestire il bottone library nei dispositivi mobili

const sidebar = document.getElementById("sidebar");
const libButton = document.getElementById("libBtn");
const libButtonTwo = document.getElementById("libBtntwo");

libButton.addEventListener("click", ()=>{

    sidebar.classList.add("sidebar__show");
    
    libButton.classList.add("bottom_nav_active");
    const imgLib = libButton.querySelector('img');
    changeToActive(imgLib);
    
    // Check if libButtonTwo is not null
    if (libButtonTwo) {    
        libButtonTwo.classList.remove("bottom_nav_active");
        const imgTwo = libButtonTwo.querySelector('img');
        changeToUnactive(imgTwo);
    }
});


/**
 * Modifies the image source by replacing the word "Active" with "Unactive"
 * @param {HTMLImageElement} imageElement - The image element whose src needs to be changed
 */
function changeToUnactive(imageElement) {
    const currentSrc = imageElement.src;
    
    const newSrc = currentSrc.replace("Active", "Unactive");
    
    imageElement.src = newSrc;
}


/**
 * Modifies the image source by replacing the word "Unactive" with "Active"
 * @param {HTMLImageElement} imageElement - The image element whose src needs to be changed
 */
function changeToActive(imageElement) {
    const currentSrc = imageElement.src;
    
    const newSrc = currentSrc.replace("Unactive", "Active");
    
    imageElement.src = newSrc;
}

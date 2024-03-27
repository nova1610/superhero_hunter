// Listen for keyup event on the search bar
let searchBar = document.getElementById("search-bar")
searchBar.addEventListener('keyup', function () {
  // Check if search bar has a value
  if (searchBar.value) {
    // Construct API request URL with search query
    apiRequestUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchBar.value}&apikey=881539c8f8d161b4f5eb0418f21d2e8a&hash=074c36425e20e38b37fafd8f0d759ddc&ts=1`
    // Create a new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.open('get', apiRequestUrl, true);
    request.send();
    // Listen for onload event of the XMLHttpRequest
    request.onload = function () {
      // Parse response JSON
      var results = JSON.parse(request.responseText);
      
      // Check if response contains results
      if (results.code && results.data.count > 0) {
        // Display search results
        displayHeroes(results.data.results);
      } 
      // If no results found
      else if (results.data.count == 0) {
        heroList.innerHTML = "";
        // Show toast message for not found
        var toast = document.getElementById('toast-not-found');
        toast.className = toast.className.concat(" show");
        setTimeout(() => {
          toast.className = toast.className.replace("show", "");
        }, 5000);
      }
    }
  }
})

// Function to handle click on the "Favourite" button
document.getElementById('fav-button').onclick = function () {
  // Retrieve favourite heroes from localStorage
  let heroes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    heroes.push(JSON.parse(value));
  }
  console.log(heroes);
  // Display favourite heroes
  displayHeroes(heroes, displayList=favList)
}

// Function to display heroes
let template = document.getElementById('hero-card');
let heroList = document.getElementById('hero-list')
let favList = document.getElementById('fav-list')
function displayHeroes(heroes, displayList = heroList) {
  // Clear existing content of display list
  displayList.innerHTML = "";
  // Loop through each hero
  for (let hero of heroes) {
    // Clone the template content
    var clone = template.content.cloneNode(true);
    // Update hero details in the clone
    clone.getElementById('name').innerHTML = `Name: ${hero.name}`;
    clone.getElementById('comic').innerHTML = `Comics: ${hero.comics.available}`;
    clone.getElementById('series').innerHTML = `Series: ${hero.series.available}`;
    clone.getElementById('stories').innerHTML = `Stories: ${hero.stories.available}`;
    // Set click event for "Favourite" button
    let fav_button = clone.getElementById('fav');
    if(isInLocalStorage(hero.id)){
      fav_button.innerHTML = "Remove From Favourite";
      fav_button.className = fav_button.className.replace("primary", "danger");
    }
    fav_button.onclick = function () {
      if(isInLocalStorage(hero.id)){
        localStorage.removeItem(hero.id)
        showRemovedFromFavouriteToast();
        fav_button.innerHTML = "Add To Favourite";
        fav_button.className = fav_button.className.replace("danger", "primary");
      }else{
        let hero_json = JSON.stringify(hero);
        localStorage.setItem(hero.id, hero_json);
        showAddedToFavouriteToast()
        fav_button.innerHTML = "Remove From Favourite";
        fav_button.className = fav_button.className.replace("primary", "danger");
      }
    }
    // Set click event for "Learn More" button
    clone.getElementById('learn-more').onclick = function () {
      // Update modal content with hero details
      document.getElementById('modal-title').innerHTML = `${hero.name}`;
      document.getElementById('hero-image').src = `${hero.thumbnail.path}/portrait_incredible.${hero.thumbnail.extension}`;
      document.getElementById('modal-id').innerHTML = `<b>Unique ID: </b>${hero.id}`;
      document.getElementById('modal-description').innerHTML = `<b>Description: </b>${hero.description || "Not Available"}`;
      document.getElementById('modal-modified').innerHTML = `<b>Information Last Updated: </b>${new Date(hero.modified).toUTCString()}`;
      document.getElementById('modal-comics').innerHTML = `<b>Comics: </b>${hero.comics.available || "Not Available"}`;
      document.getElementById('modal-series').innerHTML = `<b>Series: </b>${hero.series.available || "Not Available"}`;
      document.getElementById('modal-stories').innerHTML = `<b>Stories: </b>${hero.stories.available || "Not Available"}`;
      document.getElementById('modal-events').innerHTML = `<b>Events: </b>${hero.events.available || "Not Available"}`;
      // Set click event for "Favourite" button in modal
      document.getElementById('modal-fav').onclick = function (button) {
        if(isInLocalStorage(hero.id)){
          localStorage.removeItem(hero.id)
          showRemovedFromFavouriteToast();
          button.innerHTML = "Add To Favourite";
        }else{
          let hero_json = JSON.stringify(hero);
          localStorage.setItem(hero.id, hero_json);
          showAddedToFavouriteToast()
          button.innerHTML = "Remove From Favourite";
        }
      }
    }
    // Append the clone to the display list
    displayList.appendChild(clone);
  }
}

// Function to show "Added to Favourite" toast message
function showAddedToFavouriteToast() {
  var toast = document.getElementById('toast-added');
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 5000);
}

// Function to show "Removed from Favourite" toast message
function showRemovedFromFavouriteToast() {
  var toast = document.getElementById('toast-removed');
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = "toast";
  }, 5000);
}

// Function to check if a hero is in localStorage
function isInLocalStorage(key){
  return Object.keys(localStorage).includes(key.toString());
}

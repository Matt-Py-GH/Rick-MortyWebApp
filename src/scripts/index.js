import { getCharactersByName } from "./fetch.js";

const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const cardsContainer = document.getElementById("results")
searchButton.addEventListener("click", handleSearch);

async function handleSearch() {
  const campoInput = searchInput.value.trim();
  if (!campoInput) return;
  
  try {
    const characters = await getCharactersByName(campoInput);
    showCharacters(characters)
    
  } catch (error) {
    cardsContainer.innerHTML = "";
    const card = document.createElement("div")
    card.className = "character-card"
    
    const title = document.createElement("h2")
    title.textContent = error
    
    card.appendChild(title)
    
    cardsContainer.appendChild(card)
  }
}

function showCharacters(characters){
  cardsContainer.innerHTML = "";
  
  characters.forEach(character => {
    const card = document.createElement("div")
    card.className = "character-card"
    
    const title = document.createElement("h2")
    title.textContent = character.name
    
    const characterImg = document.createElement("img")
    characterImg.src = character.image
    characterImg.alt = "Image of: " + character.name
    
    const button = document.createElement("a")
    button.className = "button-card"
    button.textContent = "Ver detalles"
    button.addEventListener("click", () => {
      window.location.href = `./detalles.html?id=${character.id}`;
    });
    
    card.appendChild(title)
    card.appendChild(characterImg)
    card.appendChild(button)
    
    cardsContainer.appendChild(card)
    
  });
}


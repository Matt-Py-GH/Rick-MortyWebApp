import { getCharactersByName } from "./fetch.js";
import { extras } from "./extras.js";

window.addEventListener("DOMContentLoaded", () => {
  try{

    const lastSearch = localStorage.getItem("lastSearch");
    if (lastSearch) {
      searchInput.value = lastSearch;
      handleSearch();
    }
  }
  catch(error){
    console.log(error);
  }
});


const searchButton = document.getElementById("search-button");
const sortButton = document.getElementById("sort-button");
const searchInput = document.getElementById("search-input");
const cardsContainer = document.getElementById("results");
const statusSelect = document.getElementById("status-filter");
const favPageButton = document.getElementById("favorites-button")


let selectedStatus = "all";
let currentCharacters = [];
let sortAsc = true;

favPageButton.addEventListener("click", () => {
  window.location.href = "./favoritos.html";
});
searchButton.addEventListener("click", handleSearch);
sortButton.addEventListener("click", toggleSort);
statusSelect.addEventListener("change", () => {
  selectedStatus = statusSelect.value;
  showCharacters(currentCharacters);
});

async function handleSearch() {
  const campoInput = searchInput.value.trim();
  if (!campoInput) return;
  localStorage.setItem("lastSearch", campoInput);
  const loader = document.getElementById("loader");
  loader.style.display = "block"; //Mostramos el loader para informar al usuario que está cargando.

  try {
    const characters = await getCharactersByName(campoInput);
    currentCharacters = characters;
    showCharacters(currentCharacters);
  } catch (error) {
    cardsContainer.innerHTML = "";
    const card = document.createElement("div");
    card.className = "character-card";

    const title = document.createElement("h2");
    title.textContent = error;

    card.appendChild(title);
    cardsContainer.appendChild(card);
  }finally {
    loader.style.display = "none"; //Ocultamos el loader (tremenda UX)
  }
}

function toggleSort() {
  sortAsc = !sortAsc;
  const sorted = [...currentCharacters].sort((a, b) => {
    return sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });
  showCharacters(sorted);

  // Cambiar texto del botón para mostrar el orden actual
  sortButton.textContent = sortAsc ? "Ordenar A-Z" : "Ordenar Z-A";
}

function showCharacters(characters) {
  cardsContainer.innerHTML = "";

  characters.forEach(character => {
    const statusMatches = selectedStatus === "all" || character.status === selectedStatus;

    if (statusMatches) {
      divsCreation(character);
    }
  });
}


function divsCreation(character) {
  const card = document.createElement("div");
  card.className = "character-card";

  // Imagen del personaje
  const characterImg = document.createElement("img");
  characterImg.src = character.image;
  characterImg.alt = "Image of: " + character.name;

  // Título
  const title = document.createElement("h2");
  title.textContent = character.name;

  // Botón de ver detalles
  const button = document.createElement("a");
  button.className = "button-card";
  button.textContent = "Ver detalles";
  button.addEventListener("click", () => {
    //Primero guardamos la página actual donde estamos para mas adelante usar esta información en caso de que toquemos en "volver" cuando salgamos de detalles. Para saber si volvemos al index, o volvemos a favoritos.
    localStorage.setItem("previousPage", window.location.pathname);
    window.location.href = `./detalles.html?id=${character.id}`;
});


  // Botón de favorito
  const favoriteButton = document.createElement("button");
  favoriteButton.className = "favorite-button";

  // Mostrar corazón según si está favorito o no
  if (extras.isFavorite(character.id)) {
    favoriteButton.textContent = "❤️";
    favoriteButton.classList.add("favorite-active");
  } else {
    favoriteButton.textContent = "🖤";
  }

  favoriteButton.addEventListener("click", () => {
    extras.toggleFavorite(character.id);
    // Cambiar texto y clase según el estado nuevo
    if (favoriteButton.textContent === "🖤") {
      favoriteButton.textContent = "❤️";
      favoriteButton.classList.add("favorite-active");
    } else {
      favoriteButton.textContent = "🖤";
      favoriteButton.classList.remove("favorite-active");
    }
  });

  // Agregar elementos al card
  card.appendChild(characterImg);
  card.appendChild(title);
  card.appendChild(button);
  card.appendChild(favoriteButton);

  // Agregar card al contenedor
  cardsContainer.appendChild(card);
}




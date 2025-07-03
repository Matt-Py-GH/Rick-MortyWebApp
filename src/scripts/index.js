import { getCharactersByName } from "./fetch.js";
import { extras } from "./extras.js";

//Primero cargamos el contenido de la última búsqueda, mejorando así la UX/UI tremendamente
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

//Elementos a manipular del DOM
const searchButton = document.getElementById("search-button");
const sortButton = document.getElementById("sort-button");
const searchInput = document.getElementById("search-input");
const cardsContainer = document.getElementById("results");
const statusSelect = document.getElementById("status-filter");
const favPageButton = document.getElementById("favorites-button")

//Variables extra
let selectedStatus = "all";
let currentCharacters = [];
let sortAsc = true;

//Función del favButton, no consideré necesario encapsular esta función.
favPageButton.addEventListener("click", () => {
  window.location.href = "./favoritos.html";
});
searchButton.addEventListener("click", handleSearch);
sortButton.addEventListener("click", toggleSort);

//Botón para filtrar según el estado, y refrescar los personajes
statusSelect.addEventListener("change", () => {
  selectedStatus = statusSelect.value;
  showCharacters(currentCharacters);
});

//Función principal de manejar la búsqueda, el FETCH está hecho en fetch.js, de hecho es con axios. Consideré importante separar esa lógica de peticiones, de lo que se muestra en contenido. 10 en principios SOLID
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

//Esta función es muy sencilla, se ordenan los usuarios de la A a la Z con el método sort y destructuring de los personajes actualmente mostrados en pantalla
function toggleSort() {
  sortAsc = !sortAsc;
  const sorted = [...currentCharacters].sort((a, b) => {
    //Se ordenan y se guarda en sorted, para tener la lista completa ordenada
    //Ternario para comparar y saber qué retornar a sorted según la clasificación alfabética.
    //Se hace uso del método localeCompare para ello, con el nombre como parámetro.
    return sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });
  //Se vuelven a mostrar ordenados
  showCharacters(sorted);

  // Cambiar texto del botón para mostrar el orden actual
  sortButton.textContent = sortAsc ? "Ordenar A-Z" : "Ordenar Z-A";
}

//Función principal para mostrar los personajes, según el filtro
function showCharacters(characters) {
  cardsContainer.innerHTML = "";

  characters.forEach(character => {
    const statusMatches = selectedStatus === "all" || character.status === selectedStatus;

    if (statusMatches) {
      divsCreation(character);
    }
  });
}

//Creación de cada card de los personajes, consideré buena idea separar este bloque de código para que quede mas prolijo y dividir mejor la lógica de creación y filtrado
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
  //Primero guardamos la página actual donde estamos para mas adelante usar esta información en caso de que toquemos en "volver" cuando salgamos de detalles. Para saber si volvemos al index, o volvemos a favoritos.
  button.addEventListener("click", () => {
    const currentPath = window.location.pathname;
    localStorage.setItem("previousPage", currentPath);
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
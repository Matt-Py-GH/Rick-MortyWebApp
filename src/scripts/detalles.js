import { getCharacterByID, listEpisodesFromCharacter } from "./fetch";

//Obtenemos el ID del personaje el cual se mostrarán sus detalles
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const contenedorPersonaje = document.getElementById("character-details")
const volverButton = document.getElementById("volver-button")
volverButton.addEventListener("click", handleBack)

//Función para volver atrás, si estamos en detalles y veníamos de favoritos, volveremos a favoritos, sino al index.html, esto se consigue leyendo el previousPage del localStorage. El cual se almacena cada vez que se da clic en "ver detalles" botón de cada card de cada personaje, mostrado en favoritos y en el index 
function handleBack() {
  const prev = localStorage.getItem("previousPage");

  if (prev && prev.includes("favoritos")) {
    window.location.href = "./favoritos.html";
  } else {
    window.location.href = "./index.html";
  }
}

//Función que muestra toda la información del personaje en cuestión
await showAllData()

async function showAllData() {
  let personaje;
  let episodios;
  //Primero se consigue el personaje según su ID obtenido con la funcion que viene desde fecth, luego en base a ese personaje se obtienen sus episodios.
    try {
        personaje = await getCharacterByID(id)
        episodios = await listEpisodesFromCharacter(personaje);
        showCharacterDetails(personaje)
        showEpisodes(episodios)
  }catch(error){
    //Si hay algún error, se setean en null y se envian como parámetros para mostrar los errores correspondientes
        episodios = null;
        personaje = null;
        showCharacterDetails(personaje)
        showEpisodes(episodios)
  }
}

//Creación dinámica de contenido para los detalles en caso de que exista el ID
function showCharacterDetails(character){
  contenedorPersonaje.innerHTML = "";
  //Card de error  si no hay personaje
    if(!character){
        const card = document.createElement("div")
        card.className = "character-details"
        card.textContent = "No existe este personaje..."
        contenedorPersonaje.appendChild(card)
        return
    }

    //Función de creación principal
    const card = document.createElement("div")
    card.className = "character-details"

    const status = createDetail("Estado", character.status);
    const species = createDetail("Especie", character.species);
    const type = createDetail("Tipo", character.type || "unknown");
    const gender = createDetail("Género", character.gender);
    const origin = createDetail("Origen", character.origin.name);
    const location = createDetail("Ubicación", character.location.name);
    const created = createDetail("Creado", new Date(character.created).toLocaleDateString());


    const title = document.createElement("h2")
    title.textContent = character.name
    title.className = "character-details"

    const characterImg = document.createElement("img")
    characterImg.src = character.image
    characterImg.alt = "Image of: " + character.name

    const elements = [title, characterImg, status, species, type, gender, origin, location,created,
];

//Iteración para mostrar cada elemento que devuelve la API según cada personaje
    elements.forEach(element => {
            card.appendChild(element)
    });

    contenedorPersonaje.appendChild(card);
}

//Función encargada de mostrar todos los episodios, haciendo una petición por cada episodio
function showEpisodes(episodes){
    const contenedorEpisodios = document.getElementById("episodes");
    contenedorEpisodios.innerHTML = "";

    //Si no tiene, se muestra esto
    if(!episodes || episodes.length === 0){
      const epDiv = document.createElement("div");
      epDiv.className = "character-attribute";
      epDiv.textContent = "Sin episodios";
      contenedorEpisodios.appendChild(epDiv);
      console.log("SIN EPISODIOS PAPITO");
      return;
    }

    //En caso de tener, se muestran dinámicamente.
    episodes.forEach(res => {
      const { episode, name } = res.data;

      const epDiv = document.createElement("div");
      epDiv.className = "character-attribute";
      epDiv.textContent = `${episode} - ${name}`;

      contenedorEpisodios.appendChild(epDiv);
    });
}

//Función para crear cada elemento por separado para mostrar en pantalla
//Súper útil
function createDetail(label, value) {
  const div = document.createElement("div");
  div.className = "character-attribute";
  div.textContent = `${label}: ${value}`;
  return div;
}
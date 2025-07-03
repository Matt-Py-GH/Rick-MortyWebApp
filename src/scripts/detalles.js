import { getCharacterByID, listEpisodesFromCharacter } from "./fetch";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const contenedorPersonaje = document.getElementById("character-details")
const volverButton = document.getElementById("volver-button")
volverButton.addEventListener("click", handleBack)

function handleBack() {
  const prev = localStorage.getItem("previousPage");

  if (prev && prev.includes("favoritos")) {
    window.location.href = "./favoritos.html";
  } else {
    window.location.href = "./index.html";
  }
}



await showAllData()

async function showAllData() {
  let personaje;
  let episodios;
    try {
        personaje = await getCharacterByID(id)
        episodios = await listEpisodesFromCharacter(personaje);
        showCharacterDetails(personaje)
        showEpisodes(episodios)
  }catch(error){
        episodios = null;
        personaje = null;
        showCharacterDetails(personaje)
        showEpisodes(episodios)
  }
}

function showCharacterDetails(character){
  contenedorPersonaje.innerHTML = "";
    if(!character){
        const card = document.createElement("div")
        card.className = "character-details"
        card.textContent = "No existe este personaje..."
        contenedorPersonaje.appendChild(card)
        return
    }

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

    elements.forEach(element => {
            card.appendChild(element)
    });

    
    contenedorPersonaje.appendChild(card);
}

function showEpisodes(episodes){
    const contenedorEpisodios = document.getElementById("episodes");
    contenedorEpisodios.innerHTML = "";

    if(!episodes || episodes.length === 0){
      //console.log("SE METIO AL IF")
      const epDiv = document.createElement("div");
      epDiv.className = "character-attribute";
      epDiv.textContent = "Sin episodios";
      contenedorEpisodios.appendChild(epDiv);
      console.log("SIN EPISODIOS PAPITO");
      return;
    }

    //console.log("TODO SALIÓ BIEN")
    episodes.forEach(res => {
      const { episode, name } = res.data;

      const epDiv = document.createElement("div");
      epDiv.className = "character-attribute";
      epDiv.textContent = `${episode} - ${name}`;

      contenedorEpisodios.appendChild(epDiv);
    });
}

function createDetail(label, value) {
  const div = document.createElement("div");
  div.className = "character-attribute";
  div.textContent = `${label}: ${value}`;
  return div;
}
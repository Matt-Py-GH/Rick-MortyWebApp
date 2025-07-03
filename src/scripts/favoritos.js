import { getCharacterByID } from "./fetch.js";

//Obtenemos y cargamos los favoritos directamente, llamando a la función loadFavorites
document.addEventListener("DOMContentLoaded", loadFavorites)

//Botón extra para eliminar todos los favoritos, simplemente saca el item y lo vuelve a poner vacío
const deleteFavsButton = document.getElementById("delete-all")
deleteFavsButton.addEventListener("click", () => {
  localStorage.removeItem("favorites")
  localStorage.setItem("favorites", JSON.stringify([]))
  window.location.reload()
})

//Obtenemos los favoritos del localStorage y los cargamos
async function loadFavorites() {
  {
  const container = document.getElementById("favorites-container");
  const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];

  //Si no hay, manejamos la posibilidad
  if (favoriteIds.length === 0) {
    container.innerHTML = "<p>No hay personajes favoritos aún.</p>";
    return;
  }

  //Con un for, iteramos sobre los personajes para la respectiva creación de cada card.
  //Creación dinámica con la misma lógica que en el index
  try {
    for (const id of favoriteIds) {
      const character = await getCharacterByID(id);
      const card = document.createElement("div");
      card.className = "character-card";

      const title = document.createElement("h2");
      title.textContent = character.name;

      const img = document.createElement("img");
      img.src = character.image;
      img.alt = character.name;

      const button = document.createElement("a");
      button.textContent = "Ver detalles";
      button.className = "button-card";
      button.addEventListener("click", () => {
      const currentPath = window.location.pathname;
      //Se guarda la página en la que se está justamente para el botón de "volver" que hay en detalles
      localStorage.setItem("previousPage", currentPath);
      window.location.href = `./detalles.html?id=${character.id}`;
    });

      card.appendChild(title);
      card.appendChild(img);
      card.appendChild(button);

      container.appendChild(card);
    }
  } catch (error) {
    container.innerHTML = "<p>Error al cargar favoritos.</p>";
    console.error(error);
  }
}
  }

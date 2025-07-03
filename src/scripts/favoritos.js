import { getCharacterByID } from "./fetch.js";

document.addEventListener("DOMContentLoaded", loadFavorites)

const deleteFavsButton = document.getElementById("delete-all")
deleteFavsButton.addEventListener("click", () => {
  localStorage.removeItem("favorites")
  localStorage.setItem("favorites", JSON.stringify([]))
  window.location.reload()
})

async function loadFavorites() {
  {
  const container = document.getElementById("favorites-container");
  const favoriteIds = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favoriteIds.length === 0) {
    container.innerHTML = "<p>No hay personajes favoritos aún.</p>";
    return;
  }

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
      button.href = `./detalles.html?id=${character.id}`;

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

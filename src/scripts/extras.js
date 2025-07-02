function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || []; //Retorna vacío si no tiene nada
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  let favorites = getFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id); //Filtramos los favoritos
  } else {
    favorites.push(id); //Se agregan
  }
  localStorage.setItem("favorites", JSON.stringify(favorites)); //Se guardan en el localStorage
}

//Exporto las funciones
export const extras = {
    isFavorite,
    toggleFavorite
}
//Se creó este archivo con la idea de organizar todas las distintas peticiones y separarlas con sus respectivas funciones en pos de un mejor order y organización del código. Funciona como la parte interna que devuelve el JSON necesario para ser presentado luego en el frontend.

//Axios es mas cool
import axios from "axios";

//URL de la API
const URL_API = 'https://rickandmortyapi.com/api';

export async function getCharactersByName(name = '') {
  try {
    // Utilizamos el encodeURIComponent como una buena práctica debido a que puede haber errores a la hora de escribir y leer el valor del input
    const response = await axios.get(`${URL_API}/character/?name=${encodeURIComponent(name)}`);
    //Axios ya devuelve el valor con JSON, solo debemos retornar los resultados
    return response.data.results;
  } catch (error) {
    //Catcheamos el error si hay, y utilizamos la propia variable de error que nos ofrece Axios
    const message = error.response?.data?.error || 'No se encontraron personajes';
    throw new Error(message);
  }
}

//Con esta función vemos los detalles de UN personaje en específico basado en su ID. Cosa que es enviada desde el frontend tomado desde la url en la query. El resto del proceso es el mismo.
export async function getCharacterByID(id) {
  try{
    const response = await axios.get(`${URL_API}/character/${encodeURIComponent(id)}`);
    return response.data;
  }
  catch(error){
    return null
      }
}

//Utilizamos el personaje como parametro para obtener todos los episodios en los que aparece, este personaje está obtenido con otra función y se guarda en el front en una constante, que será la utilizada aquí para obtener el arreglo de URL de cada episodio, que deberá ser fetcheado.
//El caso de mayor cantidad de episodios es 51, y la mejor forma de hacer tantas peticiones para obtener la data de cada episodio por separado, es haciendo uso del poderoso Promise.all() el resto del proceso es bastante sencillo y de ello se encarga el frontend.

export async function listEpisodesFromCharacter(character) {
  const episodeUrls = character.episode;
  if (!episodeUrls || episodeUrls.length === 0) {
    return [];
  }

  try {
    const results = await Promise.allSettled(
      episodeUrls.map(url => axios.get(url))
    );

    return results.filter(result => result.status === "fulfilled")
    .map(result => result.value);

  } catch (error) {
    console.error("Error inesperado al obtener episodios:", error);
    return [];
  }
}


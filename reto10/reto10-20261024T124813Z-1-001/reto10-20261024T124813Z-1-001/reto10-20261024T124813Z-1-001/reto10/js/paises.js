async function buscarPais(nombre) {
  try {
    const response = await fetch(`https://countries.dev/name/${encodeURIComponent(nombre)}`);

    if (!response.ok) {
      throw new Error("Pais no encontrado: " + nombre);
    }

    const paises = await response.json();

    if (paises.length === 0) return null;

    const exacto = paises.find(function (p) {
      return p.name.toLowerCase() === nombre.toLowerCase();
    });

    return exacto || paises[0];

  } catch (error) {
    console.error(error);
    return null;
  }
}

function mostrarPais(pais, idContenedor, esMayor) {
  const contenedor = document.getElementById(idContenedor);

  const capital = pais.capital ? pais.capital : "Sin capital";
  const idiomas = Array.isArray(pais.languages) && pais.languages.length > 0
    ? pais.languages.map(function (l) { return l.name; }).join(", ")
    : "No disponible";

  const clasesBorde = esMayor ? "border-success border-3" : "";
  const etiqueta = esMayor
    ? '<span class="badge bg-success mb-2">Mayor poblacion</span>'
    : "";

  contenedor.innerHTML = `
    <div class="card h-100 ${clasesBorde}">
      <img src="${pais.flags.png}" class="card-img-top" alt="Bandera de ${pais.name}" style="height: 200px; object-fit: contain;">
      <div class="card-body">
        ${etiqueta}
        <h4 class="card-title">${pais.name}</h4>
        <p class="mb-1"><strong>Capital:</strong> ${capital}</p>
        <p class="mb-1"><strong>Region:</strong> ${pais.region}</p>
        <p class="mb-1"><strong>Poblacion:</strong> ${pais.population.toLocaleString("es")}</p>
        <p class="mb-0"><strong>Idiomas:</strong> ${idiomas}</p>
      </div>
    </div>
  `;
}


async function comparar() {
  const nombre1 = document.getElementById("pais1").value.trim();
  const nombre2 = document.getElementById("pais2").value.trim();
  const mensaje = document.getElementById("mensaje");

  mensaje.innerHTML = "";
  document.getElementById("resultado1").innerHTML = "";
  document.getElementById("resultado2").innerHTML = "";

  if (nombre1 === "" || nombre2 === "") {
    mensaje.innerHTML = '<div class="alert alert-warning">Escribe el nombre de los dos paises.</div>';
    return;
  }

  const [pais1, pais2] = await Promise.all([
    buscarPais(nombre1),
    buscarPais(nombre2)
  ]);

  if (!pais1 || !pais2) {
    mensaje.innerHTML = '<div class="alert alert-danger">No se encontro uno de los paises. Prueba escribiendolo en ingles (ej: germany, spain).</div>';
    return;
  }

  const poblacion1 = pais1.population;
  const poblacion2 = pais2.population;

  mostrarPais(pais1, "resultado1", poblacion1 > poblacion2);
  mostrarPais(pais2, "resultado2", poblacion2 > poblacion1);

  if (poblacion1 === poblacion2) {
    mensaje.innerHTML = '<div class="alert alert-info">Ambos paises tienen la misma poblacion.</div>';
  } else {
    const mayor = poblacion1 > poblacion2 ? pais1 : pais2;
    const menor = poblacion1 > poblacion2 ? pais2 : pais1;
    const diferencia = mayor.population - menor.population;

    mensaje.innerHTML = `
      <div class="alert alert-success">
        <strong>${mayor.name}</strong> tiene mas poblacion que ${menor.name},
        con ${diferencia.toLocaleString("es")} habitantes de diferencia.
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnComparar").addEventListener("click", comparar);
});
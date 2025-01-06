const celdas = []; // 4x4
let RETICULAX = document.getElementById("cellSize").value; // número de lados, puede variar
let RETICULAY;
let ancho; // altura de celda
let alto; // anchura de celda
const startButton = document.getElementById("start");

const azulejos = [];

let opcionesI = [];

const NA = reglas.length; // número de azulejos

function preload() {
  for (let i = 0; i < NA; i++) {
    //azulejos[i] = loadImage(`azulejos/tile${i}.png`); // otra forma de cargar las imágenes
    azulejos[i] = loadImage("1azulejos/tile" + i + ".png");
  }
}

function setup() {
  //createCanvas(1080, 1080);
  createCanvas(windowWidth, windowHeight);

  ancho = width / RETICULAX;
  alto = ancho;
  RETICULAY = Math.floor(height / ancho);

  for (let i = 0; i < azulejos.length; i++) {
    opcionesI.push(i);
  }

  for (let i = 0; i < RETICULAX * RETICULAY; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI,
    };
  }

  startButton.addEventListener("click", resetAll);
}

function draw() {
  //Otras formas de escribir la función

  //Forma1
  //function filtrarCeldas(celda){
  //return celda.colapsada == false;
  //}
  //const celdasActuales = celdas.filter(filtrarCeldas);

  //Forma2
  //const celdasActuales = celdas.filter (function (celda){
  //return celda.colapsada == false; //ingresa la función de forma anónima
  //});

  const celdasConOpciones = celdas.filter((celda) => {
    return celda.opciones.length > 0;
  });

  //Forma3
  const celdasDisponibles = celdasConOpciones.filter((celda) => {
    return celda.colapsada == false;
  }); //recibe el valor y lo compara

  if (celdasDisponibles.length > 0) {
    celdasDisponibles.sort((a, b) => {
      return a.opciones.length - b.opciones.length;
    });
    const celdasPorColapsar = celdasDisponibles.filter((celda) => {
      return celda.opciones.length == celdasDisponibles[0].opciones.length;
    });

    const celdaSeleccionada = random(celdasPorColapsar);
    celdaSeleccionada.colapsada = true;

    const opcionSeleccionada = random(celdaSeleccionada.opciones);
    celdaSeleccionada.opciones = [opcionSeleccionada];

    //print(celdaSeleccionada);

    for (let x = 0; x < RETICULAX; x++) {
      for (let y = 0; y < RETICULAY; y++) {
        const celdaIndex = x + y * RETICULAX;
        const celdaActual = celdas[celdaIndex];

        if (celdaActual.opciones.length < 1) {
          fill(255, 100, 100);
          rect(x * ancho, y * alto, ancho, alto);
        }

        if (celdaActual.colapsada) {
          const indiceDeAzulejos = celdaActual.opciones[0];
          const reglasActuales = reglas[indiceDeAzulejos];
          //print(reglasActuales);
          image(azulejos[indiceDeAzulejos], x * ancho, y * alto, ancho, alto);

          // Monitorear entropía UP
          if (y > 0) {
            const indiceUP = x + (y - 1) * RETICULAX; // Generar un índice
            const celdaUP = celdas[indiceUP]; // Recuperar celda
            if (!celdaUP.colapsada) {
              cambiarEntropia(celdaUP, reglasActuales["UP"], "DOWN");
            }

            // Monitorear entropía RIGHT
            if (x < RETICULAX - 1) {
              const indiceRIGHT = x + 1 + y * RETICULAX; // Generar un índice
              const celdaRIGHT = celdas[indiceRIGHT]; // Recuperar celda
              if (!celdaRIGHT.colapsada) {
                cambiarEntropia(celdaRIGHT, reglasActuales["RIGHT"], "LEFT");
              }
            }

            // Monitorear entropía DOWN
            if (y < RETICULAY - 1) {
              const indiceDOWN = x + (y + 1) * RETICULAX; // Generar un índice
              const celdaDOWN = celdas[indiceDOWN]; // Recuperar celda
              if (!celdaDOWN.colapsada) {
                cambiarEntropia(celdaDOWN, reglasActuales["DOWN"], "UP");
              }
            }

            // Monitorear entropía LEFT
            if (x > 0) {
              const indiceLEFT = x - 1 + y * RETICULAX; // Generar un índice
              const celdaLEFT = celdas[indiceLEFT]; // Recuperar celda
              if (!celdaLEFT.colapsada) {
                cambiarEntropia(celdaLEFT, reglasActuales["LEFT"], "RIGHT");
              }
            }
          } else {
            //strokeWeight(5);
            //rect(x * ancho, y * alto, ancho, alto);
          }
        }
      }
      //noLoop();
    }
  } else {
  }

  function cambiarEntropia(_celda, _regla, _opuesta) {
    const nuevasOpciones = [];
    for (let i = 0; i < _celda.opciones.length; i++) {
      if (_regla == reglas[_celda.opciones[i]][_opuesta]) {
        const celdaCompatible = _celda.opciones[i];
        nuevasOpciones.push(celdaCompatible);
      }
    }
    _celda.opciones = nuevasOpciones;
    print(nuevasOpciones);
  }
}

function resetAll() {
  RETICULAX = document.getElementById("cellSize").value;
  ancho = width / RETICULAX;
  alto = ancho;
  RETICULAY = Math.floor(height / ancho);

  background(242, 236, 228);

  let opcionesI = [];
  for (let i = 0; i < azulejos.length; i++) {
    opcionesI.push(i);
  }
  for (let i = 0; i < RETICULAX * RETICULAX; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: opcionesI,
    };
  }
}

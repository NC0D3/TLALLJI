//banderas
let EstadoAutonomo = false;
let enviadoOn = false;
let enviadoOff = false;

function EncendidoAutonomo() {
    // Obtener el checkbox y el párrafo
    var checkbox = document.getElementById("swtchAutonomo");
    var sldrHumedad1 = document.getElementById("sldrHumedad1");
    var sldrHumedad2 = document.getElementById("sldrHumedad2");
    // Cambiar el valor del párrafo según el estado del checkbox
    if (checkbox.checked) {
        EstadoAutonomo = true;
        sldrHumedad1.disabled = true;
        sldrHumedad2.disabled = true;
    } else {
        EstadoAutonomo = false;
        sldrHumedad1.disabled = false;
        sldrHumedad2.disabled = false;
    }
}

function Modo() {
    // Obtener el checkbox y el párrafo
    var checkbox = document.getElementById("swtchModo");
    var valorEtiqueta = document.getElementById("lblModo");
    // Cambiar el valor del párrafo según el estado del checkbox
    if (checkbox.checked) {
        valorEtiqueta.innerText = "Control Autonomo";
        document.getElementById("modoManual").style.display = "none";
        document.getElementById("modoAutonomo").style.display = "flex";
        document.getElementById('switch2').checked=false;
        enviarMensaje('bomba=OFF');
    } else {
        valorEtiqueta.innerText = "Control Manual";
        document.getElementById("modoAutonomo").style.display = "none";
        document.getElementById("modoManual").style.display = "flex";
        document.getElementById("swtchAutonomo").checked = false;
        enviarMensaje('bomba=OFF');
        document.getElementById("sldrHumedad1").disabled = false;
        document.getElementById("sldrHumedad2").disabled = false;
    }
}

function ToggleBomba() {
    var toggleBtn = document.getElementById('switch2');
    var ledStatus = toggleBtn.checked ? 'ON' : 'OFF';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    xhr.send('bomba=' + ledStatus);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Datos enviados correctamente');
        }
    };
}

// Función para enviar XMLHttpRequest
const enviarMensaje = (mensaje) => {
    const xmlhttp = new XMLHttpRequest();
    // Configura la solicitud según tus necesidades
    xmlhttp.open('POST', '/', true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(mensaje);
};

// Obtener referencia al slider y elementos de la interfaz
const umbralSlider1 = document.getElementById('sldrHumedad1');
document.getElementById('lblUmbral1').innerText = umbralSlider1.value + '%';
let umbral1 = umbralSlider1.value;

umbralSlider1.addEventListener('input', () => {
    umbral1 = umbralSlider1.value;
    document.getElementById('lblUmbral1').innerText = umbralSlider1.value + '%';
    // Restablecer las variables de control al mover el slider
});



// Obtener referencia al slider y elementos de la interfaz
const umbralSlider2 = document.getElementById('sldrHumedad2');
document.getElementById('lblUmbral2').innerText = umbralSlider2.value + '%';
let umbral2 = umbralSlider2.value;

umbralSlider2.addEventListener('input', () => {
    umbral2 = umbralSlider2.value;
    document.getElementById('lblUmbral2').innerText = umbralSlider2.value + '%';
    // Restablecer las variables de control al mover el slider
});

const eventSource = new EventSource('/sse');
eventSource.addEventListener('humedad', function (event) {
    // Actualiza el valor en el span y establece el fondo del slider
    var valor = event.data;
    let valorMinimo = 26100;
    let valorMaximo = 5500;
    let porcentaje = ((valor - valorMinimo) / (valorMaximo - valorMinimo)) * 100;
    // Enviar XMLHttpRequest cuando se cumple una condición
    if (porcentaje < parseFloat(umbral1) && !enviadoOn) {
        enviarMensaje('bomba=ON');
        enviadoOn = true;
        enviadoOff = false;
    } else if (porcentaje >= parseFloat(umbral2) && !enviadoOff) {
        enviarMensaje('bomba=OFF');
        // Restablecer las variables de control al mover el slider
        enviadoOn = false;
        enviadoOff = true;
    }
    document.getElementById('lblHumedad').textContent = porcentaje.toFixed(3) + '%';
    // Aquí puedes manejar los datos del evento1 como desees
});

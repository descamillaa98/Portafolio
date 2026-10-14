let nombre = document.getElementById("nombre");
let correo = document.getElementById("correo");
let mensaje = document.getElementById("mensaje");
const formulario = document.querySelector(".contact-form");
const erroresFormulario = document.getElementById("erroresFormulario");
const estadoEnvio = document.getElementById("estadoEnvio");
const btnEnviar = document.getElementById("btnEnviar");
const emailjsConfig = {
    serviceId: "service_0m4e9x5",
    templateId: "template_1rgn5sb",
    publicKey: "xMCwy8O-4Luvd7oOF"
};
let enviando = false;

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    if (enviando) return;
    estadoEnvio.hidden = true;
    const regexNombre = /^\p{L}{3,}$/u;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validaciones = [
        { campo: nombre, valido: regexNombre.test(nombre.value.trim()), texto: "Nombre: debe tener al menos 3 caracteres y solo letras." },
        { campo: correo, valido: regexCorreo.test(correo.value.trim()), texto: "Correo: escribe un correo con formato válido, como nombre@ejemplo.com." },
        { campo: mensaje, valido: mensaje.value.trim().length >= 10, texto: "Mensaje: debe tener al menos 10 caracteres." }
    ];

    erroresFormulario.replaceChildren();

    validaciones.forEach(function ({ campo, valido, texto }) {
        campo.classList.toggle("campo-error", !valido);
        campo.setAttribute("aria-invalid", String(!valido));

        if (valido) {
            campo.removeAttribute("aria-describedby");
        } else {
            const error = document.createElement("p");
            error.id = "error-" + campo.id;
            error.textContent = texto;
            erroresFormulario.appendChild(error);
            campo.setAttribute("aria-describedby", error.id);
        }
    });

    const primerError = validaciones.find(function (validacion) {
        return !validacion.valido;
    });
    erroresFormulario.hidden = !primerError;

    if (primerError) {
        primerError.campo.focus();
        return;
    }

    function mostrarEstado(texto, exito) {
        estadoEnvio.textContent = texto;
        estadoEnvio.classList.toggle("envio-exitoso", exito);
        estadoEnvio.hidden = false;
    }

    if (!emailjsConfig.templateId || !emailjsConfig.publicKey) {
        mostrarEstado("El envío aún no está configurado. Falta el Template ID y la Public Key de EmailJS.", false);
        return;
    }

    enviando = true;
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    formulario.setAttribute("aria-busy", "true");

    try {
        await emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
            name: nombre.value.trim(),
            email: correo.value.trim(),
            message: mensaje.value.trim()
        }, { publicKey: emailjsConfig.publicKey });

        mostrarEstado("¡Mensaje enviado con éxito! Gracias por contactarme.", true);
        formulario.reset();
    } catch (error) {
        mostrarEstado("No se pudo enviar el mensaje. Inténtalo de nuevo en unos momentos.", false);
    } finally {
        enviando = false;
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar mensaje";
        formulario.removeAttribute("aria-busy");
    }
});

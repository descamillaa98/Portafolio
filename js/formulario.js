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
        { campo: nombre, valido: regexNombre.test(nombre.value.trim()), texto: "Name: must contain at least 3 characters and only letters." },
        { campo: correo, valido: regexCorreo.test(correo.value.trim()), texto: "Email: enter a valid email address, such as name@example.com." },
        { campo: mensaje, valido: mensaje.value.trim().length >= 10, texto: "Message: must contain at least 10 characters." }
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
        mostrarEstado("Sending is not configured yet. The EmailJS Template ID and Public Key are missing.", false);
        return;
    }

    enviando = true;
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Sending...";
    formulario.setAttribute("aria-busy", "true");

    try {
        await emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, {
            name: nombre.value.trim(),
            email: correo.value.trim(),
            message: mensaje.value.trim()
        }, { publicKey: emailjsConfig.publicKey });

        mostrarEstado("Message sent successfully! Thank you for getting in touch.", true);
        formulario.reset();
    } catch (error) {
        mostrarEstado("The message could not be sent. Please try again in a few moments.", false);
    } finally {
        enviando = false;
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Send message";
        formulario.removeAttribute("aria-busy");
    }
});

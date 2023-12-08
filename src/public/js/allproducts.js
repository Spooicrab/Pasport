const Botones = document.getElementsByClassName('AddToCart');
const socketclient = io();
let IdCarritoActual = cartId

for (const Boton of Botones) {
    Boton.addEventListener('click', () => {
        const productId = Boton.getAttribute('data-product-id');
        // Busca la cookie 'jwt'
        const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwt='));
        if (jwtCookie) {
            // Si la cookie existe, obtén el token
            const token = jwtCookie.split('=')[1];
            socketclient.emit('Agregar', { productId, IdCarritoActual, token });
        } else {
            // Si la cookie no existe, maneja el error
            console.error('No se encontró la cookie jwt');
        }
    });
}

socketclient.on('Agregado', () => {
    alert('Producto Agregado al Carrito')
})



// Selecciona el formulario y los campos de entrada
const form = document.getElementById('Mensajes');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = nameInput.value;
    const message = messageInput.value;
    const jwtCookie = document.cookie.split('; ').find(row => row.startsWith('jwt='));
    if (jwtCookie) {
        // Si la cookie existe, obtén el token
        const token = jwtCookie.split('=')[1];
        socketclient.emit('chat message', { user, message, token });
        messageInput.value = '';
    } else {
        // Si la cookie no existe, maneja el error
        console.error('No se encontró la cookie jwt');
    }

});
socketclient.on('Saved', function (data) {
    const chat = document.getElementById('ventanaChat');
    const messageElement = document.createElement('p');
    const mensaje = data.msg.message
    const user = data.msg.user
    messageElement.textContent = user + ': ' + mensaje;
    chat.appendChild(messageElement);
});
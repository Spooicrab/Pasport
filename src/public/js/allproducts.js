const Botones = document.getElementsByClassName('AddToCart');
const socketclient = io();
let CartID = carrito
let Token = token

for (const Boton of Botones) {
    const ProductID = Boton.getAttribute('data-product-id');
    Boton.addEventListener('click', () => {
        fetch('/api/carts/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
            body: JSON.stringify({ ProductID, CartID })
        }).then(alert('añadido al carrito'))
    });
}

const form = document.getElementById('Mensajes');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = nameInput.value;
    const message = messageInput.value;
    socketclient.emit('chat message',
        { user, message }
    );
    messageInput.value = '';
});

socketclient.on('Saved', function (data) {
    const chat = document.getElementById('ventanaChat');
    const messageElement = document.createElement('p');
    const mensaje = data.msg.message
    const user = data.msg.user
    messageElement.textContent = user + ': ' + mensaje;
    chat.appendChild(messageElement);
});
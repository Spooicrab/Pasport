const Botones = document.getElementsByClassName('AddToCart');
const socketclient = io();
let IdCarritoActual = cartId

for (const Boton of Botones) {
    Boton.addEventListener('click', () => {
        const productId = Boton.getAttribute('data-product-id');
        if (IdCarritoActual == null) {
            // console.log(`1idproduct: ${productId}`)
            socketclient.emit('CrearCarrito', productId);
            // console.log("El server recibe orden de crear carrito")
        } else {
            socketclient.emit('Agregar', { productId, IdCarritoActual });
        }
    });
}

// En el cliente

socketclient.on('creado', (data) => {
    // console.log(data)
    // console.log(`socket client creado data : ${data}`)
    const productId = data.productId; // Acceder al ID del producto
    const IdCarritoCreado = data.IdCarritoCreado;
    IdCarritoActual = IdCarritoCreado;
    // console.log("Recibo el carrito ya creado y mando a añadir el primer producto");
    socketclient.emit('Agregar', { productId, IdCarritoActual }); // Enviar el ID del producto
    // console.log("Se envía para ser agregado");
});
socketclient.on('Agregado', () => {
    console.log("Agregado")
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

    socketclient.emit('chat message', { user, message });
    messageInput.value = '';
});

socketclient.on('Saved', () => {
    const chat = document.getElementById('ventanaChat');
    const messageElement = document.createElement('p');
    messageElement.textContent = msg.name + ': ' + msg.message;
    chat.appendChild(messageElement);
})
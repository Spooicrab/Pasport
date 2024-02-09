const eliminar = document.getElementsByClassName('BotonEliminar')
let Token = AdminToken
console.log(Token);
for (const eliminarUser of eliminar) {
    const id = eliminarUser.getAttribute('data-idUser');
    eliminarUser.addEventListener('click', () => {
        console.log(id);
        fetch(`/api/users/${id}`, {
            method: 'Delete',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            },
        }).then(() => alert('Cuenta eliminada'))
    });
}
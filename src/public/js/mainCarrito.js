const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
//Este es de donde se encuentran los productos
const templateCard = document.getElementById("template-card").content
//Este es de donde se encuentra lo que viene debajo del carrito
const tamplateFooter = document.getElementById("template-footer").content
//Este es de donde esta el carrito
const tamplateCarrito = document.getElementById("template-carrito").content
/*memoria dinamica que no afecta a la base de datos que te permite ayudar a la modificacion de la informacion dentro del 
js*/
const fragment = document.createDocumentFragment()
//Crea un arreglo para el carrito
let carrito = {}

//Es para esperar a que todo dentro de productos carge para por der usaerce
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

//Este se usa para pintar el carrito
cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

// Escuchar el evento 'click' en el botón de comprar
// footer.addEventListener('click', e => {
//     if (e.target.id === 'btn-comprar') {
//         comprar();
//     }
// })

// Función que se ejecuta al hacer click en el botón de comprar
const comprar = () => {
    // Aquí puedes hacer lo que necesites para completar la compra, como enviar los detalles del carrito a un servidor, mostrar una ventana de confirmación al usuario, etc.
    alert('Gracias por tu compra!');
    let shoppingCart = localStorage.getItem('carrito');
    let metodo = document.getElementById('metodo-pago').value;
    axios.post('/comprar', {
        carrito: shoppingCart,
        metodo,
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    carrito = {}
    pintarCarrito()
    location.reload();
}

//Este se encarga de leer el json para poder sacar la informacion, este es que vamos a cambiar para la base de datos
const fetchData = async () => {
    try {
        const res = await fetch('/getProductos')
        const data = await res.json()
        //console.log(data)
        pintarCard(data)
    } catch (error) {
        console.log(error);
    }
}

//Este se encarga de pintar los productos 
const pintarCard = data => {
    data.forEach(producto => {
        if (producto.estado === "activado") {
            templateCard.querySelector("h5").textContent = producto.nombre
            templateCard.querySelectorAll("p")[0].textContent = producto.descripcion
            templateCard.querySelectorAll("p")[1].textContent = producto.disponibilidad
            templateCard.querySelectorAll("p")[2].textContent = producto.precio
            templateCard.querySelector("img").setAttribute("src", "/uploads/" + producto.urlImagen);
            templateCard.querySelector(".btn-dark").dataset.id = producto.id;
            const clone = templateCard.cloneNode(true)
            fragment.appendChild(clone);
        }
    })
    cards.appendChild(fragment)
}

//Este se encarga de agregar el carrito, checando que existe el carrito
const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

//se encarga de mandar toda la informacion de los divs de los productos
const setCarrito = objeto => {
    //Este se encarga de sacar los elementos dentro de los div
    const producto = {
        /*El querySelector se usa para poder identificar objetos dentro del div y usarlos, si este es unico solo es 
        poner el nombre de la etiqueta*/
        id: objeto.querySelector('.btn-dark').dataset.id,
        nombre: objeto.querySelector("h5").textContent,
        descripcion: objeto.querySelectorAll("p")[0].textContent,
        disponibilidad: objeto.querySelectorAll("p")[1].textContent,
        precio: objeto.querySelectorAll("p")[2].textContent,
        cantidad: 1
    }
    //Esta Checa si existe el producto y le agrega la cantidad
    //     if(carrito.hasOwnProperty(producto.id)){
    //         producto.cantidad = carrito[producto.id].cantidad + 1
    //     }
    //     //este se encarga de empujar  los elementos dentro del carrito
    //     carrito[producto.id] = {...producto}
    //     pintarCarrito()
    // }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    } else {
        producto.cantidad = 1
    }

    if (producto.cantidad > producto.disponibilidad) {
        // Si la cantidad es mayor que la disponibilidad, no agregues el producto al carrito y muestra un mensaje de error
        alert("La cantidad que deseas agregar supera la disponibilidad del producto");
    } else {
        // Agrega el producto al carrito solo si la cantidad no supera la disponibilidad
        carrito[producto.id] = { ...producto }
        pintarCarrito()
    }
}
//Este se encarga de pintar lo que tenga el tamplete del carrito
const pintarCarrito = () => {
    items.innerHTML = ""
    Object.values(carrito).forEach(producto => {
        tamplateCarrito.querySelector("th").textContent = producto.id
        /*En caso de querer usar querySelector y la etiqueta se usa mas de una vez en el div, se coloca querySelectorAll,
        y su id de uso es del 0 para arriba la cual corresponde mediante cual etiqueta esta primero, viendo la 
        informacion*/
        tamplateCarrito.querySelectorAll("td")[0].textContent = producto.nombre
        tamplateCarrito.querySelectorAll("td")[1].textContent = producto.descripcion
        tamplateCarrito.querySelectorAll("td")[2].textContent = producto.cantidad
        tamplateCarrito.querySelector('.btn-info').dataset.id = producto.id
        tamplateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        tamplateCarrito.querySelector("span").textContent = "$" + (producto.cantidad * producto.precio)
        const clone = tamplateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()

    //para aguardar la coleccion de objetos
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

//Este se encarga de pintar lo que tenga el tamplete del footer o mejor dicho, lo que esta debajo del carrito
const pintarFooter = () => {
    footer.innerHTML = ""
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - ¡Agrega productos!</th>
        `
        return
    }
    //este es el que se encarga de acumular las cantidades
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
    //Este se encarga de mander los resultados al footer del carrito
    tamplateFooter.querySelectorAll('td')[0].textContent = nCantidad
    tamplateFooter.querySelector('span').textContent = nPrecio

    const clone = tamplateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    //Este se encarga de hacer el baiado del carrito de manra general
    const btnVacias = document.getElementById('vaciar-carrito')
    btnVacias.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

//funcion de los botones dentro del carrito
const btnAccion = e => {
    const producto = carrito[e.target.dataset.id]
    if (e.target.classList.contains('btn-info')) {
        if (producto.cantidad >= producto.disponibilidad) {
            alert("La cantidad que deseas agregar supera la disponibilidad del producto");
            // Aquí puedes mostrar un mensaje de error o deshabilitar el botón de "+"
        } else {
            producto.cantidad++
            carrito[e.target.dataset.id] = { ...producto }
            pintarCarrito();
        }
    }
    if (e.target.classList.contains('btn-danger')) {
        producto.cantidad--
        carrito[e.target.dataset.id] = { ...producto }
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito();
    }
    e.stopPropagation()
}
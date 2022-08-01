// Declaración de constantes para evitar escribir todo el document
const articulos = document.getElementById("articulos");
const templateTarjetas = document.getElementById("template-tarjetas").content;
const fragmento = document.createDocumentFragment();
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const arts = document.getElementById("arts");
const footer = document.getElementById("footer");
let carrito = { }; //el objeto donde van a ir todos los artículos que agreguemos al carrito 

//----------------------------------------- ADD EVENT LISTENER --------------------------------------------//

arts.addEventListener("click", e => {
                                    botonAccion(e);
                                    })

document.addEventListener("DOMContentLoaded", () => {
                                                    fetchData()
                                                    if(localStorage.getItem("carrito")) { //si existe un carrito guardado en local storage lo cargamos
                                                                                        carrito = JSON.parse(localStorage.getItem("carrito"));
                                                                                        pintarCarrito();
                                                                                        }
                                                    }); // cargamos el fetchData una vez que se ha cargado la página

articulos.addEventListener("click", e =>{ // creamos un event listener para cualquier objeto
                                        agregarCarrito(e); //llevamos el artículo al carrito
                                        })


//----------------------------------------- FETCH DATA --------------------------------------------//

const fetchData = async () =>   { // función para captar los datos del archivo json y guardarlos en fetchData
                                try {
                                    const resultado = await fetch('api.json');
                                    const datos = await resultado.json();
                                    dibujarTarjetas(datos);
                                    } catch (error) {
                                    console.log(error);
                                                    }
                                } //end fetchData

//----------------------------------------- FUNCIONES --------------------------------------------//

const dibujarTarjetas = datos =>{ // función para dibujar las tarjetas
                                datos.forEach(pokemon => {
                                    templateTarjetas.querySelector("h5").textContent = pokemon.nombre; // se le coloca el nombre del pokemon a la etiqueta "nombre"
                                    templateTarjetas.querySelector("p").textContent = pokemon.precio; // se le coloca el precio  del pokemon a la etiqueta "precio"
                                    templateTarjetas.querySelector(".card-body button").dataset.id = pokemon.id // se le coloca el data id del pokemon a la clase del botón
                                    templateTarjetas.querySelector("img").setAttribute("src", pokemon.thumbnailUrl); // se inserta la imagen del pokemon a la etiqueta "img"

                                    const clone = templateTarjetas.cloneNode(true);
                                    fragmento.appendChild(clone);
                                                      })
                                                      articulos.appendChild(fragmento);
                                } //end dibujarTarjetas

const agregarCarrito = e => { // función para agregar el artículo al carrito
                            if (e.target.classList.contains("btn-dark")) //si devuelve true
                                        {
                                        setCarrito(e.target.parentElement); // mandamos todo ese div a la dfuncion setCarrito
                                        }
                            e.stopPropagation();
                            } //end agregarCarrito

const setCarrito = objeto =>    {
                                const producto ={
                                                id: objeto.querySelector(".btn-dark").dataset.id, // guardamos solamente el id del producto
                                                nombre: objeto.querySelector("h5").textContent, // guardamos su nombre
                                                precio: objeto.querySelector("p").textContent, // guardamos su precio
                                                cantidad: 1
                                                }

                                if (carrito.hasOwnProperty(producto.id)){
                                                                        producto.cantidad = carrito[producto.id].cantidad + 1; // se le agrega uno a la cantidad del producto
                                                                        }

                                carrito[producto.id] = {...producto}; //le sumamos un producto al carrito
                                pintarCarrito();
                                } //end objeto

const pintarCarrito = () => {
                            arts.innerHTML = " "; // vaciamos el html del div arts
                            Object.values(carrito).forEach(producto =>   {
                                                                        templateCarrito.querySelector("th").textContent = producto.id;
                                                                        templateCarrito.querySelectorAll("td")[0].textContent = producto.nombre;
                                                                        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
                                                                        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
                                                                        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
                                                                        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;

                                                                        const clone = templateCarrito.cloneNode(true);
                                                                        fragmento.appendChild(clone);
                                                                        })
                            arts.appendChild(fragmento);
                            pintarFooter();

                            localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardamos en localStorage lo que tenemos en el carrito
                            }

const pintarFooter = () =>  {
                            footer.innerHTML = ""; // vaciamos el html de footer
                            if(Object.keys(carrito).length === 0)   { // si no hay objetos en el carrito volvermos a pintar que el carrito está vacío
                                                                    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - compra un pokemon!</th>`
                                                                    return;
                                                                    }
                            const sumaCant = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad ,0); //creamos una constante con el acumulado de cantidad
                            const sumaPrecio = Object.values(carrito).reduce ((acc, {cantidad, precio}) => acc + cantidad * precio, 0); //creamos una constante con el acumulado de precio

                            templateFooter.querySelectorAll("td")[0].textContent = sumaCant;            
                            templateFooter.querySelector("span").textContent = sumaPrecio;     
                            
                            const clone = templateFooter.cloneNode(true);
                            fragmento.appendChild(clone);
                            footer.appendChild(fragmento);

                            const botVaciar = document.getElementById("vaciar-carrito"); // creamos la constante para el id del botón
                            botVaciar.addEventListener("click", () =>   { // la función que vacía el carrito
                                                                        carrito = {};
                                                                        pintarCarrito();
                                                                        })
                            }

const botonAccion = e =>{
                        if (e.target.classList.contains("btn-info")){// Acción de aumentar (si es true)
                                                                    const producto = carrito[e.target.dataset.id];
                                                                    producto.cantidad = carrito[e.target.dataset.id].cantidad +1;
                                                                    carrito[e.target.dataset.id] = {...producto};
                                                                    pintarCarrito();
                                                                    }
                        if (e.target.classList.contains("btn-danger")){// Acción de disminuir (si es true)
                                                                    const producto = carrito[e.target.dataset.id];
                                                                    producto.cantidad = carrito[e.target.dataset.id].cantidad -1;
                                                                    carrito[e.target.dataset.id] = {...producto};
                                                                    if (carrito[e.target.dataset.id].cantidad == 0) { // si la cantidad llega a 0 se elimina ese articulo del carrito
                                                                                                                    delete carrito[e.target.dataset.id];
                                                                                                                    }
                                                                    pintarCarrito(); // se vuelve a pintar el carrito
                                                                    }

                        e.stopPropagation(); //se detiene la propagación
                        }
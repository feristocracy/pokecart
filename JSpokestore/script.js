const articulos = document.getElementById("articulos");
const templateTarjetas = document.getElementById("template-tarjetas").content;
const fragmento = document.createDocumentFragment();

document.addEventListener("DOMContentLoaded", () => { fetchData()}); // cargamos el fetchData una vez que se ha cargado la página

const fetchData = async () =>   { // captamos los datos del archivo json y los guardamos en fetchData
                                try {
                                    const resultado = await fetch('api.json');
                                    const datos = await resultado.json();
                                    dibujarTarjetas(datos);
                                    } catch (error) {
                                    console.log(error);
                                                    }
                                }

const dibujarTarjetas = datos =>{
                                datos.forEach(nombre => {
                                    console.log(nombre)
                                                        })
                                }
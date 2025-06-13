async function agregarAlCarrito(client_id, producto_nombre, cantidad = 1) {
  try {
    const res = await fetch('/api/carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id, producto_nombre, cantidad })
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Error al agregar al carrito:", err);
  }
}

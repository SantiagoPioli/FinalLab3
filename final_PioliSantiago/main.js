document.addEventListener('DOMContentLoaded', function() {
    const legajo = '16969';
    const apiUrl = `https://api.yumserver.com/16969/products`;
    
    async function obtenerProductos() {
        try {
            const response = await fetch(apiUrl);
            const productos = await response.json();
            mostrarProductos(productos);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    }
    
    function mostrarProductos(productos) {
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';
        productos.forEach(producto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td> ${producto.idcod}</td>
                <td> ${producto.titulo}</td>
                <td>$${producto.precioPeso}</td>
                <td>$${producto.precioDolar}</td>
                <td> ${producto.fecha}</td>
                <td>
                    <button onclick="modificarProducto('${producto.idcod}', '${producto.titulo}', ${producto.precioPeso}, ${producto.precioDolar}, '${producto.fecha}')">Modificar</button>
                    <button onclick="confirmarEliminarProducto('${producto.idcod}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.confirmarEliminarProducto = function(idcod) {
        if (confirm('¿Está seguro de que desea eliminar este producto?')) {
            eliminarProducto(idcod);
        }
    }
    async function eliminarProducto(idcod) {
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idcod })
            });
            if (response.ok) {
                obtenerProductos();
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    }

    async function guardarProducto(event) {
        event.preventDefault();
        const idcod = document.getElementById('idcod').value;
        const titulo = document.getElementById('titulo').value;
        const precioPeso = document.getElementById('precioPeso').value;
        const precioDolar = document.getElementById('precioDolar').value;
        const fecha = document.getElementById('fecha').value;
        
        const producto = { titulo, precioPeso, precioDolar, fecha };
        let method = 'POST';
        let url = apiUrl;
        if (idcod) {
            method = 'PATCH';
            producto.idcod = idcod;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });
            const result = await response.text();
            if (result === 'OK') {
                window.location.href = 'index.html';
            } else {
                alert('Error al guardar producto: ' + result);
            }
        } catch (error) {
            console.error('Error al guardar producto:', error);
        }
    }

    window.modificarProducto = function(idcod, titulo, precioPeso, precioDolar, fecha) {
        
        localStorage.setItem('producto', JSON.stringify({ idcod, titulo, precioPeso, precioDolar, fecha }));
        window.location.href = 'manage.html';
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        if (document.getElementById('productForm')) {
            document.getElementById('productForm').addEventListener('submit', guardarProducto);
    
            const producto = JSON.parse(localStorage.getItem('producto'));
            if (producto) {
                document.getElementById('idcod').value = producto.idcod;
                document.getElementById('titulo').value = producto.titulo;
                document.getElementById('precioPeso').value = producto.precioPeso;
                document.getElementById('precioDolar').value = producto.precioDolar;
                document.getElementById('fecha').value = producto.fecha;
                localStorage.removeItem('producto'); 
            }
        } else {
            obtenerProductos();
        }
    });
    if (document.getElementById('productForm')) {
        document.getElementById('productForm').addEventListener('submit', guardarProducto);
    } else {
        obtenerProductos();
    }
});

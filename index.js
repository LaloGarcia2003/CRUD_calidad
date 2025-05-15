document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let editMode = false;
    let currentProductId = null;
    
    // Elementos del DOM
    const productForm = document.getElementById('product-form');
    const productTable = document.getElementById('product-table');
    const btnSubmit = document.getElementById('btn-submit');
    const btnCancel = document.getElementById('btn-cancel');
    const formTitle = document.getElementById('form-title');
    
    // Event Listeners
    productForm.addEventListener('submit', handleSubmit);
    btnCancel.addEventListener('click', cancelEdit);
    
    // Mostrar productos al cargar la página
    renderProducts();
    
    // Función para manejar el envío del formulario
    function handleSubmit(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const productId = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value.trim();
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        
        // Validaciones
        if (!name || isNaN(price) || isNaN(stock)) {
            alert('Por favor complete todos los campos correctamente');
            return;
        }
        
        if (editMode) {
            // Editar producto existente
            updateProduct(productId, name, price, stock);
        } else {
            // Agregar nuevo producto
            addProduct(name, price, stock);
        }
        
        // Limpiar formulario y actualizar tabla
        resetForm();
        renderProducts();
    }
    
    // Función para agregar un nuevo producto
    function addProduct(name, price, stock) {
        const newProduct = {
            id: Date.now().toString(),
            name,
            price,
            stock
        };
        
        products.push(newProduct);
        saveToLocalStorage();
        showAlert('Producto agregado correctamente', 'success');
    }
    
    // Función para actualizar un producto existente
    function updateProduct(id, name, price, stock) {
        const index = products.findIndex(product => product.id === id);
        
        if (index !== -1) {
            products[index] = { id, name, price, stock };
            saveToLocalStorage();
            showAlert('Producto actualizado correctamente', 'success');
        }
        
        editMode = false;
    }
    
    // Función para eliminar un producto
    function deleteProduct(id) {
        if (confirm('¿Está seguro que desea eliminar este producto?')) {
            products = products.filter(product => product.id !== id);
            saveToLocalStorage();
            renderProducts();
            showAlert('Producto eliminado correctamente', 'danger');
            
            // Si estábamos editando el producto eliminado, cancelar edición
            if (editMode && currentProductId === id) {
                cancelEdit();
            }
        }
    }
    
    // Función para cargar datos en el formulario para edición
    function loadProductForm(id) {
        const product = products.find(product => product.id === id);
        
        if (product) {
            editMode = true;
            currentProductId = id;
            
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-stock').value = product.stock;
            
            btnSubmit.innerHTML = '<i class="fas fa-save me-1"></i>Actualizar';
            btnSubmit.className = 'btn btn-warning';
            btnCancel.style.display = 'inline-block';
            formTitle.textContent = 'Editar Producto';
        }
    }
    
    // Función para cancelar la edición
    function cancelEdit() {
        editMode = false;
        currentProductId = null;
        resetForm();
    }
    
    // Función para resetear el formulario
    function resetForm() {
        productForm.reset();
        document.getElementById('product-id').value = '';
        btnSubmit.innerHTML = '<i class="fas fa-save me-1"></i>Guardar';
        btnSubmit.className = 'btn btn-primary';
        btnCancel.style.display = 'none';
        formTitle.textContent = 'Agregar Nuevo Producto';
    }
    
    // Función para renderizar la tabla de productos
    function renderProducts() {
        if (products.length === 0) {
            productTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay productos registrados</td>
                </tr>
            `;
            return;
        }
        
        productTable.innerHTML = products.map(product => `
            <tr>
                <td>${product.id.slice(-4)}</td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-action" onclick="loadProductForm('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Función para guardar en localStorage
    function saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Función para mostrar alertas (simuladas)
    function showAlert(message, type) {
        // En una aplicación real podrías usar Toast de Bootstrap o SweetAlert
        console.log(`${type}: ${message}`);
    }
    
    // Hacer funciones disponibles globalmente para los eventos onclick
    window.loadProductForm = loadProductForm;
    window.deleteProduct = deleteProduct;
});
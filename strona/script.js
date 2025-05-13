const form = document.getElementById('suppliesForm');
const nameInput = document.getElementById('itemName');
const quantityInput = document.getElementById('itemQuantity');
const categoryInput = document.getElementById('itemCategory');
const priceInput = document.getElementById('itemPrice');
const tableBody = document.querySelector('#suppliesList tbody');

const searchInput = document.getElementById('searchInput');
const filterQuantityInput = document.getElementById('filterQuantity');
const sortByNameButton = document.getElementById('sortByName');
const sortByQuantityButton = document.getElementById('sortByQuantity');
const sortByCategoryButton = document.getElementById('sortByCategory');
const sortByTotalPriceButton = document.getElementById('sortByTotalPrice');
const totalPriceSortIcon = document.getElementById('totalPriceSortIcon');
const nameSortIcon = document.getElementById('nameSortIcon');
const quantitySortIcon = document.getElementById('quantitySortIcon');
const categorySortIcon = document.getElementById('categorySortIcon');

const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editNameInput = document.getElementById('editName');
const editQuantityInput = document.getElementById('editQuantity');
const editCategoryInput = document.getElementById('editCategory');
const editPriceInput = document.getElementById('editPrice');
const closeEditModalBtn = document.getElementById('closeEditModal');

const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const closeDeleteModalBtn = document.getElementById('closeDeleteModal');

let supplies = JSON.parse(localStorage.getItem('supplies')) || [];
let productToEdit = null;
let productToDelete = null;
let nameSortAsc = true;
let quantitySortAsc = true;
let categorySortAsc = true;

render();

// Dodawanie nowego produktu
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const category = categoryInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!name || quantity <= 0 || !category || isNaN(price) || price <= 0) return;

    supplies.push({ name, quantity, category, price });
    save();
});

// Renderowanie tabeli
function render(data = supplies) {
    tableBody.innerHTML = '';
    data.forEach((item, i) => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.quantity;
        row.insertCell().textContent = item.category;

        const priceCell = row.insertCell();
        priceCell.textContent = item.price.toFixed(2);

        const totalPriceCell = row.insertCell();
        const totalPrice = item.quantity * item.price;

        // Tworzymy kontener dla ceny całkowitej i przycisków
        const totalContainer = document.createElement('div');
        totalContainer.classList.add('total-cell');

        const totalText = document.createElement('span');
        totalText.textContent = totalPrice.toFixed(2);

        const actionDiv = document.createElement('div');
        actionDiv.classList.add('action-buttons');

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edytuj';
        editBtn.classList.add('edit-button');
        editBtn.addEventListener('click', () => openEditModal(i));

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Usuń';
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener('click', () => openDeleteModal(i));

        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);

        totalContainer.appendChild(totalText);
        totalContainer.appendChild(actionDiv);
        totalPriceCell.appendChild(totalContainer);
    });
}

// Zapis danych
function save() {
    localStorage.setItem('supplies', JSON.stringify(supplies));
    render();
    form.reset();
}

// Edycja
function openEditModal(index) {
    productToEdit = index;
    const item = supplies[index];
    editNameInput.value = item.name;
    editQuantityInput.value = item.quantity;
    editCategoryInput.value = item.category;
    editPriceInput.value = item.price;
    editModal.style.display = 'flex';
}

editForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = editNameInput.value.trim();
    const quantity = parseInt(editQuantityInput.value);
    const category = editCategoryInput.value.trim();
    const price = parseFloat(editPriceInput.value);

    if (!name || quantity <= 0 || !category || isNaN(price) || price <= 0) return;

    supplies[productToEdit] = { name, quantity, category, price };
    save();
    editModal.style.display = 'none';
});

closeEditModalBtn.addEventListener('click', () => editModal.style.display = 'none');

// Usuwanie
function openDeleteModal(index) {
    productToDelete = index;
    deleteModal.style.display = 'flex';
}

confirmDeleteBtn.addEventListener('click', function () {
    supplies.splice(productToDelete, 1);
    save();
    deleteModal.style.display = 'none';
});

cancelDeleteBtn.addEventListener('click', () => deleteModal.style.display = 'none');
closeDeleteModalBtn.addEventListener('click', () => deleteModal.style.display = 'none');

// Szukanie
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = supplies.filter(item => item.name.toLowerCase().includes(query));
    render(filtered);
});

// Filtrowanie
filterQuantityInput.addEventListener('input', () => {
    const minQty = parseInt(filterQuantityInput.value);
    const filtered = isNaN(minQty)
        ? supplies
        : supplies.filter(item => item.quantity >= minQty);
    render(filtered);
});

// Sortowanie
sortByNameButton.addEventListener('click', () => {
    supplies.sort((a, b) =>
        nameSortAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
    );
    nameSortIcon.className = nameSortAsc
        ? 'fas fa-sort-alpha-up'
        : 'fas fa-sort-alpha-down';
    nameSortAsc = !nameSortAsc;
    save();
});

sortByQuantityButton.addEventListener('click', () => {
    supplies.sort((a, b) =>
        quantitySortAsc
            ? a.quantity - b.quantity
            : b.quantity - a.quantity
    );
    quantitySortIcon.className = quantitySortAsc
        ? 'fas fa-sort-numeric-up'
        : 'fas fa-sort-numeric-down';
    quantitySortAsc = !quantitySortAsc;
    save();
});

sortByCategoryButton.addEventListener('click', () => {
    supplies.sort((a, b) =>
        categorySortAsc
            ? a.category.localeCompare(b.category)
            : b.category.localeCompare(a.category)
    );
    categorySortIcon.className = categorySortAsc
        ? 'fas fa-sort-alpha-up'
        : 'fas fa-sort-alpha-down';
    categorySortAsc = !categorySortAsc;
    save();
});

let totalPriceSortAsc = true;

sortByTotalPriceButton.addEventListener('click', () => {
    supplies.sort((a, b) =>
        totalPriceSortAsc
            ? (a.quantity * a.price) - (b.quantity * b.price)
            : (b.quantity * b.price) - (a.quantity * a.price)
    );
    
    totalPriceSortIcon.className = totalPriceSortAsc
        ? 'fas fa-sort-numeric-up'
        : 'fas fa-sort-numeric-down';

    totalPriceSortAsc = !totalPriceSortAsc;
    save();
});


// Ciemny motyw
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') body.classList.add('dark-mode');

    const updateIcon = () => {
        toggleButton.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
    };

    updateIcon();

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateIcon();
    });
});

// Eksport do CSV
document.getElementById('exportCsv').addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,Nazwa,Ilość,Kategoria,Cena,Cena całkowita\n";
    supplies.forEach(item => {
        const totalPrice = item.quantity * item.price;
        csvContent += `${item.name},${item.quantity},${item.category},${item.price.toFixed(2)},${totalPrice.toFixed(2)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "zestawienie_zapasów.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("📁 Dane wyeksportowane do CSV");
});

// Eksport do PDF
// Eksport do PDF
document.getElementById('exportPdf').addEventListener('click', () => {
    const actionButtons = document.querySelectorAll('.action-buttons');
    actionButtons.forEach(button => button.style.display = 'none');

    // Blokowanie zmiany wymiarów tabeli podczas generowania PDF
    const element = document.getElementById('suppliesList');
    const originalWidth = element.offsetWidth; // Zapisz szerokość przed generowaniem PDF
    const originalHeight = element.offsetHeight; // Zapisz wysokość przed generowaniem PDF

    const opt = {
        margin:       0.5,
        filename:     'zestawienie_zapasów.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save().then(() => {
        actionButtons.forEach(button => button.style.display = 'flex');

        // Po zakończeniu eksportu, przywróć oryginalne wymiary tabeli
        element.style.width = `${originalWidth}px`;
        element.style.height = `${originalHeight}px`;

        // Wyświetl powiadomienie o zakończeniu eksportu
        showToast("📁 Dane wyeksportowane do PDF");
    });
});

// Powiadomienie toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}


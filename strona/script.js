const form = document.getElementById('suppliesForm');
const nameInput = document.getElementById('itemName');
const quantityInput = document.getElementById('itemQuantity');
const categoryInput = document.getElementById('itemCategory');
const tableBody = document.querySelector('#suppliesList tbody');

const searchInput = document.getElementById('searchInput');
const filterQuantityInput = document.getElementById('filterQuantity');
const sortByNameButton = document.getElementById('sortByName');
const sortByQuantityButton = document.getElementById('sortByQuantity');
const sortByCategoryButton = document.getElementById('sortByCategory'); // Nowy przycisk
const nameSortIcon = document.getElementById('nameSortIcon');
const quantitySortIcon = document.getElementById('quantitySortIcon');
const categorySortIcon = document.getElementById('categorySortIcon'); // Ikona sortowania kategorii

const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editNameInput = document.getElementById('editName');
const editQuantityInput = document.getElementById('editQuantity');
const editCategoryInput = document.getElementById('editCategory');
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
let categorySortAsc = true; // Zmienna dla sortowania po kategorii

render();

// Dodawanie nowego produktu
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const category = categoryInput.value.trim();

    if (!name || quantity <= 0 || !category) return;

    supplies.push({ name, quantity, category });
    save();
});

// Renderowanie tabeli
function render(data = supplies) {
    tableBody.innerHTML = ''; // Czyścimy tabelę przed ponownym renderowaniem
    data.forEach((item, i) => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.quantity;

        // Komórka dla kategorii z flexboxem
        const categoryCell = row.insertCell();
        categoryCell.classList.add('category-cell'); // Dodajemy klasę do komórki

        // Tworzymy span dla tekstu kategorii
        const categoryText = document.createElement('span');
        categoryText.textContent = item.category;
        categoryText.classList.add('category-text'); // Dodajemy klasę do tekstu
        categoryCell.appendChild(categoryText);

        // Tworzymy div z przyciskami edytowania i usuwania
        const actionDiv = document.createElement('div');
        actionDiv.classList.add('action-buttons'); // Tworzymy kontener na przyciski

        // Przyciski Edytuj
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edytuj';
        editBtn.classList.add('edit-button'); // Dodajemy klasę dla przycisku Edytuj
        editBtn.addEventListener('click', () => openEditModal(i));

        // Przyciski Usuń
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Usuń';
        deleteBtn.classList.add('delete-button'); // Dodajemy klasę dla przycisku Usuń
        deleteBtn.addEventListener('click', () => openDeleteModal(i));

        // Dodajemy przyciski do div
        actionDiv.appendChild(editBtn);
        actionDiv.appendChild(deleteBtn);

        // Dodajemy div z przyciskami do komórki kategorii
        categoryCell.appendChild(actionDiv);
    });
}

// Zapis do localStorage i odświeżenie
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
    editModal.style.display = 'flex';
}

editForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = editNameInput.value.trim();
    const quantity = parseInt(editQuantityInput.value);
    const category = editCategoryInput.value.trim();

    if (!name || quantity <= 0 || !category) return;

    supplies[productToEdit] = { name, quantity, category };
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

// Filtrowanie po ilości
filterQuantityInput.addEventListener('input', () => {
    const minQty = parseInt(filterQuantityInput.value);
    const filtered = isNaN(minQty)
        ? supplies
        : supplies.filter(item => item.quantity >= minQty);
    render(filtered);
});

// Sortowanie po nazwie
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

// Sortowanie po ilości
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

// Sortowanie po kategorii
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
    let csvContent = "data:text/csv;charset=utf-8,Nazwa,Ilość,Kategoria\n";
    supplies.forEach(item => {
        csvContent += `${item.name},${item.quantity},${item.category}\n`;
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

// Eksport do PDF (wymaga html2pdf)
document.getElementById('exportPdf').addEventListener('click', () => {
    const element = document.getElementById('suppliesList');
    const opt = {
        margin:       0.5,
        filename:     'zestawienie_zapasów.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();

    showToast("📄 Dane wyeksportowane do PDF");
});

// Funkcja wyświetlająca powiadomienie (Toast)
function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;

    document.body.appendChild(toast);

    // Usuwamy powiadomienie po 3 sekundach
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500); // Usuwamy po zakończeniu animacji
    }, 3000);
}

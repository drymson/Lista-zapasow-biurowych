    const form = document.getElementById('suppliesForm');
    const nameInput = document.getElementById('itemName');
    const quantityInput = document.getElementById('itemQuantity');
    const table = document.getElementById('suppliesList');
    const tableBody = document.querySelector('#suppliesList tbody');

    // Wczytywanie zapasów biurowych z localStorage, jeśli istnieją, w przeciwnym razie ustawia pustą tablicę
    let supplies = JSON.parse(localStorage.getItem('supplies')) || [];

    // Renderowanie tabeli po załadowaniu strony
    render();

    // Obsługiwanie zdarzenia submit formularza, dodając nowy produkt do zapasów
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = nameInput.value;
        const quantity = parseInt(quantityInput.value);

        if (!name || quantity <= 0) return;

        supplies.push({ name, quantity });
        save();
    });

    // Funkcja renderująca zawartość tabeli na podstawie danych z tablicy supplies
    function render() {
        tableBody.innerHTML = '';
        supplies.forEach(function(item, i) {
            const row = tableBody.insertRow();

            const nameCell = row.insertCell();
            nameCell.textContent = item.name;

            const quantityCell = row.insertCell();
            quantityCell.innerHTML = `
                ${item.quantity}
                <div class="action-buttons">
                    <button onclick="edit(${i})">Edytuj</button>
                    <button onclick="remove(${i})">Usuń</button>
                </div>
            `;
        });
    }


    // Funkcja zapisująca dane do localStorage i resetująca formularz
    function save() {
        localStorage.setItem('supplies', JSON.stringify(supplies));
        render();
        form.reset();
    }

    // Funkcja do edycji danych wybranego produktu
    function edit(i) {
        const name = prompt('Nowa nazwa:', supplies[i].name);
        const quantity = prompt('Nowa ilość:', supplies[i].quantity);
        if (name && quantity > 0) {
            supplies[i] = { name: name, quantity: parseInt(quantity) };
            save();
        }
    }

    // Funkcja do usuwania produktu z listy zapasów
    function remove(i) {
        if (confirm('Usunąć ten produkt?')) {
            supplies.splice(i, 1);
            save();
        }
    }

const pokedexList = document.getElementById('pokedexList');
const displayCard = document.getElementById('pokemonDisplay');
const randomBtn = document.getElementById('randomBtn');
const searchInput = document.getElementById('searchInput');
const excludedCountLabel = document.getElementById('excludedCount');

let allPokemon = []; // Lista completa per la ricerca
let excludedIds = new Set(); // ID dei Pokémon da non estrarre

// 1. Inizializzazione
async function init() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025'); // Limite attuale gen 9
        const data = await response.json();
        
        // Mappiamo i dati per avere ID e nome pronti
        allPokemon = data.results.map((p, index) => ({
            name: p.name,
            id: index + 1,
            url: p.url
        }));

        renderList(allPokemon);
    } catch (e) {
        console.error("Errore caricamento:", e);
    }
}

// 2. Renderizza la lista con filtri
function renderList(list) {
    pokedexList.innerHTML = '';
    list.forEach(pk => {
        const isExcluded = excludedIds.has(pk.id);
        const item = document.createElement('div');
        item.className = `pk-item ${isExcluded ? 'excluded' : ''}`;
        
        item.innerHTML = `
            <strong>#${pk.id}</strong><br>
            <span style="text-transform:capitalize">${pk.name}</span><br>
            <button class="exclude-btn" onclick="toggleExclude(${pk.id})">
                ${isExcluded ? 'Includi' : 'Escludi'}
            </button>
        `;
        pokedexList.appendChild(item);
    });
}

// 3. Gestione Esclusione
function toggleExclude(id) {
    if (excludedIds.has(id)) {
        excludedIds.delete(id);
    } else {
        excludedIds.add(id);
    }
    excludedCountLabel.innerText = `Pokémon esclusi: ${excludedIds.size}`;
    filterPokemon(); // Aggiorna la vista
}

// 4. Ricerca in tempo reale
function filterPokemon() {
    const term = searchInput.value.toLowerCase();
    const filtered = allPokemon.filter(pk => 
        pk.name.includes(term) || pk.id.toString().includes(term)
    );
    renderList(filtered);
}

// 5. Estrazione Random (considerando gli esclusi)
async function getRandomPokemon() {
    // Creiamo la lista dei disponibili
    const available = allPokemon.filter(pk => !excludedIds.has(pk.id));
    
    if (available.length === 0) {
        alert("Hai escluso tutti i Pokémon! Includine almeno uno.");
        return;
    }

    displayCard.innerHTML = "<p>Lancio della Pokéball...</p>";
    const randomPk = available[Math.floor(Math.random() * available.length)];
    
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPk.id}`);
    const data = await res.json();
    
    displayInfo(data);
}

// Mostra i dettagli (stessa funzione di prima migliorata)
function displayInfo(pk) {
    displayCard.innerHTML = `
        <div style="border-bottom: 2px solid #ff1c1c; padding-bottom:10px; margin-bottom:10px;">
            <h2 style="text-transform: capitalize; margin:0;">#${pk.id} - ${pk.name}</h2>
            <img src="${pk.sprites.front_default}" style="width:120px">
        </div>
        <p><strong>Tipo:</strong> ${pk.types.map(t => t.type.name).join(', ')}</p>
        <p><strong>Stat Base:</strong> HP ${pk.stats[0].base_stat} | ATK ${pk.stats[1].base_stat} | DEF ${pk.stats[2].base_stat}</p>
        <button id="randomBtn" onclick="getRandomPokemon()">Estrai un altro</button>
    `;
}

// Event Listeners
searchInput.addEventListener('input', filterPokemon);
randomBtn.addEventListener('click', getRandomPokemon);

init();
const pokedexList = document.getElementById('pokedexList');
const displayCard = document.getElementById('pokemonDisplay');
const randomBtn = document.getElementById('randomBtn');

let totalPokemon = 0;

// 1. Carica la lista completa all'avvio
async function initPokedex() {
    // La PokéAPI ha attualmente oltre 1000 Pokémon tra tutte le generazioni
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
    const data = await response.json();
    totalPokemon = data.results.length;

    data.results.forEach((pokemon, index) => {
        const item = document.createElement('div');
        item.className = 'pk-item';
        item.innerText = `${index + 1}. ${pokemon.name}`;
        pokedexList.appendChild(item);
    });
}

// 2. Funzione per estrarre un Pokémon random con dettagli
async function getRandomPokemon() {
    displayCard.innerHTML = "<p>Cercando nell'erba alta...</p>";
    
    // Genera un ID casuale basato sul totale dei Pokémon
    const randomId = Math.floor(Math.random() * totalPokemon) + 1;
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const pokemon = await response.json();
        
        renderPokemon(pokemon);
    } catch (error) {
        displayCard.innerHTML = "<p>Errore nel recupero dati. Riprova!</p>";
    }
}

// 3. Renderizza il Pokémon nella card superiore
function renderPokemon(pk) {
    const types = pk.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join(' ');
    const abilities = pk.abilities.map(a => a.ability.name).join(', ');
    
    displayCard.innerHTML = `
        <h2 style="text-transform: capitalize;">#${pk.id} - ${pk.name}</h2>
        <img src="${pk.sprites.front_default}" class="info-img" alt="${pk.name}">
        <div><strong>Tipo:</strong> ${types}</div>
        <div><strong>Abilità:</strong> ${abilities}</div>
        <div><strong>Altezza:</strong> ${pk.height / 10} m | <strong>Peso:</strong> ${pk.weight / 10} kg</div>
        <div style="margin-top:10px;">
            <strong>Statistiche Base:</strong><br>
            HP: ${pk.stats[0].base_stat} | ATK: ${pk.stats[1].base_stat} | DEF: ${pk.stats[2].base_stat}
        </div>
    `;
}

randomBtn.addEventListener('click', getRandomPokemon);
initPokedex();
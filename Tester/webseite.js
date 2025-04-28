



const recipeForm = document.getElementById('recipeForm');
const recipeList = document.getElementById('recipeList');
const favoritesList = document.getElementById('favoritesList');

let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

if (favoritesList) {
    displayFavorites();
}

if (recipeForm) {
    recipeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const recipeName = document.getElementById('recipeName').value;
        const recipeInstructions = document.getElementById('recipeInstructions').value;

        const recipe = { name: recipeName, instructions: recipeInstructions };
        recipes.push(recipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        displayRecipes();
        recipeForm.reset();
    });
}

function displayRecipes() {
    if (recipeList) {
        recipeList.innerHTML = '';
        recipes.forEach((recipe, index) => {
            const li = document.createElement('li');
            li.className = 'recipe-card';
            li.innerHTML = `
                <h3>${recipe.name}</h3>
                <p>${recipe.instructions}</p>
                <div class="recipe-actions">
                    <button onclick="editRecipe(${index})">Bearbeiten</button>
                    <button onclick="deleteRecipe(${index})">Löschen</button>
                    <button onclick="addToFavorites(${index})">Zu Favoriten</button>
                </div>
            `;
            recipeList.appendChild(li);
        });
    }
}

function editRecipe(index) {
    const recipe = recipes[index];
    document.getElementById('recipeName').value = recipe.name;
    document.getElementById('recipeInstructions').value = recipe.instructions;
    deleteRecipe(index);
}

function deleteRecipe(index) {
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

function addToFavorites(index) {
    const recipe = recipes[index];
    if (!favorites.includes(recipe)) {
        favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    favorites.forEach(recipe => {
        const li = document.createElement('li');
        li.className = 'recipe-card';
        li.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>${recipe.instructions}</p>
        `;
        favoritesList.appendChild(li);
    });
}
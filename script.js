// get the elements from the page
const foodForm = document.getElementById("food-form");
const foodNameInput = document.getElementById("food-name");
const caloriesInput = document.getElementById("calories");
const foodList = document.getElementById("food-list");
const totalCalories = document.getElementById("total-calories");
const resetButton = document.getElementById("reset-btn");
const lookupButton = document.getElementById("lookup-btn");
const lookupMessage = document.getElementById("lookup-message");

// store today's food here
let foods = [];

// show the foods on the page
function displayFoods() {
    foodList.innerHTML = "";

    if (foods.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "No foods added yet. Start by adding your first meal.";
        emptyMessage.className = "text-center text-gray-500 py-6";
        foodList.appendChild(emptyMessage);
        return;
    }

    foods.forEach(function (food, index) {
        const listItem = document.createElement("li");
        listItem.className = "flex items-center justify-between bg-gray-50 p-4 rounded-lg border";

        const foodInfo = document.createElement("span");
        foodInfo.textContent = food.name + " - " + food.calories + " kcal";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";
        removeButton.className = "bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600";
        removeButton.addEventListener("click", function () {
            removeFood(index);
        });

        listItem.appendChild(foodInfo);
        listItem.appendChild(removeButton);
        foodList.appendChild(listItem);
    });
}

// Add up all calories
function calculateTotalCalories() {
    let total = 0;
    foods.forEach(function (food) {
        total += food.calories;
    });
    totalCalories.textContent = total;
}
// Save the list so it stays after refresh
function saveFoods() {
    localStorage.setItem("foods", JSON.stringify(foods));
}

// load saved foods when the page opens
function loadFoods() {
    const savedFoods = localStorage.getItem("foods");
    if (savedFoods) {
        foods = JSON.parse(savedFoods);
    }
    displayFoods();
    calculateTotalCalories();
}
// Add one food, then save and refresh the screen
function addFood(foodName, calories) {
    const food = {
        name: foodName,
        calories: calories
    };
    foods.push(food);
    saveFoods();
    displayFoods();
    calculateTotalCalories();
}

// Delete one food
function removeFood(index) {
    foods.splice(index, 1);
    saveFoods();
    displayFoods();
    calculateTotalCalories();
}
// Clear the whole day
function resetCalories() {
    foods = [];
    localStorage.removeItem("foods");
    displayFoods();
    calculateTotalCalories();
}
// Look up a food name in foods.json
async function fetchFoodData(foodName) {
    try {
        const response = await fetch("foods.json");
        if (!response.ok) {
            throw new Error("Failed to fetch food data.");
        }
        const foodData = await response.json();
        const food = foodData.find(function (item) {
            return item.name.toLowerCase() === foodName.toLowerCase();
        });
        return food;
    } catch (error) {
        console.error("Error fetching food data:", error);
        return null;
    }
}
// when the form is submitted, add the food
foodForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const foodName = foodNameInput.value.trim();
    const calories = Number(caloriesInput.value);

    if (foodName === "") {
        alert("Please enter a food name.");
        return;
    }

    if (calories <= 0) {
        alert("Please enter a valid calorie amount.");
        return;
    }

    addFood(foodName, calories);
    foodForm.reset();
    lookupMessage.textContent = "";
});
// reset button
resetButton.addEventListener("click", resetCalories);

// find calories button
lookupButton.addEventListener("click", async function () {
    const foodName = foodNameInput.value.trim();

    if (foodName === "") {
        lookupMessage.textContent = "Please enter a food name first.";
        return;
    }

    const food = await fetchFoodData(foodName);

    if (food) {
        caloriesInput.value = food.calories;
        lookupMessage.textContent = food.name + " contains approximately " + food.calories + " kcal.";
    } else {
        lookupMessage.textContent = "Food not found. Please enter the calories manually.";
    }
});

// start the app with anything already saved
loadFoods();
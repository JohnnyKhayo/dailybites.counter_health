
 const foodForm = document.getElementById("food-form");
const foodNameInput = document.getElementById("food-name");
const caloriesInput = document.getElementById("calories");
const foodList = document.getElementById("food-list");
const totalCalories = document.getElementById("total-calories");
const resetButton = document.getElementById("reset-btn");
const lookupButton = document.getElementById("lookup-btn");
const lookupMessage = document.getElementById("lookup-message");

let foods = [];


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

function calculateTotalCalories() {
    let total = 0;
    foods.forEach(function (food) {
        total += food.calories;
    });
    totalCalories.textContent = total;
}


function saveFoods() {
    localStorage.setItem("foods", JSON.stringify(foods));
}


function loadFoods() {
    const savedFoods = localStorage.getItem("foods");
    if (savedFoods) {
        foods = JSON.parse(savedFoods);
    }
    displayFoods();
    calculateTotalCalories();
}

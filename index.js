const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
  console.log('Database connected!');
})();

// Function to get all restaurants from the database
async function getAllRestaurants() {
  const query = 'SELECT * FROM RESTAURANTS';
  const response = await db.all(query, []);
  return { restaurants: response };
}

// Route to get all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    const results = await getAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants found!' });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching restaurants!' });
  }
});

async function getRestaurantById(id) {
  const query = 'SELECT * FROM RESTAURANTS WHERE id = ?';
  const response = await db.get(query, [id]);
  return { restaurant: response };
}

// Route to get restaurant by id
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const results = await getRestaurantById(restaurantId);
    console.log(results);
    if (!results.restaurant) {
      return res.status(404).json({
        message: 'No Restaurants found with given id ' + restaurantId,
      });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching restaurants!' });
  }
});

async function getRestaurantByCuisine(cuisine) {
  const query = 'SELECT * FROM RESTAURANTS WHERE cuisine = ?';
  const response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

// get restaurant list by cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const results = await getRestaurantByCuisine(cuisine);
    console.log(results);
    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: 'No Restaurants found with given cuisine ' + cuisine,
      });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching restaurants!' });
  }
});

async function getAllRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  const query =
    'SELECT * FROM RESTAURANTS where isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  const response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

// get restaurant list by filters
app.get('/restaurants/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  const hasOutdoorSeating = req.query.hasOutdoorSeating;
  const isLuxury = req.query.isLuxury;

  try {
    const results = await getAllRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    console.log(results);
    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: 'No Restaurants found with filter ! ',
      });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching restaurants!' });
  }
});

async function getRestaurantsSortByRating() {
  const query = 'SELECT * FROM RESTAURANTS ORDER BY rating DESC';
  const response = await db.all(query, []);
  return { restaurants: response };
}

// get restaurant list by sortbyrating
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const results = await getRestaurantsSortByRating();
    if (results.restaurants.length === 0) {
      return res.status(404).json({
        message: 'No Restaurants found ! ',
      });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching restaurants!' });
  }
});

async function getAllDishes() {
  const query = 'SELECT * FROM DISHES';
  const response = await db.all(query, []);
  return { dishes: response };
}

// Route to get all dishes
app.get('/dishes', async (req, res) => {
  try {
    const results = await getAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes found!' });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching Dishes!' });
  }
});

async function getAllDishesById(id) {
  const query = 'SELECT * FROM DISHES WHERE id = ?';
  const response = await db.get(query, [id]);
  return { dish: response };
}

// Get dishes by id
app.get('/dishes/details/:id', async (req, res) => {
  const dishId = req.params.id;
  try {
    const results = await getAllDishesById(dishId);
    if (!results.dish) {
      return res
        .status(404)
        .json({ message: 'No Dishes found! by id ' + dishId });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching Dishe by id!' });
  }
});

async function getAllDishesByFilter(isVeg) {
  const query = 'SELECT * FROM DISHES where isVeg = ?';
  const response = await db.all(query, [isVeg]);
  return { dishes: response };
}

//Get Dishes by Filter
app.get('/dishes/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  try {
    const results = await getAllDishesByFilter(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({
        message: 'No dishes found with filter isVeg' + isVeg,
      });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching dishes by price!' });
  }
});

async function getDishesSortByPrice() {
  const query = 'SELECT * FROM DISHES ORDER BY price';
  const response = await db.all(query, []);
  return { dishes: response };
}

// get restaurant list by sortbyrating
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const results = await getDishesSortByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({
        message: 'No dishes found ! ',
      });
    } else {
      return res.status(200).json({ results });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching dishes by price!' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

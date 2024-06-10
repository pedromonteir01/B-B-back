const pool = require('../config/database.config');

//GET all restaurants 
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await pool.query(`
    SELECT 
        restaurants.name AS restaurant,
        restaurants.type AS type,
        restaurants.id AS id,
        restaurants.image
    FROM restaurants;
    `);
        return restaurants.rowCount > 0 ?
            res.status(200).send({ total: restaurants.rowCount, restaurants: restaurants.rows }) :
            res.status(200).send({ message: 'Restaurants not registered' });
    } catch (e) {
        console.log('Could not GET all restaurants, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
}

//GET restaurants by name
const getRestaurantsByName = async (req, res) => {
    try {
        const { name } = req.params;
        console.log(name);

        const restaurants = await pool.query(`
SELECT *
FROM restaurants
WHERE name LIKE $1;

        `, [`${name}%`]);
        return restaurants.rowCount > 0 ?
            res.status(200).send(restaurants.rows) :
            res.status(404).send({ message: 'Restaurants not found' });
    } catch (e) {
        console.log('Could not GET restaurants by name, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
}

//GET restaurants by id
const getRestaurantsById = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurants = await pool.query(`
SELECT 
    *
FROM
    restaurants
WHERE 
    restaurants.id = $1;
`, [id]);
        return restaurants.rowCount > 0 ?
            res.status(200).send(restaurants.rows[0]) :
            res.status(404).send({ message: 'Restaurant not found' });
    } catch (e) {
        console.log('Could not GET restaurants by id, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
}

const getRestaurantsByType = async (req, res) => {
    try {
        const { type } = req.params;

        const restaurants = await pool.query(`
        SELECT name, type, id, image, operation FROM restaurants WHERE type=$1`, [type]);
        return restaurants.rowCount > 0 ?
            res.status(200).send(restaurants.rows) :
            res.status(404).send({ message: 'Restaurants not found' });
    } catch (e) {
        console.log('Could not GET restaurants by type, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
}

//POST restaurants
const postRestaurants = async (req, res) => {
    try {
        const { name, type, operation, address } = req.body;

        if (!name || !type || !operation || !address) {
            return res.status(400).send({ message: 'inconplete data' });
        } else if (typeof name !== 'string' || typeof type !== 'string' || typeof operation !== 'string' || typeof address !== 'number') {
            return res.state(400).send({ message: 'Invalid types' });
        } else if (operation.length !== 11) {
            return res.state(400).send({ message: 'Invalid Operation' });
        } else {
            await pool.query('INSERT INTO restaurants(name, type, operation, address) VALUES($1, $2, $3, $4,)',
                [name, type, operation, address]);
            return res.status(201).send({ message: 'Restaurants successfully registered' });
        }
    } catch (e) {
        console.log('Could not POST restaurants, server error', e);
        return res.status(500).send({ message: 'Could not HTTP POST' });
    }
}

//DELETE restaurants by id
const deleteRestaurantsById = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurants = getRestaurantsById(id);

        if (!restaurants) {
            return res.status(404).send({ message: 'Restaurant not found' });
        }

        await pool.query('DELETE FROM restaurants WHERE id=$1', [id]);
        return res.status(200).send({ message: 'restaurants successfully deleted' });
    } catch (e) {
        console.log('Could not DELETE restaurants, server error', e);
        return res.status(500).send({ message: 'Could not HTTP DELETE' });
    }
}

/*DELETE restaurants by name
const deleteRestaurantsByName = async(req, res) => {
    try {
        const { name } = req.params;

        const restaurants = getRestaurantsByName(name);
        
        if(!restaurants) {
            return res.status(404).send({ message: 'Restaurant not found' });
        }

        await pool.query('DELETE FROM restaurants WHERE name LIKE $1', [`${name}%`]);
        return res.status(200).send({ message: 'restaurants successfully deleted' });
    } catch(e) {
        console.log('Could not DELETE restaurants, server error', e);
        return res.status(500).send({ message: 'Could not HTTP DELETE' });
    }
}
*/

//PUT restaurants
const putRestaurants = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, operation, address } = req.body;;

        const restaurants = getRestaurantsById(id);

        if (!restaurants) {
            return res.status(404).send({ message: 'Restaurant not found' });
        }

        if (!name || !type || !operation || !address) {
            return res.status(400).send({ message: 'inconplete data' });
        } else if (typeof name !== 'string' || typeof type !== 'string' || typeof operation !== 'string' || typeof address !== 'number') {
            return res.state(400).send({ message: 'Invalid types' });
        } else if (operation.length !== 11) {
            return res.state(400).send({ message: 'Invalid Operation' });
        } else {
            await pool.query('UPDATE restaurants SET name=$1, type=$2, opertion=$3, address=$4 WHERE id=$5',
                [name, type, operation, address, id]);
            return res.status(200).send({ message: 'restaurants successfully updated' });
        }
    } catch (e) {
        console.log('Could not PUT user, server error', e);
        return res.status(500).send({ message: 'Could not HTTP PUT' });
    }
}

module.exports = { getRestaurants, getRestaurantsByName, getRestaurantsById, getRestaurantsByType, postRestaurants, putRestaurants, deleteRestaurantsById };
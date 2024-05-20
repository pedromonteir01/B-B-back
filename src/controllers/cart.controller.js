const pool = require('../config/database.config');

const getOrdersInCart = async(req, res) => {
    try {
        const { useremail } = req.params;

        const orders = await pool.query(`SELECT 
        orders.id AS order_id,
        orders.dateandhour AS order_date,
        orders.state AS order_state,
        restaurants.name AS restaurant_name,
        products.name AS product_name,
        itensorders.quantity AS quantity,
        products.price AS price_per_unit
    FROM 
        orders
    INNER JOIN 
        itensorders ON orders.id = itensorders.orderid
    INNER JOIN 
        products ON itensorders.productid = products.id
    INNER JOIN 
        restaurants ON orders.restaurantid = restaurants.id
    WHERE 
        orders.userEmail = 'pedrormont@gmail.com';
    
    `,[useremail]);

    //query errada

        return orders.rowCount > 0 ? 
            res.status(200).send({ total: orders.rowCount, orders: orders.rows }) :
            res.status(200).send({ message: 'There are no pending orders' });
    } catch(e) {
        console.log('Could not GET orders, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
}

const historyOrdersByUser = async(req, res) => {
    try {
        const { useremail } = req.params;

        const orders = await pool.query('SELECT * FROM orders WHERE useremail=$1',[useremail]);

        return orders.rowCount > 0 ? 
            res.status(200).send({ total: orders.rowCount, orders: orders.rows }) :
            res.status(200).send({ message: 'There are no pending orders' });
    } catch(e) {
        console.log('Could not GET orders, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
}

module.exports = { getOrdersInCart, historyOrdersByUser };
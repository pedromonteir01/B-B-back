const pool = require('../config/database.config');

const getOrdersInCart = async (req, res) => {
    try {
        const { useremail } = req.params;
        const orders = await pool.query(`
            SELECT 
                orders.id AS order_id,
                orders.dateandhour AS order_date,
                orders.state AS order_state,
                restaurants.image AS image,
                restaurants.id AS restaurant_id,
                restaurants.name AS restaurant_name,
                STRING_AGG(products.name || ' (Quantity: ' || itensorders.quantity || ', Price: ' || products.price || ')', ', ') AS products_details,
                SUM(itensorders.quantity * products.price) AS total_price
            FROM 
                orders
            INNER JOIN 
                itensorders ON orders.id = itensorders.orderid
            INNER JOIN 
                products ON itensorders.productid = products.id
            INNER JOIN 
                restaurants ON orders.restaurantid = restaurants.id
            WHERE 
                orders.userEmail = $1
            GROUP BY 
                orders.id, orders.dateandhour, orders.state, restaurants.name, restaurants.id, restaurants.image;
        `, [useremail]);

        return orders.rowCount > 0 
            ? res.status(200).send({ total: orders.rowCount, orders: orders.rows })
            : res.status(200).send({ message: 'There are no pending orders' });
    } catch (e) {
        console.log('Could not GET orders, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await pool.query('SELECT * FROM orders WHERE id=$1', [id]);
        return order.rowCount > 0 
            ? res.status(200).send(order.rows[0])
            : res.status(200).send({ message: 'order not found' });
    } catch (e) {
        console.log('Could not GET orders, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
};

const getOrderByState = async (req, res) => {
    try {
        const { email } = req.params;
        const order = await pool.query('SELECT * FROM orders WHERE state=$1 AND useremail=$2', ['cart', email]);
        return order.rowCount > 0 
            ? res.status(200).send(order.rows[0])
            : res.status(200).send({ message: 'order not found' });
    } catch (e) {
        console.log('Could not GET orders, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
};

const postOrder = async (req, res) => {
    try {
        const { userEmail, restaurantID, dateandhour, state, itens } = req.body;
        console.log('Itens recebidos:', itens); // Log para verificar os itens
        const abstractDate = new Date(dateandhour);
        const newDate = `${abstractDate.getDate()}-${abstractDate.getMonth() + 1}-${abstractDate.getFullYear()} ${abstractDate.getHours()}:${abstractDate.getMinutes()}`;

        const orderReq = await pool.query(
            'INSERT INTO orders (userEmail, restaurantID, dateandhour, state) VALUES ($1, $2, $3, $4) RETURNING id',
            [userEmail, restaurantID, newDate, state]
        );
        const orderId = orderReq.rows[0].id;
        console.log('Pedido criado com ID:', orderId);

        for (const item of itens) {
            console.log('Inserindo item:', item);
            await pool.query(
                'INSERT INTO itensorders (orderid, productid, quantity) VALUES ($1, $2, $3)',
                [orderId, item.productid, item.quantity]
            );
            console.log(`Item inserido: Pedido ID ${orderId}, Produto ID ${item.productid}, Quantidade ${item.quantity}`);
        }
        return res.status(201).send({ message: 'Pedido registrado', order: orderId });
    } catch (error) {
        console.log('Erro ao criar pedido', error);
        return res.status(500).send({ message: 'Erro interno' });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail, restaurantID, dateandhour, state, itens } = req.body;
        const abstractDate = new Date(dateandhour);
        const newDate = `${String(abstractDate.getDate()).padStart(2, '0')}-${String(abstractDate.getMonth() + 1).padStart(2, '0')}-${abstractDate.getFullYear()} ${String(abstractDate.getHours()).padStart(2, '0')}:${String(abstractDate.getMinutes()).padStart(2, '0')}`;

        console.log('Updating order ID:', id);
        const order = (await pool.query('SELECT * FROM orders WHERE id=$1', [id])).rows[0];

        if (!order) {
            console.log('Order not found');
            return res.status(404).send({ message: 'This order does not exist' });
        }

        await pool.query('UPDATE orders SET useremail=$1, restaurantid=$2, dateandhour=$3, state=$4 WHERE id=$5',
            [userEmail, restaurantID, newDate, state, id]);

        console.log('Clearing existing items for order ID:', id);
        await pool.query('DELETE FROM itensorders WHERE orderid=$1', [id]);

        console.log('Inserting updated items...');
        for (const item of itens) {
            console.log('Inserting item:', item);
            await pool.query(
                'INSERT INTO itensorders (orderid, productid, quantity) VALUES ($1, $2, $3)',
                [id, item.productid, item.quantity]
            );
        }

        return res.status(200).send({ message: 'Updated order' });

    } catch (e) {
        console.error('Could not PUT HTTP', e);
        return res.status(500).send({ message: 'Internal error' });
    }
};



const alterOrderState = async (req, res) => {
    try {
        const { id } = req.params;
        const { state } = req.body;
    
        const order = (await pool.query('SELECT * FROM orders WHERE id=$1', [id])).rows;
    
        if (!order.length) {
            return res.status(404).send({ message: 'Order not found' });
        }
    
        await pool.query('UPDATE orders SET state=$1 WHERE id=$2', [state, id]);
        return res.status(200).send({ message: 'order state updated', state });
    } catch (e) {
        console.log('Could not POST HTTP', e);
        return res.status(500).send({ message: 'Erro interno' });
    }
};

const deleteOrder = async (req, res) => {
    try { 
        const { id } = req.params;

        const order = (await pool.query('SELECT * FROM orders WHERE id=$1', [id])).rows;
    
        if (!order.length) {
            return res.status(404).send({ message: 'Order not found' });
        }

        await pool.query('DELETE FROM orders WHERE id=$1', [id]);
        await pool.query('DELETE FROM itensorders WHERE orderid=$1', [id]);

        return res.status(200).send({ message: 'Order deleted' });
    } catch (e) {
        console.log('Could not DELETE HTTP', e);
        return res.status(500).send({ message: 'Erro interno' });
    }
};

module.exports = { getOrdersInCart, postOrder, alterOrderState, updateOrder, getOrderById, deleteOrder, getOrderByState };

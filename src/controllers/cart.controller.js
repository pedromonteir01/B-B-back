const pool = require('../config/database.config');

const getOrdersInCart = async(req, res) => {
    try {
        const { useremail } = req.params;

        const orders = await pool.query(`SELECT 
        orders.id AS order_id,
        orders.dateandhour AS order_date,
        orders.state AS order_state,
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
        orders.id, orders.dateandhour, orders.state, restaurants.name;
    `,[useremail]);
        return orders.rowCount > 0 ? 
            res.status(200).send({ total: orders.rowCount, orders: orders.rows }) :
            res.status(200).send({ message: 'There are no pending orders' });
    } catch(e) {
        console.log('Could not GET orders, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
}


const postOrder= async (req, res) => {
    const { name,restaurantID,state,itens } = req.body;
  
    try {
          
  const orderReq= await pool.query(
        'INSERT INTO orders (name, restaurantID,state) VALUES ($1, $2, $3) RETURNING id',
        [name, restaurantID, state]
      );
  const orderid = orderReq[0].id;
  
   for (const item of itens) {
        await pool.query(
          'INSERT INTO itensOrders (orderid, productid, quantity) VALUES ($1, $2, $3)',
          [pedidoId, item.productId, item.quantity]
        );
      }
  res.status(200).json({ success: true, orderId });
    } catch (error) {
      console.error('Erro ao inserir pedido:', error);
      res.status(500).json({ success: false, error: 'Erro interno nessa bomba' });
    }
}

module.exports = { getOrdersInCart };
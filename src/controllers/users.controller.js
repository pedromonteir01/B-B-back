const pool = require('../config/database.config');
const { verifyEmail, verifyCpf, verifyPassword } = require('../models/verify.functions');

const getAllUsers = async(req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users;');
        return users.rowCount > 0 ?
            res.status(200).send({ total: users.rowCount, users: users.rows }) :
            res.status(200).send({ message: 'Users not registered' });
    } catch(e) {
        console.log('Could not GET all users, server error', e);
        return res.status(500).send({ message: 'Could not HTTP GET' });
    }
}

const postUser = async(req, res) => {
    try {
        const { name, email, cpf, telephone, password, address } = req.body;

        if(name.length < 10) {
            return res.status(400).send({ message: 'short_name' });
        } else if(!verifyEmail(email)) {
            return res.status(400).send({ message: 'invalid_email' });
        } else if(!verifyCpf(cpf)) {
            return res.status(400).send({ message: 'invalid_cpf' });
        } else if(telephone.length < 11) {
            return res.status(400).send({ message: 'invalid_telephone' });
        } else if(!verifyPassword(password)) {
            return res.status(400).send({ message: 'invalid_password' });
        } else {
            await pool.query('INSERT INTO users(name, email, cpf, telephone, password, address) VALUES($1, $2, $3, $4, $5, $6);',
        [name, email, cpf, telephone, password, address]);
            return res.status(201).send({ message: 'user successfully registered' });
        }
    } catch(e) {
        console.log('Could not POST user, server error', e);
        return res.status(500).send({ message: 'Could not HTTP POST' });
    }
}

const putUser = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, email, cpf, telephone, password, address } = req.body;
        
        if(name.length < 10) {
            return res.status(400).send({ message: 'short_name' });
        } else if(!verifyEmail(email)) {
            return res.status(400).send({ message: 'invalid_email' });
        } else if(!verifyCpf(cpf)) {
            return res.status(400).send({ message: 'invalid_cpf' });
        } else if(telephone.length < 11) {
            return res.status(400).send({ message: 'invalid_telephone' });
        } else if(!verifyPassword(password)) {
            return res.status(400).send({ message: 'invalid_password' });
        } else {
            await pool.query('UPDATE users SET name=$1, email=$2, cpf=$3, telephone=$4, password=$5, address=$6 WHERE id=$7;',
        [name, email, cpf, telephone, password, address, id]);
            return res.status(200).send({ message: 'user successfully updated' });
        }
    } catch(e) {
        console.log('Could not PUT user, server error', e);
        return res.status(500).send({ message: 'Could not HTTP PUT' });
    }
}

const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE id=$1', [id]);
        return res.status(200).send({ message: 'user successfully deleted' });
    } catch(e) {
        console.log('Could not DELETE user, server error', e);
        return res.status(500).send({ message: 'Could not HTTP DELETE' });
    }
}

module.exports = { getAllUsers, postUser, putUser, deleteUser };
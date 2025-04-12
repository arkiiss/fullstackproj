const express = require('express');
const app = express();
const PORT = 3000;
const pool = require('./db');
app.use(express.static('public'));
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

app.post('/users', async(req,res) =>{
    const {name, email} = req.body;

    try{
        const result = await pool.query('INSERT INTO users (name,email) VALUES ($1,$2) RETURNING *',[name,email]);
        res.status(201).json(result.rows[0]);
    }
    catch(err){
        console.error(err);
        res.status(500).send('ошибка при создании пользователя');
    }
});

app.get('/users/:id',async(req,res) =>{
    const {id} = req.params;
    try{
        const result = await pool.query('select * from users where id = $1',[id]);
        if( result.rows.length === 0)
        {
            return res.status(404).send('пользователь не найден');
        }
        res.json(result.rows[0]);
    }catch (err) {
        console.error(err);
        res.status(500).send('ошибка при получении пользователя');
    }
});
app.delete('/users/:id', async(req,res) =>{
    const {id} = req.params;

    try{
        const result = await pool.query('delete from users where id = $1 returning *',[id]);

        if(result.rows.length === 0)
            return res.status(404).send('Пользователь не найден');
        res.send(`Пользователь с айди ${id} удален`);
    }catch(err){
        console.error(err);
        res.status(500).send('Ошибка при удалении пользователя');
    }
});
app.put('/users/:id', async(req,res)=>{
    const {id} = req.params;
    const {name,email} = req.body;
    try{
        const result = await pool.query('update users set name = $1, email = $2 where id = $3 returning *',[name,email,id]);
        if(result.rows.length === 0){
            return res.status(404).send('Пользователь не найден');
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).send('Ошибка при обновлении пользователя');
    }
});
app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});
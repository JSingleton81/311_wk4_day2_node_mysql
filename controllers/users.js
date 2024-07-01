const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

const getAllUsers = (req, res) => {
  // SELECT ALL USERS

  let sql = `
  SELECT * FROM users
  JOIN usersAddress
  JOIN usersContact
  LIMIT 200;
  `
  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const getUserById = (req, res) => {
  // SELECT USERS WHERE ID = <REQ PARAMS ID>
  const id = req.params.id;
  let sql = "SELECT * FROM users WHERE id = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [id])

  pool.query(sql, (err, rows) => {
    if (err) return handleSQLError(res, err)
    return res.json(rows);
  })
}

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  console.log(req.body)
  
  const first_name = req.body.first_name
  const last_name = req.body.last_name

  let sql = `
     INSERT INTO ?? (first_name, last_name) VALUES (?, ?);
  `
  const body = ["users", first_name, last_name]
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, body)

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
 
  let sql = `
  UPDATE users
  SET first_name = ?, last_name = ?
  WHERE id = ?;
  `
  const id = req.params.id
  const first_name = req.body.first_name
  const last_name = req.body.last_name

  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [first_name, last_name, id])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let sql = `
  DELETE FROM users
  WHERE first_name = ?;
  `

  const first_name = req.params.first_name
  
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [first_name])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}
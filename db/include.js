import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

export async function getBlogDescs() {
  const [rows] = await pool.query(`
    SELECT * FROM BlogSnippets
    ORDER BY posted DESC
  `)
  return rows
}

export async function getBlogDesc(searchStr) {
  const [rows] = await pool.query(`
  SELECT * 
  FROM BlogSnippets
  WHERE title LIKE ?
  ORDER BY posted DESC
  `, [`%${searchStr}%`])
  return rows
}

export async function getFullBlog(searchID) {
  const [rows] = await pool.query(`
  SELECT * FROM FullBlogs
  INNER JOIN BlogSnippets
  ON FullBlogs.title = BlogSnippets.title
  WHERE BlogSnippets.id = ?;
  `, [searchID])
  return rows
}

// export async function createNote(title, contents) {
//   const [result] = await pool.query(`
//   INSERT INTO notes (title, contents)
//   VALUES (?, ?)
//   `, [title, contents])
//   const id = result.insertId
//   return getNote(id)
// }
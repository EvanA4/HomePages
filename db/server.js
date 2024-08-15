import express from 'express'
import cors from 'cors'
import { getBlogDescs, getBlogDesc, getFullBlog } from './include.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get("/blogsnippets", async (req, res) => {
  const all = await getBlogDescs()
  console.log("Recieved request! Sending the following:", all)
  res.send(all)
})

app.get("/blogsnippets/:searchStr", async (req, res) => {
  const toSearch = req.params.searchStr
  const results = await getBlogDesc(toSearch)
  console.log("Recieved request! Sending the following:", results)
  res.send(results)
})

app.get("/fullblogs/:id", async (req, res) => {
  const toSearch = req.params.id
  const results = await getFullBlog(toSearch)
  console.log("Recieved request! Sending the following:", results)
  res.send(results)
})


// app.post("/notes", async (req, res) => {
//   const { title, contents } = req.body
//   const note = await createNote(title, contents)
//   res.status(201).send(note)
// })


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke')
})

app.listen(30360, () => {
  console.log('Server is running on port 30360')
})
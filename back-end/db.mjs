import { MongoClient, ServerApiVersion } from 'mongodb'

const URI_DB = process.env.MONGODB_URL

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI_DB, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export let db

export async function run () {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db('moneyTraker').command({ ping: 1 })
    db = client.db('moneyTraker')
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } catch (error) {
    console.error('Error conectando a la base de datos')
    await client.close()
  }
}

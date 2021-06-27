// imports

// import e from 'express';
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
// import dbMessages from './dbMessages';
import Pusher from 'pusher';
import cors from 'cors'

// App Config
const app = express();
const port = process.env.PORT || 9000


const pusher = new Pusher({
	appId: ":Your App ID",
	key: "Your Pusher Key",
	secret: "Your Pusher Key Secret",
	cluster: "eu",
	useTLS: true
  });
  
// middleware
app.use(express.json());
app.use(cors());

// app.use((req,res, next) =>
// {
// 	res.setHeader("Access-Control-Allow-Origin", "*")
// 	res.setHeader("Access-Control-Allow-Headers", "*");
// 	next();
// })

// DB Config
const connectionUrl = 'mongodb+srv://admin:jDq8GEusDfu94Ej@cluster0.34fpm.mongodb.net/Your Database Name?retryWrites=true&w=majority'
mongoose.connect(connectionUrl,{
	useCreateIndex : true,
	useNewUrlParser : true,
	useUnifiedTopology : true
})

const db = mongoose.connection
db.once('open',()=>
{
	console.log("DB Connected");

	const msgCollection = db.collection('messagecontents');
	const changeStream = msgCollection.watch();

	changeStream.on("change", (change) =>
	{
		// console.log(change);

		if(change.operationType == "insert")
		{
			const messageDetails = change.fullDocument;
			pusher.trigger('messages', 'inserted',
			{
				name: messageDetails.name,
				message: messageDetails.message
			})
		}
		else
		{
			console.log("Error Triggering Pusher");
		}
	})
})

// routes
app.get("/", (req,res)=> res.status(200).send("Hello World"))

app.get("/messages/sync", (req,res)=>
{
	Messages.find((err,data)=>
	{
		if(err)
		{
			res.status(500).send(err)
		}
		else
		{
			res.status(200).send(data)
		}
	})
})

app.post("/messages/new", (req,res)=>
{
	const dbMessage = req.body

	Messages.create(dbMessage, (err,data)=>
	{
		if(err)
		{
			res.status(500).send(err)
		}
		else
		{
			res.status(200).send(data)
		}
	})
})


// listen
app.listen(port, ()=>console.log(`listening at port:${port}`)
)
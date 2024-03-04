const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path")
const mongoose = require("mongoose");
const socketController = require('./controllers/socket_controller');

//Import Routes
const authRoute = require("./routes/auth");
const contactRoute = require("./routes/contact");
const todoRoute = require("./routes/todo");
const folderROuter = require("./routes/folderTodo");
const tripRoute = require("./routes/trip");
const actionRoute = require("./routes/actionTrip");
const planningRoute = require("./routes/planning");
const actionPlanningRoute = require("./routes/actionPlanning");
const meetingRoute = require("./routes/meeting");
const actionMeetingRoute = require("./routes/actionMeeting");
const chatRoute = require("./routes/chat");
dotenv.config();

//connect to DB server
mongoose.connect(
	process.env.DB_CONNECT,
	{
		useNewUrlParser: true,
		// useFindAndModify: false,
	},
	() => console.log("connect to database"),
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization",
	);
	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET",
		);
		return res.status(200).json({});
	}
	next();
});
app.use("/api/user", authRoute);
app.use("/api/user/contact", contactRoute);
app.use("/api/user/folder", folderROuter);
app.use("/api/user/todo", todoRoute);
app.use("/api/user/trip", tripRoute);
app.use("/api/user/actionTrip", actionRoute);
app.use("/api/user/meeting", meetingRoute);
app.use("/api/user/actionMeeting", actionMeetingRoute);
app.use("/api/user/planning", planningRoute);
app.use("/api/user/actionPlanning", actionPlanningRoute);
app.use("/api/user/chat", chatRoute);

const PORT = process.env.PORT || 3000;
const server = require("http").createServer(app);
const socketIO = require("socket.io")(server, {
	maxHttpBufferSize: 10e7,
	pingTimeout: 30000, // Set the timeout in milliseconds (adjust as needed)
  });
socketController.handleSocket(socketIO);

server.listen(PORT, () => console.log("Server UP and running ", PORT));

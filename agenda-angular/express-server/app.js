var express = require("express"), cors = require("cors");
var app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));

var eventos = ["Examen", "Examen Fisica I", "Examen Quimica", "Examen Algebra", "Examen Analisis Matematico", "Examen Probabilidad y Estadistica", "Natacion", "Evento", "Frances"];
app.get("/eventos", (req, res, next) => res.json(eventos.filter((c) => c.toLowerCase().indexOf(req.query.q.toString().toLowerCase()) > -1)));

var misTareas = [];
app.get("/my", (req, res, next) => {
	res.json(misTareas);
});
app.post("/my", (req, res, next) => {
	req.body.prioridad = true;
	console.log(req.body);
	misTareas.forEach((t) => t.prioridad = false);
	misTareas.unshift(req.body);
	res.json(misTareas);
});
app.get("/delete", (req, res, next) => {
	misTareas = misTareas.filter(t => t.id != req.query.id);
	res.end();
});
app.get("/prior", (req, res, next) => {
	var prior = misTareas.find(t => t.id == req.query.id);
	if(misTareas.length > 1) {
		var aux = misTareas.filter((t) => t.id != req.query.id);
		misTareas = aux;
		misTareas.unshift(prior);
	}
	misTareas.forEach(x => x.prioridad = false);
	prior.prioridad = true;
	res.end();
});
app.get("/vote", (req, res, next) => {
	var tarea = misTareas.find(t => t.id == req.query.id);
	tarea.votes = String(parseInt(tarea.votes) + parseInt(req.query.v));
	res.end();
});

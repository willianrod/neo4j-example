const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { getRelationsFromLabel } = require('./helpers/neode-helper');

const { createAluno, listAlunos, createAlunosRelationship, findByRa } = require('./controllers/alunos');

const app = express();

app.use(cors());

// parse application/json
app.use(bodyParser.json())
const port = 3000;

/*
* Routes
*/
app.post('/createAluno', createAluno);
app.post('/createRelationship', createAlunosRelationship);
app.get('/listAlunos', listAlunos);
app.get('/getAluno', findByRa);
app.get('/getRelations', getRelationsFromLabel);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
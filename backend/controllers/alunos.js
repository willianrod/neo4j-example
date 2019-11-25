const { neode, getAllNodesFromModel } = require('../helpers/neode-helper');

const createAluno = async (req, res) => {
    const { body } = req;

    const { ra, nome } = body;

    // CREATE (:Aluno {ra: 1923293, nome: 'Willian Rodrigues Barbosa'});
    return neode.create('Aluno', {
        ra,
        nome,
    }).then(async aluno => {
        const alunoJSON = await aluno.toJson();
        return res.status(200).send(alunoJSON);
    }).catch(ex => {
        res.status(500).send(ex);
    });
};

const findByRa = (req, res) => {
    try {
        const { body } = req;
        const { ra } = body;

        /**
        * MATCH (a:Aluno)
        * WHERE a.ra = 1923293
        * return a;
        */

        return neode.find('Aluno', ra).then(async aluno => {
            const alunoJSON = await aluno.toJson();
            res.status(200).send(alunoJSON);
        }).catch(ex => {
            console.warn(ex);
            res.status(500).send(ex);
        })

    } catch (ex) {
        res.status(500).send(ex);
    }
};

const createAlunosRelationship = (req, res) => {
    try {

        const { body } = req;

        const { raFrom, relation, raTo } = body;

        /**
         * MATCH (a:Aluno)
         * WHERE a.ra = 1923293
         * MATCH (b:Aluno)
         * WHERE b.ra = 1923294
         * CREATE (a)-[:FRIENDS_OF]->(b)
         */
        Promise.all([
            neode.first('Aluno', 'ra', raFrom),
            neode.first('Aluno', 'ra', raTo),
        ]).then(([a, b]) => {
            a.relateTo(b, relation)
                .then(async rel => {
                    const from = await a.toJson();
                    const to = await b.toJson();

                    res.status(200).send({
                        from,
                        to,
                        properties: rel.properties(),
                    });
                });
        }).catch(ex => {
            res.status(500).send(ex);
        });
    } catch (ex) {
        res.status(500).send(ex);
    }
};

const listAlunos = async (req, res) => {
    try {

        /**
         * MATCH (a:Aluno)
         * RETURN a;
         */

        const alunos = await getAllNodesFromModel('Aluno');
        res.status(200).send(alunos);
    } catch (ex) {
        res.status(500).send(ex);
    }
};

module.exports = {
    createAluno,
    listAlunos,
    createAlunosRelationship,
    findByRa,
};
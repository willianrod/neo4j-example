const Neode = require('neode');
const path = require('path');

let neode;

const relations = [
    {
        label: 'Aluno',
        title: 'Amigo de',
        type: 'friend',
        relationship: 'relationship',
        direction: 'out',
        target: 'Aluno',
        name: 'FRIENDS_OF',
        eager: true,
        params: {
            desde: {
                type: 'number',
            },
            createdAt: {
                type: 'datetime',
                default: new Date(),
            },
        },
    },
    {
        label: 'Aluno',
        title: 'Fez trabalho com',
        type: 'worksWith',
        relationship: 'relationship',
        direction: 'out',
        target: 'Aluno',
        name: 'WORKS_WITH',
        eager: true,
        params: {
            desde: {
                type: 'number',
            },
            createdAt: {
                type: 'datetime',
                default: new Date(),
            },
        },
    },
];

const getRelationsFromLabel = (req, res) => {

    const { query } = req;
    const { label } = query;

    const relationsWithLabel = relations.filter(relation => relation.label === label);

    res.status(200).send(relationsWithLabel);
};

const loadRelationships = () => {
    return relations.map(relation => {
        return neode.model(relation.label).relationship(
            relation.type,
            relation.relationship,
            relation.name,
            relation.direction,
            relation.target,
            relation.eager,
            relation.params,
        );
    })
}

/**
 * @returns { Neode }
 */
const createInstance = () => {
    if (neode) return neode;

    neode = new Neode.fromEnv();

    // load models from directory
    console.log('Loading models at ' + path.join(__dirname, '../models') + '...');
    neode.withDirectory(path.join(__dirname, '../models'));

    loadRelationships();

    return neode;
};

/**
 * @param {String} model
 * @returns {Promise} Nodes
 */
const getAllNodesFromModel = model => {
    return neode.all(model)
        .then(res => {
            return res.toJson();
        });
}

neode = createInstance();

module.exports = {
    neode,
    getAllNodesFromModel,
    getRelationsFromLabel,
    createInstance,
}

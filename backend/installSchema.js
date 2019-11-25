const Neode = require('neode');

const instance = new Neode('bolt://100.26.152.26:34277', 'neo4j', 'downgrades-remedy-crafts');

instance.withDirectory(__dirname + '/models');

instance.schema.install()
    .then(() => {
        console.log('Schema installed!');
        process.exit(0);
    });


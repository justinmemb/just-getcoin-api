var configuration = {

    development: {
        app: {

            name: 'Get Coin',
        }, server: {

            url: 'http://localhost:8585/',
            port: 8585,
        }, database: {

            url: 'mongodb://localhost/getcoins'
        }, mail: {

            email: 'testpariharrohit@gmail.com',
            password: 'Test@123',
            service: 'gmail'
        }
    },
    production: {
        app: {

            name: 'Get Coin',
        }, server: {

            url: 'https://getcoins.herokuapp.com/',
            port: 8080,
        }, database: {

            url: 'mongodb://parihar:parihar@getcoins-shard-00-00-ags2s.mongodb.net:27017,getcoins-shard-00-01-ags2s.mongodb.net:27017,getcoins-shard-00-02-ags2s.mongodb.net:27017/test?ssl=true&replicaSet=getcoins-shard-0&authSource=admin'
        }, mail: {

            email: 'testpariharrohit@gmail.com',
            password: 'Test@123',
            service: 'gmail'
        }
    }
};

module.exports = configuration[process.env.NODE_ENV] || configuration.development;

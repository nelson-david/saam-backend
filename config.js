module.exports = {
    development: {
        environment: "development",
        port: process.env.PORT || 3500,
        origin: ["http://localhost:3000", "http://192.168.43.192:3000"],
        dbURL: "mongodb://localhost:27017/saamDB",
        TOKEN_SECRET: 'ffignfbgnbgngn',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    },
    production: {
        environment: "production",
        port: process.env.PORT,
        origin: ["https://saam.netlify.app"],
        dbURL: "mongodb+srv://nelsondavid:akelachi8899@openpov.ndhzs.mongodb.net/saamdb?retryWrites=true&w=majority",
        TOKEN_SECRET: 'ffignfbgnbgngn',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    }
}

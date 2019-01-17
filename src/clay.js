export default class Clay {
    constructor() {
        const configPath = './config/clay';
        this.config = require('./config/clay').default;
    }

    get components() {
        return this.config.components;
    }

    log() {
        console.log('lala');
    }
}

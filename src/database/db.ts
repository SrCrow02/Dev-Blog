import mongoose from 'mongoose';
import { URI } from '../../config.json';

async function startDb() {
    try {
        mongoose.connect(URI);
        console.log('Conectado ao Mongo Atlas com sucesso!');
    } catch (err) {
        console.log('Erro ao se conectar com o DB');
    }

}

export default { startDb };
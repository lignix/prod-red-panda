import {Kafka} from "kafkajs";
import {getLocalBroker} from "../config/config.js";

const isLocalBroker = getLocalBroker()
const redpanda = new Kafka({
    brokers: ['localhost:9092'],
});

const consumer = redpanda.consumer({ groupId: 'test-group' });

export const connectToKafka = async (topic) => {
    try {
        await consumer.connect();
        console.log('Connecté au broker RedPanda');
        
        await consumer.subscribe({ topic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const timestamp = message.timestamp;
                const content = message.value.toString();
                const formattedTime = formatTimestamp(timestamp);

                console.log(`[${formattedTime}] Nouveau message sur le topic "${topic}": ${content}`);
            }
        });
    } catch (error) {
        console.error("Erreur lors de la connexion au broker:", error);
    }
}

export const disconnect = async () => {
    try {
        await consumer.disconnect();
    } catch (error) {
        console.error("Erreur lors de la déconnexion du broker:", error);
    }
}

// Fonction de formatage de la timestamp
function formatTimestamp(timestamp) {
    const date = new Date(Number(timestamp));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} à ${hours}:${minutes}`;
}

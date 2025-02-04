import * as Admin from "./redpanda/admin.js"
import * as Consumer from "./redpanda/consumer.js"

import {getTopic} from "./config/config.js";

const topic = getTopic()

async function start() {
    console.log(`Subscribing to topic: ${topic}`)
    await Admin.createTopic(topic)
    console.log("Connecting...")

    // Connexion au consommateur
    await Consumer.connectToKafka(topic);
}

start()

const { OpenAI } = require("openai")

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generarRespuestaAI(mensajeUsuario, historialAnterior ,promptSistema){
    const messages = [
        { role: "system", content: promptSistema },
        ...historialAnterior,
        { role: "user", content: mensajeUsuario }
    ];

    const completion = await openai.chat.completions.create({
        model: 'gpt-5.1',
        messages: messages
    });

    const respuesta = completion.choices[0].message.content;

    return {
        respuesta,
        nuevoHistorial: [
            ...historialAnterior,
            { role: "user", content: mensajeUsuario },
            { role: "assistant", content: respuesta }
        ]
    }
}

module.exports = { generarRespuestaAI };
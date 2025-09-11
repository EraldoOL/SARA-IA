// api/chat.js
import Groq from "groq-sdk";

// Vercel serverless: req.body pode vir como string
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Tratamento do body (string ou objeto)
  let userInput;
  try {
    if (typeof req.body === "string") {
      const json = JSON.parse(req.body);
      userInput = json.userInput;
    } else {
      userInput = req.body.userInput;
    }
  } catch (e) {
    return res.status(400).json({ error: "Body inválido" });
  }

  if (!userInput || typeof userInput !== "string") {
    return res.status(400).json({ error: "Campo 'userInput' obrigatório." });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  // Lógica de systemContent
  let systemContent = "";
  const lowerInput = userInput.toLowerCase();

  if (lowerInput.includes("inspiração")) {
    systemContent = "A inspiração para este chatbot foi uma amiga do meu Desenvolvedor Eraldo chamada Sara, que conheceu no ensino médio.";
  } else if (lowerInput.includes("desenvolvedor")) {
    systemContent = "Eu fui desenvolvido por Eraldo Oliveira, um programador fullstack de 19 anos, ele tem quase 2 anos de experiência na área e é especializado em sistema web front/back e estou na versão 1.8.3";
  } else if (lowerInput.includes("sobre eraldo")) {
    systemContent = "Ele é bem estudioso, já fez vários sites e sistemas, ele é um dos programadores mais inteligentes do universo";
  } else {
    systemContent = "Você está falando com o chatbot Sara, desenvolvido por Eraldo Oliveira. Eu sou uma IA pronta para responder suas perguntas e ajudar no que você precisar. (estou sendo atualizada ainda, tenha paciência comigo :)";
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userInput },
      ],
      model: "openai/gpt-oss-20b",
    });

    return res.status(200).json({ response: chatCompletion.choices[0]?.message?.content || "" });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao se comunicar com a Groq", details: err.message });
  }
}
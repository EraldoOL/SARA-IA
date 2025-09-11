import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Pegue a mensagem do frontend
  const { userInput } = req.body;

  // Pegue a chave da API das variáveis de ambiente do servidor
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  // Monte a mensagem para o modelo, igual ao que você fazia antes
  const systemContent = "Você está falando com o chatbot Sara, desenvolvido por Eraldo Oliveira.";

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: userInput },
      ],
      model: "llama3-8b-8192",
    });

    return res.status(200).json({ response: chatCompletion.choices[0]?.message?.content || "" });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao se comunicar com a Groq", details: err.message });
  }
}
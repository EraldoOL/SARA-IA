/*import { ArrowUp } from "lucide-react";
import { useState, useRef } from "react";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_APP_GROQ_KEY,
  dangerouslyAllowBrowser: true,
});

export function Home() {
  const [messages, setMessages] = useState([]); // Histórico de mensagens
  const inputRef = useRef();

  async function startQuery(event) {
    event.preventDefault();

    const userInput = inputRef.current.value;
    if (!userInput.trim()) return; // Ignorar mensagens vazias

    // Adicionar a mensagem do usuário ao histórico
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userInput },
    ]);

    const chatCompletion = await getGroqChatCompletion(userInput);

    // Adicionar a resposta do bot ao histórico
    const botMessage = chatCompletion.choices[0]?.message?.content || "Erro na resposta.";
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: botMessage },
    ]);

    inputRef.current.value = ""; // Limpar o campo de entrada
  }

  async function getGroqChatCompletion(userInput) {
    let systemContent = "";

    if (userInput.toLowerCase().includes("inspiração") || userInput.toLowerCase().includes("de onde veio")) {
      systemContent = "A inspiração para este chatbot foi uma amiga do meu Desenvolvedor Eraldo chamada Sara, que conheceu no ensino médio.";
    } else if (userInput.toLowerCase().includes("desenvolvedor")) {
      systemContent = "Eu fui desenvolvido por Eraldo Oliveira, um programador fullstack de 19 anos.";
    } else {
      systemContent = "Você é um chatbot desenvolvido por Eraldo Oliveira. Seu nome é SARA, inspirado em uma amiga de Eraldo. Atualmente estou na versão 1.5.0, mas estou pronta para ajudar!";
    }

    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: `Minha pergunta é: ${userInput}`,
        },
      ],
      model: "llama3-8b-8192",
    });
  }

  return (
    <div className="flex flex-col items-center justify-around h-[100vh] bg-roxo text-white overflow-hidden">
      <div className="w-full max-w-2xl p-4 overflow-y-auto h-[65vh] bg-transparent rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              msg.role === "user" ? "bg-blue-500 text-white text-right inline-block" : "bg-gray-700 text-white text-left inline-block"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="mx-auto w-full flex gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
        <form className="w-full" onSubmit={startQuery}>
          <div className="flex flex-1 flex-col h-full max-w-full relative">
            <div className="group relative flex w-full items-center">
              <div className="backdrop-blur-2xl bg-token-composer-surface flex flex-col gap-1.5 no-transparency:backdrop-blur-none p-1.5 rounded-[26px] transition-colors w-full">
                <textarea
                  name="messageInput"
                  className="w-full p-4 h-14 pl-10 pr-12 outline-none text-white bg-black resize-none rounded-full mb-2 overflow-y-hidden border-2 border-roxoClaro"
                  placeholder="Digite sua mensagem..."
                  ref={inputRef}
                />
                <button
                  className="absolute bg-gray-400 rounded-full right-7  top-1/3 transform -translate-y-[14%] text-gray-900"
                >
                  <ArrowUp size={30} strokeWidth={1.4} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}*/

import { ArrowUp } from "lucide-react";
import { useState, useRef } from "react";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_APP_GROQ_KEY,
  dangerouslyAllowBrowser: true,
});

export function Home() {
  const [generatedCode, setGeneratedCode] = useState();
  const inputRef = useRef();

  async function startQuery(event) {
    event.preventDefault();
    const chatCompletion = await getGroqChatCompletion();
    setGeneratedCode(chatCompletion.choices[0]?.message?.content || "");
  }

  async function getGroqChatCompletion() {
    const userInput = inputRef.current.value;

    // Verifica se a pergunta é simples (menos de 50 caracteres) ou complexa (com palavras-chave)
    const isSimpleQuestion = userInput.length < 50;  // Perguntas com menos de 50 caracteres são simples
    const hasComplexKeywords = /explicar|detalhar|como|porquê|o que/.test(userInput.toLowerCase());  // Detecta palavras-chave

    let systemContent = "";

    // Se for uma pergunta simples, responda de forma curta
    if (isSimpleQuestion || !hasComplexKeywords) {
      systemContent = "Resposta curta e direta: " + userInput; // Resposta simples para perguntas curtas
    } else {
      systemContent = `Aqui está uma explicação detalhada para sua pergunta: ${userInput}`; // Resposta mais longa para perguntas complexas
    }

    // Verifica se a pergunta é sobre a inspiração ou o desenvolvedor
    if (userInput.toLowerCase().includes("inspiração") || userInput.toLowerCase().includes("de onde veio")) {
      systemContent = "A inspiração para este chatbot foi uma amiga do meu Desenvolvedor Eraldo chamada Sara, que conheceu no ensino médio.";
    } else if (userInput.toLowerCase().includes("desenvolvedor")) {
      systemContent = "Eu fui desenvolvido por Eraldo Oliveira, um programador fullstack de 19 anos.";
    } else {
      // Resposta padrão para outras perguntas
      systemContent = "Você está falando com o chatbot Sara, desenvolvido por Eraldo Oliveira. Eu sou uma IA pronta para responder suas perguntas e ajudar no que você precisar.";
    }

    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: `Minha pergunta é: ${userInput}`,
        },
      ],
      model: "llama3-8b-8192", // Você pode ajustar o modelo de acordo
    });
  }

  return (
    <div className="flex flex-col items-center justify-around h-[100vh] bg-roxo text-white overflow-hidden">
      <div className="w-full max-w-2xl p-4 overflow-hidden h-[65vh] bg-transparent rounded-lg ">
        <article>{generatedCode}</article>
      </div>
      <div className="mx-auto w-full flex gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
        <form className="w-full" onSubmit={startQuery}>
          <div className="flex flex-1 flex-col h-full max-w-full relative">
            <div className="group relative flex w-full items-center">
              <div className="backdrop-blur-2xl bg-token-composer-surface flex flex-col gap-1.5 no-transparency:backdrop-blur-none p-1.5 rounded-[26px] transition-colors w-full ">
                <textarea
                  name="messageInput"
                  className="w-full p-4 h-14 pl-10 pr-12 outline-none text-white bg-black resize-none rounded-full mb-2 overflow-y-hidden border-2 border-roxoClaro"
                  placeholder="Digite sua mensagem..."
                  ref={inputRef}
                />
                <button
                  className="absolute bg-gray-400 rounded-full right-7  top-1/3 transform -translate-y-[14%] text-gray-900"
                >
                  <ArrowUp size={30} strokeWidth={1.4} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
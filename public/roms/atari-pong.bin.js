// client.js
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// --- 1. Configuração do Cliente tRPC ---
// A URL deve apontar para o servidor rodando, por exemplo, em http://localhost:3000
const trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', // Ajuste a porta se necessário
      fetch: fetch,
    }),
  ],
});

// --- 2. Função para chamar a API do DeepSeek ---
async function callDeepSeek(messages, systemPrompt) {
  const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
  const API_KEY = process.env.DEEPSEEK_API_KEY;

  if (!API_KEY) {
    throw new Error('❌ Chave DeepSeek não configurada. Defina a variável de ambiente DEEPSEEK_API_KEY.');
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`DeepSeek API error: ${errorData}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// --- 3. Função principal do Agente ---
async function agentLoop(userMessage) {
  console.log(`\n🤔 Processando: "${userMessage}"`);

  // Prompt do sistema que define o papel do agente JARVIS
  const systemPromptJarvis = `Você é JARVIS, um agente autônomo que auxilia o usuário.
  Você pode responder perguntas diretamente ou chamar ferramentas.
  Responda APENAS em JSON, sem markdown, com o seguinte formato:
  {
    "thinking": "sua análise em 1 frase",
    "needs_tools": false, // ou true, se precisar chamar uma ferramenta
    "direct_answer": "resposta direta em português" // se needs_tools for false
  }
  Se precisar chamar uma ferramenta, use o formato:
  {
    "thinking": "análise",
    "needs_tools": true,
    "tools": [{"tool": "nome_da_ferramenta", "params": {}}]
  }
  A única ferramenta disponível é: "list_directory" que recebe {"path": "caminho"}.
  O "path" pode ser vazio para listar a pasta home.`;

  // Histórico falso para este exemplo
  const history = [{ role: 'user', content: userMessage }];

  try {
    // 1. JARVIS pensa e decide se precisa agir
    const planRaw = await callDeepSeek(history, systemPromptJarvis);
    const plan = JSON.parse(planRaw.replace(/```json\n?|```/g, '').trim());

    if (!plan.needs_tools) {
      console.log(`\n💬 JARVIS: ${plan.direct_answer}`);
      return plan.direct_answer;
    }

    // 2. Executa as ferramentas necessárias
    console.log(`\n⚙️ JARVIS: ${plan.thinking}`);
    for (const tool of plan.tools) {
      console.log(`   → Chamando ferramenta: ${tool.tool}...`);
      // Simula a execução de uma ferramenta. No futuro, isso pode chamar seu backend real.
      if (tool.tool === 'list_directory') {
        console.log(`     📂 Listando diretório: ${tool.params.path || 'Home'}`);
      }
    }

    // 3. JARVIS sintetiza uma resposta final
    const finalResponse = await callDeepSeek(
      [
        { role: 'user', content: userMessage },
        { role: 'assistant', content: `Resultados das ferramentas: ${plan.tools.map(t => t.tool).join(', ')}` }
      ],
      'Você é JARVIS. Responda de forma útil em português, resumindo as ações realizadas.'
    );

    console.log(`\n✨ JARVIS: ${finalResponse}`);
    return finalResponse;

  } catch (error) {
    console.error(`\n❌ Erro: ${error.message}`);
    return `Desculpe, encontrei um erro: ${error.message}`;
  }
}

// --- 4. Execução Local para Teste ---
// Comente essa parte quando for integrar com o frontend.
// agentLoop('Liste minha pasta Downloads');
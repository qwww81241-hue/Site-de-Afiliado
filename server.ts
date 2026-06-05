import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Gemini SDK with telemetry header
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares to handle JSON payloads
  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiActive: !!ai });
  });

  // AI Route: Generate product copywriting and details from user raw paste
  app.post("/api/generate-copy", async (req, res) => {
    try {
      const { title, rawText, category } = req.body;

      if (!ai) {
        return res.status(503).json({
          error: "O serviço de Inteligência Artificial não está configurado. Cadastre sua GEMINI_API_KEY no painel de Secrets."
        });
      }

      if (!rawText && !title) {
        return res.status(400).json({ error: "Por favor, insira o título ou detalhes brutos do produto." });
      }

      const prompt = `
        Você é um Assistente de Marketing de Afiliados experiente em língua portuguesa do Brasil.
        Sua tarefa é analisar as informações brutas, o título ou o link do produto fornecido e gerar dados de venda de alta conversão.
        
        CRÍTICO PARA LINKS/URLs:
        Se o "Texto bruto/especificações" (${rawText}) contiver um link/URL (como links da Amazon, Mercado Livre, Shopee, AliExpress, Magalu, Casas Bahia, etc), você DEVE usar a ferramenta Google Search para pesquisar este link específico e o produto principal contido nele. 
        Identifique com total precisão o PRODUTO PRINCIPAL do link enviado (por exemplo, se o link for de um Smartphone Samsung Galaxy S24, garanta que os detalhes sejam exatamente de um Smartphone Samsung Galaxy S24, e não de fones de ouvido recomendados na barra lateral ou capinhas). Obtenha o nome real do produto principal, a marca, as especificações técnicas cruciais, o preço aproximado de venda e a loja parceira de origem confiável.

        Dado Fornecido:
        - Título inserido pelo usuário: ${title || "Não fornecido"}
        - Texto bruto/especificações copiadas de outra loja ou Link: ${rawText || "Não fornecido"}
        - Categoria selecionada: ${category || "Não fornecida"}
        
        Por favor, retorne uma resposta em JSON contendo:
        1. "title": Um título de produto atraente, limpo e profissional para o site de afiliados (sem poluição visual excessiva, ideal para o público brasileiro). Ex: "Fritadeira Elétrica Mondial AF-31" em vez de links crus ou códigos internos.
        2. "description": Uma descrição persuasiva estruturada para conversão. Destaque 3 principais pontos fortes/recursos do produto usando emojis apropriados. Adicione uma frase chamativa convocando para o clique de compra no link de afiliado.
        3. "estimatedPrice": Um preço sugerido em reais (R$) extraído do link/texto ou gerado com base no mercado real (exemplo: "R$ 149,90" ou "Sob Consulta").
        4. "suggestedCategory": Identifique qual destas categorias se encaixa melhor: "Eletrônicos", "Casa e Cozinha", "Eletroportáteis", "Moda e Estilo", "Livros e Papelaria", ou "Outros".
        5. "suggestedShop": O provável nome da grande loja de onde veio o produto, se puder identificar (por exemplo: "Amazon", "Shopee", "AliExpress", "Shein", "Mercado Livre", "Magalu" ou "Parceiro Oficial").
      `;

      let response;
      try {
        console.log("Tentando gerar cópia com a ferramenta Google Search...");
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Título limpo, direto e chamativo."
                },
                description: {
                  type: Type.STRING,
                  description: "Descrição persuasiva com 3 benefícios em tópicos e um CTA forte no final."
                },
                estimatedPrice: {
                  type: Type.STRING,
                  description: "Preço estimado ou extraído formatado em reais brasileiros. Ex: R$ 89,90."
                },
                suggestedCategory: {
                  type: Type.STRING,
                  description: "Categoria estrita recomendada. Opções: Eletrônicos, Casa e Cozinha, Eletroportáteis, Moda e Estilo, Livros e Papelaria, Outros."
                },
                suggestedShop: {
                  type: Type.STRING,
                  description: "Nome da loja de origem do afiliado. Ex: Amazon, Shopee, AliExpress, Outros."
                }
              },
              required: ["title", "description", "estimatedPrice", "suggestedCategory", "suggestedShop"]
            }
          }
        });
      } catch (searchError: any) {
        console.warn("A busca do Google falhou ou atingiu limite de cota (429). Tentando geração padrão sem ferramentas...", searchError.message || searchError);
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt + "\n\nNOTA DE FALLBACK: A ferramenta de busca online falhou ou está temporariamente sem saldo/cota (429). Por tanto, infira o máximo de informações precisas do nome, marca ou dados técnicos olhando apenas o texto cru ou o formato estrutural do próprio link fornecido.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Título limpo, direto e chamativo."
                },
                description: {
                  type: Type.STRING,
                  description: "Descrição persuasiva com 3 benefícios em tópicos e um CTA forte no final."
                },
                estimatedPrice: {
                  type: Type.STRING,
                  description: "Preço estimado ou extraído formatado em reais brasileiros. Ex: R$ 89,90."
                },
                suggestedCategory: {
                  type: Type.STRING,
                  description: "Categoria estrita recomendada. Opções: Eletrônicos, Casa e Cozinha, Eletroportáteis, Moda e Estilo, Livros e Papelaria, Outros."
                },
                suggestedShop: {
                  type: Type.STRING,
                  description: "Nome da loja de origem do afiliado. Ex: Amazon, Shopee, AliExpress, Outros."
                }
              },
              required: ["title", "description", "estimatedPrice", "suggestedCategory", "suggestedShop"]
            }
          }
        });
      }

      const responseText = response.text || "{}";
      const productDetails = JSON.parse(responseText.trim());
      
      res.json({ success: true, data: productDetails });
    } catch (error: any) {
      console.error("Erro ao gerar cópia via Gemini:", error);
      res.status(500).json({ error: error.message || "Erro desconhecido ao processar o conteúdo com IA." });
    }
  });

  // Vite middleware or express.static
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

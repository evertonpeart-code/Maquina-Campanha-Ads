import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/gerar", async (req, res) => {
  const { produto, publico, pais, idioma, urlProduto, urlAfiliado } = req.body;

  try {
    const prompt = `Crie uma campanha de Google Ads com alta conversão para o seguinte produto:
    Produto: ${produto}
    Público: ${publico}
    País: ${pais}
    Idioma: ${idioma}
    URL do Produto: ${urlProduto}
    URL do Afiliado: ${urlAfiliado}
    A campanha deve conter título A/B, descrições persuasivas, sitelinks, callouts, snippets, palavras-chave, negativas, e estrutura de campanha CSV no formato do Google Ads Editor.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const resposta = completion.choices[0].message.content;
    res.json({ sucesso: true, resultado: resposta });
  } catch (erro) {
    console.error("Erro com a IA:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro ao gerar campanha com a IA." });
  }
});

app.get("/testa-chave", (req, res) => {
  if (process.env.OPENAI_API_KEY) {
    res.send("✅ Chave carregada com sucesso.");
  } else {
    res.send("❌ Chave NÃO carregada.");
  }
});

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
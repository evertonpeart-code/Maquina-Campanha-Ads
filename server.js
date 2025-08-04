const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/gerar", async (req, res) => {
  try {
    const { produto, publico, pais, idioma, urlProduto, urlAfiliado } = req.body;

    if (!produto || !publico || !pais || !idioma || !urlProduto || !urlAfiliado) {
      return res.status(400).json({ sucesso: false, erro: "Todos os campos são obrigatórios." });
    }

    const prompt = `Gere uma campanha de Google Ads Editor em formato CSV para o produto "${produto}". 
Público-alvo: ${publico}. 
País: ${pais}. 
Idioma: ${idioma}. 
Link do produto: ${urlProduto}. 
Link do afiliado: ${urlAfiliado}. 
A campanha deve ter:
- Estrutura compatível com Google Ads Editor
- Anúncios responsivos (RSA)
- Títulos A/B com SEO e copywriting
- Descrições persuasivas
- Sitelinks, Callouts e Snippets
- Palavras-chave e negativas
- Foco em alta conversão
- Colunas separadas por vírgula

Responda apenas com o CSV, sem explicações.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });

    const csvContent = completion.choices[0].message.content;
    return res.status(200).json({ sucesso: true, csv: csvContent });
  } catch (error) {
    console.error("Erro interno:", error);
    return res.status(500).json({ sucesso: false, erro: "Erro ao gerar campanha com a IA." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
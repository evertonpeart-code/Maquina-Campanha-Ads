
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json());

app.post('/gerar', async (req, res) => {
  const { produto, publico, pais, idioma, urlProdutor, urlAfiliado } = req.body;

  try {
    const prompt = `
Você é um especialista em Google Ads. Crie uma campanha para o produto abaixo seguindo este padrão:

Produto: ${produto}
Público-alvo: ${publico}
País: ${pais}
Idioma: ${idioma}
Link do produtor: ${urlProdutor}
Link de afiliado (final): ${urlAfiliado}

Gere:
- 15 headlines criativas (máx. 30 caracteres)
- 4 descrições com até 90 caracteres
- Palavras-chave com intenção de compra (exatas e de frase)
- 5 palavras-chave negativas
- Sitelinks (texto e URL)
- Callouts curtos
- Snippets estruturados (header + valores)

Responda no formato JSON estruturado.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const resposta = completion.choices[0].message.content;
    res.json({ sucesso: true, campanha: resposta });
  } catch (error) {
    console.error('❌ ERRO:', error);
    res.status(500).json({ sucesso: false, erro: 'Erro ao gerar campanha com a IA.' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Backend da Máquina de Campanha IA está rodando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

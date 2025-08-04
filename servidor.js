import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
  }

  const { produto, publico, pais, idioma, urlProduto, urlAfiliado } = req.body;

  if (!produto || !publico || !pais || !idioma || !urlProduto || !urlAfiliado) {
    return res.status(400).json({
      sucesso: false,
      erro: 'Todos os campos são obrigatórios: produto, publico, pais, idioma, urlProduto, urlAfiliado.'
    });
  }

  const prompt = `
Você é um redator especialista em Google Ads e deve criar uma campanha otimizada para o seguinte produto:

Produto: ${produto}
Público-alvo: ${publico}
País: ${pais}
Idioma: ${idioma}
URL do produto: ${urlProduto}
URL do afiliado: ${urlAfiliado}

Crie:
- 2 títulos principais de até 30 caracteres cada
- 2 descrições de até 90 caracteres
- 4 sitelinks com título e descrição
- 4 callouts (extensões de destaque)
- 4 snippets estruturados com "Tipos"
- Sugestões de palavras-chave
- Palavras-chave negativas (mínimo 5)

Formato da resposta:
{
  "titulos": ["...", "..."],
  "descricoes": ["...", "..."],
  "sitelinks": [
    { "titulo": "...", "descricao": "..." },
    ...
  ],
  "callouts": ["...", "...", "...", "..."],
  "snippets": ["...", "...", "...", "..."],
  "palavrasChave": ["...", "...", "..."],
  "negativas": ["...", "...", "..."]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const respostaIA = completion.choices[0].message.content;

    return res.status(200).json({
      sucesso: true,
      resposta: respostaIA
    });

  } catch (erro) {
    console.error('Erro ao chamar OpenAI:', erro);

    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar campanha com a IA.',
      detalhe: erro?.message || 'Erro desconhecido'
    });
  }
}
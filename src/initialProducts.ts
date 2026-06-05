import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-kindle-11',
    title: 'Novo Kindle 11ª Geração - Tela de 6\" com 300 ppi',
    description: 'Leitura confortável dia e noite com tela livre de reflexo. Armazene milhares de livros e aproveite uma bateria de longa duração para focar somente nas suas histórias favoritas. 📖✨ Perfeito para leitores assíduos.',
    price: 'R$ 499,00',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    imageGallery: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&q=80&w=600'
    ],
    affiliateUrl: 'https://amzn.to/exampleKindle',
    category: 'Eletrônicos',
    rating: 4.8,
    sourceShop: 'Amazon',
    createdAt: new Date('2026-05-10').toISOString(),
    embedCode: `<iframe width="100%" height="300" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Kindle Review" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
    useEmbed: false
  },
  {
    id: 'prod-echo-dot-5',
    title: 'Echo Dot 5ª Geração com Relógio e Alexa integrada',
    description: 'O melhor som do Echo Dot até agora. Curta vocais mais nítidos e graves mais potentes. Ideal para controlar sua casa inteligente por voz, ver a hora, alarmes e mais. 🎶🏠',
    price: 'R$ 419,00',
    imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=600',
    imageGallery: [
      'https://images.unsplash.com/photo-1518443855757-dfadac7101ae?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600'
    ],
    affiliateUrl: 'https://amzn.to/exampleEcho',
    category: 'Eletrônicos',
    rating: 4.9,
    sourceShop: 'Amazon',
    createdAt: new Date('2026-05-12').toISOString(),
    embedCode: `<div class="bg-amber-50 p-6 rounded-lg text-center border-2 border-amber-300">
  <p class="font-bold text-amber-900">🎁 Banner Promocional Associados Amazon</p>
  <p class="text-sm text-amber-700 mt-2">Isto é uma simulação de um widget de afiliados dinâmico inserido como código HTML / Iframe direto no seu portal.</p>
</div>`,
    useEmbed: true
  },
  {
    id: 'prod-airfryer-mondial',
    title: 'Fritadeira Elétrica Sem Óleo Mondial Family 4L',
    description: 'Prepare suas receitas favoritas de forma saudável, rápida e crocante. Painel digital, controle de temperatura até 200°C e timer de 60 minutos para preparar frango, batatas, pães de queijo e doces. 🍟🍗',
    price: 'R$ 349,90',
    imageUrl: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=600',
    affiliateUrl: 'https://shopee.com.br/exampleAirfryer',
    category: 'Eletroportáteis',
    rating: 4.7,
    sourceShop: 'Shopee',
    createdAt: new Date('2026-05-15').toISOString(),
    useEmbed: false
  },
  {
    id: 'prod-mochila-tech',
    title: 'Mochila Premium Antifurto Impermeável com Porta USB',
    description: 'Desenvolvida para profissionais e estudantes modernos. Amplo espaço para notebooks de até 15.6\", bolsos ocultos de segurança e material ultra resistente à água. 🎒💻 Conexão fácil para powerbank externo.',
    price: 'R$ 159,90',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600',
    affiliateUrl: 'https://shopee.com.br/exampleMochila',
    category: 'Moda e Estilo',
    rating: 4.5,
    sourceShop: 'AliExpress',
    createdAt: new Date('2026-05-18').toISOString(),
    useEmbed: false
  },
  {
    id: 'prod-moka-bialetti',
    title: 'Cafeteira Italiana Moka Express Original Bialetti 6 Xícaras',
    description: 'Sabor clássico e encorpado ao estilo italiano tradicional. Fabricada em alumínio de alta qualidade com cabo ergonômico. Um ícone do café mundial direto no fogão da sua casa. ☕🇮🇹',
    price: 'R$ 289,00',
    imageUrl: 'https://images.unsplash.com/photo-1579888944880-d98341148722?auto=format&fit=crop&q=80&w=600',
    affiliateUrl: 'https://amzn.to/exampleMoka',
    category: 'Casa e Cozinha',
    rating: 4.8,
    sourceShop: 'Amazon',
    createdAt: new Date('2026-05-20').toISOString(),
    useEmbed: false
  },
  {
    id: 'prod-habito-livro',
    title: 'O Poder do Hábito - Charles Duhigg',
    description: 'Entenda como os hábitos funcionam e como transformá-los para alcançar o sucesso pessoal e profissional. Um dos livros de negócios e desenvolvimento pessoal mais vendidos da década! 🧠📈',
    price: 'R$ 49,90',
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    affiliateUrl: 'https://amzn.to/exampleHabito',
    category: 'Livros e Papelaria',
    rating: 4.9,
    sourceShop: 'Amazon',
    createdAt: new Date('2026-05-22').toISOString(),
    useEmbed: false
  }
];

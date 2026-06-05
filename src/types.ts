export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  imageGallery?: string[]; // Adicionando galeria de imagens
  affiliateUrl: string;
  category: string;
  rating: number;
  sourceShop: string;
  embedCode?: string; // HTML iframe or URL for embedding
  useEmbed?: boolean; // Whether to display the embedded view by default
  createdAt: string;
}

export type Category = 'Todos' | 'Eletrônicos' | 'Casa e Cozinha' | 'Eletroportáteis' | 'Moda e Estilo' | 'Livros e Papelaria' | 'Outros';

export interface AffiliateConfig {
  siteName: string;
  facebookUrl?: string;
  instagramUrl?: string;
  contactEmail?: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

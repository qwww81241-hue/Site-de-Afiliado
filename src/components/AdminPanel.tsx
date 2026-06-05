import React, { useState, useEffect } from 'react';
import { Product, Category, AffiliateConfig } from '../types';
import { Plus, Sparkles, Download, Upload, Save, Trash2, Edit2, Info, CheckCircle2, AlertTriangle, RefreshCw, Copy, Check, ExternalLink, Layers } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onImportProducts: (products: Product[]) => void;
  config: AffiliateConfig;
  onUpdateConfig: (config: AffiliateConfig) => void;
  onClose: () => void;
}

export default function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onImportProducts,
  config,
  onUpdateConfig,
  onClose
}: AdminPanelProps) {
  // Config States
  const [siteName, setSiteName] = useState(config.siteName);
  const [bannerTitle, setBannerTitle] = useState(config.bannerTitle);
  const [bannerSubtitle, setBannerSubtitle] = useState(config.bannerSubtitle);
  const [facebookUrl, setFacebookUrl] = useState(config.facebookUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(config.instagramUrl || '');
  const [contactEmail, setContactEmail] = useState(config.contactEmail || '');

  // Form states for creating/editing product
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [category, setCategory] = useState<Category>('Eletrônicos');
  const [rating, setRating] = useState('4.8');
  const [sourceShop, setSourceShop] = useState('Amazon');
  const [embedCode, setEmbedCode] = useState('');
  const [useEmbed, setUseEmbed] = useState(false);
  const [imageGallery, setImageGallery] = useState<string[]>([]);

  // Gemini Assist States
  const [rawPaste, setRawPaste] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [isGeminiActive, setIsGeminiActive] = useState<boolean | null>(null);

  // Wix & Blogger Export States
  const [wixCopied, setWixCopied] = useState(false);
  const [bloggerCopied, setBloggerCopied] = useState(false);
  const [activeExportTab, setActiveExportTab] = useState<'wix' | 'blogger'>('wix');

  // Alert Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Check if backend has Gemini initialized
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setIsGeminiActive(data.geminiActive))
      .catch(() => setIsGeminiActive(false));
  }, []);
  // Wix Dynamic Code Generator Formatter
  const generateWixEmbedCode = () => {
    const jsonProducts = JSON.stringify(products.map(p => ({
      title: p.title,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      imageGallery: p.imageGallery || [],
      affiliateUrl: p.affiliateUrl,
      category: p.category,
      rating: p.rating,
      sourceShop: p.sourceShop,
      embedCode: p.embedCode || ''
    })), null, 2);

    return `<!-- VITRINE DE PRODUTOS DE AFILIADOS GERADA AUTOMATICAMENTE -->
<!-- Cole este código inteiro no widget "Incorpore HTML" do seu site Wix -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteName || 'Minha Vitrine'}</title>
  <script>
    // Fix for environments where window.fetch is read-only (causing TypeError on overrides)
    try {
      if (window.fetch) {
        const _origFetch = window.fetch.bind(window);
        Object.defineProperty(window, 'fetch', {
          value: _origFetch,
          writable: true,
          configurable: true
        });
      }
    } catch (e) {
      console.warn("Could not redefine window.fetch", e);
    }
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;850&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; margin: 0; padding: 16px; overflow-x: hidden; }
    .font-display { font-family: 'Outfit', 'Inter', sans-serif; }
    .product-card { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1); }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
    .animate-scaleUp { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  </style>
</head>
<body class="bg-slate-50 text-slate-950">

  <div class="max-w-7xl mx-auto space-y-6">
    
    <!-- Search bar & categories panel -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 space-y-4 shadow-sm/30">
      <div class="relative">
        <input 
          type="text" 
          id="wix-search" 
          placeholder="Busque por produtos, marcas, promoções..." 
          class="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none transition"
        >
      </div>

      <!-- Wix Zoom Selector & Counter (Below Search Bar) -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div class="flex items-center gap-2 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl flex-1 max-w-xs sm:max-w-md">
          <span class="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Zoom:</span>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value="2"
            id="wix-zoom-slider"
            oninput="changeWixZoom(this.value)"
            class="w-24 sm:w-36 accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none flex-1"
          >
          <span id="wix-zoom-label" class="text-[10px] sm:text-xs font-bold text-slate-600 font-mono">Lvl.2</span>
        </div>
        
        <div class="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center justify-center gap-2 shrink-0">
          <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span id="wix-offers-count" class="text-xs font-bold text-slate-705 font-mono">
            0 Items
          </span>
        </div>
      </div>

      <!-- Desktop Filters Container -->
      <div class="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">Filtrar:</span>
        <div class="flex gap-1.5" id="categories-container"></div>
      </div>

      <!-- Mobile Sided Dropdown Filter: Collapses categories left styled labelled: "Categorias" -->
      <div class="flex sm:hidden items-center justify-between pt-1.5 border-t border-slate-100">
        <div class="relative inline-block text-left">
          <button 
            type="button"
            id="mobile-category-dropdown-btn"
            onclick="toggleMobileCategoryMenu(event)"
            class="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
          >
            <span>Categorias</span>
            <span class="text-[10px] text-amber-500 font-bold" id="current-mobile-cat-label">▾</span>
          </button>
          
          <div 
            id="mobile-category-dropdown-content" 
            class="hidden absolute left-0 mt-1.5 bg-white border border-slate-200 rounded-xl p-2 shadow-xl z-50 flex flex-col gap-1 min-w-[180px]"
          >
            <!-- Populated dynamically via renderCategories() -->
          </div>
        </div>

        <span class="text-[10px] font-bold text-slate-400 font-mono" id="mobile-products-count-label"></span>
      </div>
    </div>

    <!-- Product Grid Showcase -->
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6" id="products-grid"></div>

    <!-- Empty Search State -->
    <div id="empty-state" class="hidden bg-white border border-slate-100 rounded-3xl p-10 text-center max-w-md mx-auto">
      <h3 class="text-slate-900 font-display font-bold text-base mb-1">Nenhum produto encontrado</h3>
      <p class="text-xs text-slate-500 mb-4">Tente usar outros termos ou clique abaixo para redefinir.</p>
      <button onclick="clearFilters()" class="px-4 py-2 bg-slate-900 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition">
        Mostrar Tudo
      </button>
    </div>

    <!-- Expanded Product Details & Widget Modal -->
    <div id="wix-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-slate-100 flex flex-col md:flex-row relative animate-scaleUp max-h-[95vh] md:max-h-[90vh]">
        
        <!-- Close Button -->
        <button
          onclick="closeWixModal()"
          class="absolute top-4 right-4 p-2 bg-slate-100/85 hover:bg-slate-200 text-slate-705 hover:text-slate-900 rounded-full transition z-50 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <!-- Left Column: Image Media & Verification -->
        <div class="w-full md:w-1/2 bg-slate-50 border-r border-slate-100 flex flex-col justify-between p-6 overflow-y-auto">
          <div class="my-auto flex flex-col items-center w-full">
            <!-- Aspect Ratio Box - optimized for mobile sizing -->
            <div class="w-full aspect-square max-w-[420px] md:max-w-[320px] rounded-2xl overflow-hidden shadow-sm relative border border-slate-100 bg-white flex items-center justify-center">
              <img
                id="modal-main-img"
                src=""
                alt="Produto"
                class="w-full h-full object-cover rounded-2xl"
                onerror="this.src='https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'"
              >
            </div>

            <!-- Thumbnail Row container -->
            <div id="modal-thumbs-container" class="flex gap-2 mt-4 overflow-x-auto max-w-[420px] md:max-w-[320px] p-1 justify-center no-scrollbar"></div>
          </div>

          <!-- Trust Validation Info -->
          <div class="mt-6 p-4 rounded-xl bg-emerald-58/50 border border-emerald-100 flex items-center gap-3">
            <div class="p-2 bg-emerald-500 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <p class="text-xs font-bold text-emerald-800">Redirecionamento Seguro</p>
              <p class="text-[10px] text-emerald-600">Este link de afiliado oficial leva com total segurança para a plataforma oficial comprar.</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Details & Tabs & CTA -->
        <div class="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            <!-- Category and shop tags -->
            <div class="flex gap-2 items-center mb-4 mt-2">
              <span id="modal-category-badge" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded text-slate-500"></span>
              <span id="modal-shop-badge" class=""></span>
            </div>

            <!-- Title -->
            <h2 id="modal-title" class="text-slate-900 font-display font-bold text-base md:text-2xl leading-tight mb-1.5 md:mb-2"></h2>

            <!-- Price with CTA right next to it: stacks dynamically on mobile -->
            <div class="my-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div class="flex flex-col">
                <span class="text-slate-400 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider block">Preço do site</span>
                <span id="modal-price" class="text-amber-600 font-display font-extrabold text-lg sm:text-2xl md:text-3xl leading-tight"></span>
              </div>
              <a
                id="modal-affiliate-link"
                href=""
                target="_blank"
                referrerpolicy="no-referrer"
                class="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-4.5 sm:py-3 bg-amber-500 hover:bg-slate-900 border border-amber-500 hover:border-slate-950 text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase rounded-xl shadow-md transition-all text-center animate-fadeIn"
              >
                Ir para a Loja
              </a>
            </div>

            <!-- Navigation tabs buttons -->
            <div class="flex border-b border-slate-100 mb-6 gap-4">
              <button
                id="modal-tab-info"
                onclick="setModalTab('info')"
                class="pb-2.5 text-xs font-bold tracking-wide uppercase transition-all relative border-b-2 border-amber-600 text-amber-600 cursor-pointer"
              >
                Informações
              </button>
              <button
                id="modal-tab-embed"
                onclick="setModalTab('embed')"
                class="pb-2.5 text-xs font-bold tracking-wide uppercase transition-all relative hidden flex items-center gap-1.5 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="22" y2="7"/><line x1="2" y1="17" x2="22" y2="17"/></svg>
                Widget Incorporado
                <span id="modal-tab-embed-badge" class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping hidden"></span>
              </button>
            </div>

            <!-- Tabs Content -->
            <div id="modal-tab-content"></div>
          </div>

          <!-- Bottom Actions inside Modal -->
          <div class="mt-8 border-t border-slate-100 pt-6 space-y-3">
            <div class="flex gap-2">
              <a
                id="modal-whatsapp-share"
                href=""
                target="_blank"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Compartilhar Oferta
              </a>
            </div>
            <p class="text-center text-[10px] text-slate-400 mt-2">
              🛡️ Compra segura garantida! Você será redirecionado com segurança ao e-commerce oficial de origem.
            </p>
          </div>

        </div>

      </div>
    </div>

    <!-- Rodapé com acesso ao Painel de Controle -->
    <footer class="flex flex-col sm:flex-row items-center justify-between py-6 border-t border-slate-200/60 text-slate-400 text-xs gap-4 mt-8">
      <p>&copy; ${siteName || 'Minha Vitrine'} - Todos os direitos reservados.</p>
      <button onclick="openAdminLogin()" class="flex items-center gap-1.5 hover:text-amber-500 text-slate-550 font-bold tracking-wide uppercase px-3.5 py-2 bg-white border border-slate-200 rounded-xl shadow-sm transition cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Painel de Controle
      </button>
    </footer>

    <!-- Modal de Login do Administrador -->
    <div id="admin-login-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-scaleUp relative">
        <button onclick="closeAdminLogin()" class="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-full transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        
        <div class="text-center space-y-2 mb-6">
          <div class="inline-flex p-3 bg-amber-100 text-amber-600 rounded-full mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3 class="font-display font-bold text-lg text-slate-900">Acesso Restrito</h3>
          <p class="text-xs text-slate-500">Insira suas credenciais para gerenciar a vitrine no Wix</p>
        </div>

        <form onsubmit="handleAdminLogin(event)" class="space-y-4">
          <div>
            <label class="block text-slate-605 text-[11px] font-bold uppercase tracking-wider mb-1.5">Usuário</label>
            <input 
              type="text" 
              id="admin-user" 
              required
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none"
              placeholder="Digite o usuário"
            >
          </div>
          <div>
            <label class="block text-slate-605 text-[11px] font-bold uppercase tracking-wider mb-1.5">Senha</label>
            <input 
              type="password" 
              id="admin-pass" 
              required
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none"
              placeholder="Digite a senha"
            >
          </div>
          <div id="login-error" class="hidden text-xs text-red-500 font-semibold text-center mt-2">Usuário ou senha incorretos!</div>
          <button type="submit" class="w-full py-3 bg-slate-900 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition cursor-pointer">
            Entrar
          </button>
        </form>
      </div>
    </div>

    <!-- Modal do Painel de Controle (Dashboard) -->
    <div id="admin-dashboard-modal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-slate-100 relative/90 animate-scaleUp max-h-[92vh] flex flex-col">
        
        <!-- Cabeçalho -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div class="flex items-center gap-2">
            <span class="p-1.5 bg-amber-500 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <div class="text-left">
              <h3 class="font-display font-bold text-sm text-slate-900 leading-none">Painel do Administrador</h3>
              <p class="text-[10px] text-slate-400 mt-1">Gerenciar produtos cadastrados na Vitrine Wix</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="handleAdminLogout()" class="text-[10px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer">Sair</button>
            <button onclick="closeAdminDashboard()" class="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
        </div>

        <!-- Abas do Dashboard -->
        <div class="flex border-b border-slate-100 px-6 bg-slate-50/50 shrink-0">
          <button id="db-tab-list" onclick="setDashboardTab('list')" class="px-4 py-3 text-xs font-bold tracking-wide uppercase border-b-2 border-amber-500 text-amber-500 cursor-pointer">
            Produtos Cadastrados
          </button>
          <button id="db-tab-add" onclick="setDashboardTab('add')" class="px-4 py-3 text-xs font-bold tracking-wide uppercase text-slate-400 hover:text-slate-600 cursor-pointer">
            + Adicionar Novo
          </button>
        </div>

        <!-- Conteúdo do Dashboard -->
        <div class="p-6 overflow-y-auto max-h-[60vh] flex-1">
          <!-- ABA DE LISTA -->
          <div id="db-content-list" class="space-y-3">
            <div class="flex justify-between items-center text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider text-left">
              <span>Lista de Itens (<span id="db-item-count">0</span>)</span>
            </div>
            <div id="db-items-container" class="space-y-2 max-h-[45vh] overflow-y-auto pr-1"></div>
          </div>

          <!-- ABA DE ADIÇÃO -->
          <div id="db-content-add" class="hidden">
            <form id="add-product-form" onsubmit="handleAddNewProduct(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div class="space-y-1">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Título do Produto *</label>
                <input type="text" id="add-title" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none" placeholder="Ex: Smart TV LG 50 polegadas">
              </div>
              
              <div class="space-y-1">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Preço Promocional *</label>
                <input type="text" id="add-price" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none" placeholder="Ex: R$ 1.899,00">
              </div>

              <div class="space-y-1">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Link de Afiliado Seguro *</label>
                <input type="url" id="add-affiliateUrl" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none" placeholder="Ex: https://amazon.com.br/dp/...">
              </div>

              <div class="space-y-1">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Loja de Origem *</label>
                <select id="add-sourceShop" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none">
                  <option value="Amazon">Amazon</option>
                  <option value="Shopee">Shopee</option>
                  <option value="AliExpress">AliExpress</option>
                  <option value="Mercado Livre">Mercado Livre</option>
                  <option value="Magalu">Magalu</option>
                  <option value="Outra">Outra Loja</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">URL da Imagem Principal *</label>
                <input type="url" id="add-imageUrl" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none" placeholder="https://exemplo.com/imagem.png">
              </div>

              <div class="space-y-1">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Categoria *</label>
                <input type="text" id="add-category" list="default-categories" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none" placeholder="Selecione ou digite nova...">
                <datalist id="default-categories">
                  <option value="Eletrônicos"></option>
                  <option value="Eletrodomésticos"></option>
                  <option value="Casa & Cozinha"></option>
                  <option value="Beleza & Cuidado"></option>
                  <option value="Moda & Acessórios"></option>
                  <option value="Smartphones"></option>
                </datalist>
              </div>

              <div class="space-y-1 sm:col-span-2">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Outras Imagens da Galeria (opcional, separadas por vírgula)</label>
                <input type="text" id="add-imageGallery" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none" placeholder="https://exemplo.com/img1.png, https://exemplo.com/img2.png">
              </div>

              <div class="space-y-1">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Avaliação Recomendada (Rating)</label>
                <select id="add-rating" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none">
                  <option value="5">5.0 Estrelas</option>
                  <option value="4.8">4.8 Estrelas</option>
                  <option value="4.5">4.5 Estrelas</option>
                  <option value="4.0">4.0 Estrelas</option>
                </select>
              </div>

              <div class="space-y-1 sm:col-span-2">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Descrição Detalhada do Produto *</label>
                <textarea id="add-description" required rows="3" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none resize-none" placeholder="Descreva os pontos fortes, cupons ou diferenciais do produto..."></textarea>
              </div>

              <div class="space-y-1 sm:col-span-2">
                <label class="block text-slate-600 text-[10px] font-bold uppercase tracking-wider">Código de Incorporação de Widget (opcional)</label>
                <textarea id="add-embedCode" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs text-slate-800 rounded-xl outline-none resize-none" placeholder="Cole iframe, widget, ou HTML extra para exibir nos detalhes..."></textarea>
              </div>

              <div class="sm:col-span-2 pt-2 flex justify-end gap-3">
                <button type="button" onclick="setDashboardTab('list')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs rounded-xl transition cursor-pointer">Cancelar</button>
                <button type="submit" class="px-5 py-2.5 bg-amber-500 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer">Adicionar Produto</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>

  <script>
    const baseItems = ${jsonProducts};
    let items = [];
    try {
      const searchParams = new URL(window.location.href).searchParams;
      const rawData = searchParams.get('c');
      if (rawData) {
        const binaryStr = atob(rawData);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const jsonStr = new TextDecoder().decode(bytes);
        const parsed = JSON.parse(jsonStr);
        if (parsed && Array.isArray(parsed.p)) {
          items = parsed.p;
        }
      }
    } catch (e) {
      console.error("Erro ao carregar dados da URL:", e);
    }
    if (!items || items.length === 0) {
      items = baseItems;
    }

    let activeCategory = "Todos";
    let activeQuery = "";
    let currentModalProduct = null;
    let modalActiveTab = "info";
    let modalActiveImgIdx = 0;

    let currentZoom = 2;
    window.changeWixZoom = function(level) {
      currentZoom = Number(level);
      const label = document.getElementById("wix-zoom-label");
      if (label) {
        label.innerText = "Lvl." + currentZoom;
      }
      const slider = document.getElementById("wix-zoom-slider");
      if (slider && slider.value !== String(currentZoom)) {
        slider.value = currentZoom;
      }
      
      const grid = document.getElementById("products-grid");
      if (grid) {
        grid.className = "";
        if (currentZoom === 1) {
          grid.className = "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5";
        } else if (currentZoom === 3) {
          grid.className = "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6";
        } else if (currentZoom === 4) {
          grid.className = "grid grid-cols-1 max-w-xl mx-auto gap-6";
        } else {
          grid.className = "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6";
        }
      }
    };

    let categories = ["Todos", ...new Set(items.map(item => item.category))];

    function getStoreStyle(shop) {
      if (!shop) return "bg-slate-100 text-slate-700";
      const name = shop.toLowerCase();
      if (name.includes("amazon")) return "bg-amber-100 text-amber-950 font-bold border border-amber-300";
      if (name.includes("shopee")) return "bg-orange-100 text-orange-950 font-bold border border-orange-300";
      if (name.includes("ali")) return "bg-red-100 text-red-950 font-bold border border-red-300";
      return "bg-slate-100 text-slate-800 border border-slate-200";
    }

    function getStars(rating) {
      const full = Math.floor(rating);
      let stars = "";
      for (let i = 0; i < 5; i++) {
        stars += i < full ? "★" : "☆";
      }
      return '<span class="text-amber-500 font-bold tracking-tight">' + stars + '</span> <span class="text-[10px] text-slate-400 font-mono ml-1 font-medium">' + Number(rating).toFixed(1) + '</span>';
    }

    window.changeWixImg = function(prodIdx, imgUrl, imgIdx, total) {
      const mainImg = document.getElementById("wix-img-" + prodIdx);
      if (mainImg) {
        mainImg.src = imgUrl;
      }
      for (let i = 0; i < total; i++) {
        const thumb = document.getElementById("thumb-" + prodIdx + "-" + i);
        if (thumb) {
          if (i === imgIdx) {
            thumb.classList.add("border-amber-500", "scale-105");
            thumb.classList.remove("border-slate-200");
          } else {
            thumb.classList.remove("border-amber-500", "scale-105");
            thumb.classList.add("border-slate-200");
          }
        }
      }
    };

    window.toggleWixDesc = function(idx) {
      const descText = document.getElementById("desc-text-" + idx);
      const descBtn = document.getElementById("desc-btn-" + idx);
      if (descText && descBtn) {
        if (descText.classList.contains("hidden")) {
          descText.classList.remove("hidden");
          descBtn.innerHTML = "Ocultar descrição ▲";
        } else {
          descText.classList.add("hidden");
          descBtn.innerHTML = "Ver descrição ▼";
        }
      }
    };

    window.openWixModal = function(idx) {
      const p = items[idx];
      currentModalProduct = p;
      modalActiveTab = "info";
      modalActiveImgIdx = 0;
      
      const modal = document.getElementById("wix-modal");
      
      // Update basic details
      document.getElementById("modal-title").innerText = p.title;
      document.getElementById("modal-price").innerText = p.price;
      document.getElementById("modal-category-badge").innerText = p.category;
      
      // Setup shop badge styles
      const shopBadge = document.getElementById("modal-shop-badge");
      shopBadge.innerText = p.sourceShop;
      shopBadge.className = "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white font-mono " + getStoreBadgeClass(p.sourceShop);
      
      // Render gallery or single image
      renderModalImageAndGallery();
      
      // Setup action link
      document.getElementById("modal-affiliate-link").href = p.affiliateUrl;
      
      // WhatsApp share Setup
      document.getElementById("modal-whatsapp-share").href = "https://api.whatsapp.com/send?text=" + encodeURIComponent("🔥 Olha essa indicação fantástica! " + p.title + " por apenas " + p.price + "! Garanta o seu aqui: " + p.affiliateUrl);
      
      // Setup Tabs view
      const embedTabBtn = document.getElementById("modal-tab-embed");
      const embedBadge = document.getElementById("modal-tab-embed-badge");
      if (p.embedCode && p.embedCode.trim()) {
        embedTabBtn.classList.remove("hidden");
        embedTabBtn.classList.add("flex");
        embedBadge.classList.remove("hidden");
      } else {
        embedTabBtn.classList.add("hidden");
        embedTabBtn.classList.remove("flex");
        embedBadge.classList.add("hidden");
      }

      setModalTab("info");
      
      // Show modal
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.style.overflow = "hidden";
    };

    window.closeWixModal = function() {
      const modal = document.getElementById("wix-modal");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    };

    window.setModalActiveImg = function(imgIdx) {
      modalActiveImgIdx = imgIdx;
      renderModalImageAndGallery();
    };

    function renderModalImageAndGallery() {
      const p = currentModalProduct;
      const gallery = [p.imageUrl, ...(p.imageGallery || [])].filter(Boolean);
      
      document.getElementById("modal-main-img").src = gallery[modalActiveImgIdx] || p.imageUrl;
      
      const thumbsContainer = document.getElementById("modal-thumbs-container");
      if (gallery.length > 1) {
        thumbsContainer.classList.remove("hidden");
        thumbsContainer.classList.add("flex");
        thumbsContainer.innerHTML = gallery.map((imgUrl, idx) => {
          const active = idx === modalActiveImgIdx;
          return \`
            <button
               type="button"
               onclick="setModalActiveImg(\${idx})"
               class="w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 \${
                 active 
                   ? 'border-amber-500 scale-105 shadow-sm' 
                   : 'border-slate-200 hover:border-slate-350'
               }"
            >
              <img src="\${imgUrl}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'">
            </button>
          \`;
        }).join("");
      } else {
        thumbsContainer.classList.add("hidden");
        thumbsContainer.classList.remove("flex");
        thumbsContainer.innerHTML = "";
      }
    }

    window.setModalTab = function(tabName) {
      modalActiveTab = tabName;
      
      const tabInfo = document.getElementById("modal-tab-info");
      const tabEmbed = document.getElementById("modal-tab-embed");
      
      if (modalActiveTab === "info") {
        tabInfo.className = "pb-2.5 text-xs font-bold tracking-wide uppercase transition-all relative border-b-2 border-amber-600 text-amber-600 cursor-pointer";
        tabEmbed.className = "pb-2.5 text-xs font-bold tracking-wide uppercase transition-all relative text-slate-400 hover:text-slate-600 cursor-pointer";
      } else {
        tabInfo.className = "pb-2.5 text-xs font-bold tracking-wide uppercase transition-all relative text-slate-400 hover:text-slate-600 cursor-pointer";
        tabEmbed.className = "pb-2.5 text-xs font-bold tracking-wide uppercase transition-all relative border-b-2 border-amber-600 text-amber-600 cursor-pointer";
      }
      
      const contentDiv = document.getElementById("modal-tab-content");
      const p = currentModalProduct;
      
      if (modalActiveTab === "info") {
        contentDiv.innerHTML = \`
          <div class="space-y-4">
            <p class="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100 max-h-[180px] overflow-y-auto">
              \${p.description}
            </p>
            <div class="flex gap-2.5 pt-2">
              <button
                onclick="copyModalShareText()"
                class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-semibold text-xs text-slate-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                <span id="modal-copy-btn-text">Copiar Link + Copy de Oferta</span>
              </button>
            </div>
          </div>
        \`;
      } else {
        contentDiv.innerHTML = \`
          <div class="space-y-4 animate-fadeIn">
            <div class="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner p-2 text-center">
              <div class="w-full flex justify-center items-center overflow-auto max-h-[220px]">
                \${p.embedCode}
              </div>
              <div class="bg-slate-800 px-4 py-1.5 text-[10px] text-slate-400 flex items-center gap-1.5 justify-center border-t border-slate-700 font-mono">
                Widget oficial renderizado via iframe
              </div>
            </div>
          </div>
        \`;
      }
    };

    window.copyModalShareText = function() {
      const p = currentModalProduct;
      const shareText = "🔥 Olha essa oferta imperdível!\\n\\n📦 " + p.title + "\\n💵 Preço: " + p.price + "\\n👉 Compre com segurança aqui: " + p.affiliateUrl;
      
      const el = document.createElement('textarea');
      el.value = shareText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      const btnText = document.getElementById("modal-copy-btn-text");
      if (btnText) btnText.innerText = "Copiado com sucesso!";
      
      setTimeout(() => {
        const btnTextReset = document.getElementById("modal-copy-btn-text");
        if (btnTextReset) btnTextReset.innerText = "Copiar Link + Copy de Oferta";
      }, 2000);
    };

    function getStoreBadgeClass(shop) {
      if (!shop) return "bg-slate-150 text-slate-700";
      const name = shop.toLowerCase();
      if (name.includes("amazon")) return "bg-amber-500 text-white font-bold border border-amber-600";
      if (name.includes("shopee")) return "bg-orange-500 text-white font-bold border border-orange-600";
      if (name.includes("ali")) return "bg-red-500 text-white font-bold border border-red-600";
      return "bg-slate-900 text-white border border-slate-800";
    }

    function renderProducts() {
      const grid = document.getElementById("products-grid");
      const empty = document.getElementById("empty-state");
      
      const filtered = items.filter(p => {
        const matchesCat = activeCategory === "Todos" || p.category === activeCategory;
        const query = activeQuery.toLowerCase();
        const matchesQuery = !query || 
                             p.title.toLowerCase().includes(query) || 
                             p.description.toLowerCase().includes(query) || 
                             p.sourceShop.toLowerCase().includes(query);
                             
        return matchesCat && matchesQuery;
      });

      const ocEl = document.getElementById("wix-offers-count");
      if (ocEl) {
        if (filtered.length === items.length) {
          ocEl.innerText = items.length + " Ofertas";
        } else {
          ocEl.innerText = filtered.length + "/" + items.length;
        }
      }

      if (filtered.length === 0) {
        grid.innerHTML = "";
        empty.classList.remove("hidden");
        return;
      }

      empty.classList.add("hidden");
      
      grid.innerHTML = filtered.map((p, pIdx) => {
        const gallery = [p.imageUrl, ...(p.imageGallery || [])].filter(Boolean);
        const itemIndex = items.indexOf(p);
        
        const thumbnailRow = gallery.length > 1 ? \`
          <div class="flex gap-1.5 overflow-x-auto p-2 justify-center border-t border-slate-100 bg-slate-50/45 no-scrollbar">
            \${gallery.map((imgUrl, imgIdx) => \`
              <button 
                type="button"
                onclick="changeWixImg(\${pIdx}, '\${imgUrl}', \${imgIdx}, \${gallery.length})"
                id="thumb-\${pIdx}-\${imgIdx}"
                class="w-9 h-9 rounded-lg overflow-hidden border-2 transition-all shrink-0 \${imgIdx === 0 ? 'border-amber-500 scale-105' : 'border-slate-200 hover:border-slate-350'}"
              >
                <img src="\${imgUrl}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'">
              </button>
            \`).join("")}
          </div>
        \` : '';

        return \`
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between product-card group animate-fadeIn">
            <div onclick="openWixModal(\${itemIndex})" class="cursor-pointer">
              <div class="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-50">
                <img 
                  id="wix-img-\${pIdx}"
                  src="\${p.imageUrl}" 
                  alt="\${p.title}" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onerror="this.src='https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'"
                >
                <div class="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex gap-1 z-10">
                  <span class="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded bg-white/95 text-slate-800 shadow-sm border border-slate-100">
                    \${p.category}
                  </span>
                  <span class="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded shadow-sm \${getStoreStyle(p.sourceShop)}">
                    \${p.sourceShop}
                  </span>
                </div>
              </div>
            </div>
            
            \${thumbnailRow}
            
            <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between">
              <div onclick="openWixModal(\${itemIndex})" class="cursor-pointer space-y-1 sm:space-y-1.5">
                <div>\${getStars(p.rating)}</div>
                <h3 class="text-slate-800 font-semibold text-xs sm:text-sm leading-snug line-clamp-2 hover:text-amber-600 transition-colors">
                  \${p.title}
                </h3>
              </div>
              
              <div class="mt-1" onclick="event.stopPropagation()">
                <button 
                  type="button"
                  onclick="event.stopPropagation(); toggleWixDesc(\${itemIndex})"
                  id="desc-btn-\${itemIndex}"
                  class="text-slate-500 hover:text-amber-500 text-[9px] sm:text-[10px] font-bold flex items-center gap-1 cursor-pointer select-none py-1"
                >
                  Ver descrição ▼
                </button>
                <p id="desc-text-\${itemIndex}" class="text-slate-500 text-[10px] sm:text-[11px] leading-relaxed mt-1 hidden">
                  \${p.description}
                </p>
              </div>
            </div>

            <div class="p-2 sm:p-4 border-t border-slate-50 mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
              <div class="hidden sm:flex flex-col">
                <span class="text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-slate-400 leading-tight">Menor preço</span>
                <span class="text-amber-600 font-extrabold text-xs sm:text-base font-display">\${p.price}</span>
              </div>
              
              <div class="flex flex-col w-full sm:w-auto gap-0.5 sm:gap-1">
                <div class="flex gap-1 sm:gap-1.5 w-full justify-end">
                  <button 
                    type="button"
                    onclick="openWixModal(\${itemIndex})"
                    title="Ver detalhes"
                    class="p-1 sm:p-2 text-slate-500 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-lg sm:rounded-xl transition border border-slate-200 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <a 
                    href="\${p.affiliateUrl}" 
                    target="_blank" 
                    referrerpolicy="no-referrer"
                    class="flex-1 sm:flex-none flex items-center justify-center gap-1 px-1.5 py-1 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-amber-600 text-white font-bold text-[9px] sm:text-xs rounded-lg sm:rounded-xl shadow-sm transition-all text-center"
                  >
                    Comprar
                  </a>
                </div>
                
                {/* Mobile price below buying button */}
                <div class="sm:hidden flex items-center justify-center gap-1 mt-0.5">
                  <span class="text-[8px] text-slate-400 font-medium uppercase tracking-wider block leading-none">Menor preço:</span>
                  <span class="text-amber-600 font-bold text-[9px] block leading-tight font-sans">\${p.price}</span>
                </div>
              </div>
            </div>
          </div>
        \`;
      }).join("");
    }

     // Collapsible Mobile Menu Handlers
    window.toggleMobileCategoryMenu = function(e) {
      if (e) e.stopPropagation();
      const content = document.getElementById("mobile-category-dropdown-content");
      if (content) {
        content.classList.toggle("hidden");
      }
    };

    window.hideMobileCategoryMenu = function() {
      const content = document.getElementById("mobile-category-dropdown-content");
      if (content) {
        content.classList.add("hidden");
      }
    };

    function renderCategories() {
      // 1. Desktop Filters update
      const container = document.getElementById("categories-container");
      if (container) {
        container.innerHTML = categories.map(cat => {
          const active = cat === activeCategory;
          return \`
            <button 
              type="button"
              onclick="setCategory('\${cat}')" 
              class="px-3 py-1 text-[11px] font-bold rounded-full border tracking-wide transition whitespace-nowrap \${
                active 
                  ? 'bg-amber-500 text-white border-amber-555 shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }"
            >
              \${cat}
            </button>
          \`;
        }).join("");
      }

      // 2. Mobile Badge label update
      const label = document.getElementById("current-mobile-cat-label");
      if (label) {
        label.innerText = activeCategory !== 'Todos' ? \`[\${activeCategory}]\` : '▾';
      }

      // 3. Mobile list dropdown populator
      const mobileContainer = document.getElementById("mobile-category-dropdown-content");
      if (mobileContainer) {
        mobileContainer.innerHTML = categories.map(cat => {
          const active = cat === activeCategory;
          return \`
            <button
              type="button"
              onclick="setCategory('\${cat}'); hideMobileCategoryMenu();"
              class="px-3 py-1.5 text-left text-xs font-bold rounded-lg transition-all \${
                active 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }"
            >
              \${cat}
            </button>
          \`;
        }).join("");
      }
    }

    function setCategory(cat) {
      activeCategory = cat;
      renderCategories();
      renderProducts();
    }

    function clearFilters() {
      activeCategory = "Todos";
      activeQuery = "";
      document.getElementById("wix-search").value = "";
      renderCategories();
      renderProducts();
    }

    // Modal click closes
    document.getElementById("wix-modal").addEventListener("click", function(e) {
      if (e.target.id === "wix-modal") {
        closeWixModal();
      }
    });

    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        closeWixModal();
      }
    });

    document.getElementById("wix-search").addEventListener("input", (e) => {
      activeQuery = e.target.value;
      renderProducts();
    });

    renderCategories();
    renderProducts();
    changeWixZoom(currentZoom);

    // Sincroniza o número de ofertas disponíveis inicial do catálogo/URL
    const offerCountEl = document.getElementById("wix-offers-count");
    if (offerCountEl) {
      offerCountEl.innerText = items.length + " Ofertas";
    }

    // Métodos para o Painel de Controle Wix
    window.openAdminLogin = function() {
      document.getElementById("admin-login-modal").classList.remove("hidden");
      document.getElementById("admin-login-modal").classList.add("flex");
      document.getElementById("login-error").classList.add("hidden");
      document.body.style.overflow = "hidden";
    };

    window.closeAdminLogin = function() {
      document.getElementById("admin-login-modal").classList.add("hidden");
      document.getElementById("admin-login-modal").classList.remove("flex");
      document.body.style.overflow = "";
    };

    window.handleAdminLogin = function(e) {
      e.preventDefault();
      const user = document.getElementById("admin-user").value;
      const pass = document.getElementById("admin-pass").value;
      
      if (user === "lordbaltimor" && pass === "lord3618") {
        closeAdminLogin();
        document.getElementById("admin-user").value = "";
        document.getElementById("admin-pass").value = "";
        openAdminDashboard();
      } else {
        document.getElementById("login-error").classList.remove("hidden");
      }
    };

    window.openAdminDashboard = function() {
      document.getElementById("admin-dashboard-modal").classList.remove("hidden");
      document.getElementById("admin-dashboard-modal").classList.add("flex");
      document.body.style.overflow = "hidden";
      setDashboardTab("list");
      renderAdminDashboardList();
    };

    window.closeAdminDashboard = function() {
      document.getElementById("admin-dashboard-modal").classList.add("hidden");
      document.getElementById("admin-dashboard-modal").classList.remove("flex");
      document.body.style.overflow = "";
    };

    window.handleAdminLogout = function() {
      closeAdminDashboard();
    };

    window.setDashboardTab = function(tabName) {
      const tabListBtn = document.getElementById("db-tab-list");
      const tabAddBtn = document.getElementById("db-tab-add");
      const contentList = document.getElementById("db-content-list");
      const contentAdd = document.getElementById("db-content-add");
      
      if (tabName === "list") {
        tabListBtn.className = "px-4 py-3 text-xs font-bold tracking-wide uppercase border-b-2 border-amber-500 text-amber-500 cursor-pointer";
        tabAddBtn.className = "px-4 py-3 text-xs font-bold tracking-wide uppercase text-slate-400 hover:text-slate-600 cursor-pointer";
        contentList.classList.remove("hidden");
        contentAdd.classList.add("hidden");
        renderAdminDashboardList();
      } else {
        tabListBtn.className = "px-4 py-3 text-xs font-bold tracking-wide uppercase text-slate-400 hover:text-slate-600 cursor-pointer";
        tabAddBtn.className = "px-4 py-3 text-xs font-bold tracking-wide uppercase border-b-2 border-amber-500 text-amber-500 cursor-pointer";
        contentList.classList.add("hidden");
        contentAdd.classList.remove("hidden");
      }
    };

    window.handleAdminDeleteProduct = function(idx) {
      if (confirm("Tem certeza que deseja excluir o produto " + items[idx].title + "?")) {
        items.splice(idx, 1);
        
        categories = ["Todos", ...new Set(items.map(item => item.category))];
        renderCategories();
        renderProducts();
        renderAdminDashboardList();
        
        const ocEl = document.getElementById("wix-offers-count");
        if (ocEl) ocEl.innerText = items.length;
      }
    };

    window.handleAddNewProduct = function(e) {
      e.preventDefault();
      
      const title = document.getElementById("add-title").value.trim();
      const price = document.getElementById("add-price").value.trim();
      const affiliateUrl = document.getElementById("add-affiliateUrl").value.trim();
      const sourceShop = document.getElementById("add-sourceShop").value;
      const imageUrl = document.getElementById("add-imageUrl").value.trim();
      const category = document.getElementById("add-category").value.trim();
      const rating = parseFloat(document.getElementById("add-rating").value);
      const description = document.getElementById("add-description").value.trim();
      const embedCode = document.getElementById("add-embedCode").value.trim();
      
      const galleryVal = document.getElementById("add-imageGallery").value;
      const imageGallery = galleryVal 
        ? galleryVal.split(",").map(url => url.trim()).filter(Boolean)
        : [];
      
      const newProd = {
        title,
        price,
        affiliateUrl,
        sourceShop,
        imageUrl,
        category,
        rating,
        description,
        embedCode,
        imageGallery
      };
      
      items.unshift(newProd);
      
      document.getElementById("add-product-form").reset();
      
      categories = ["Todos", ...new Set(items.map(item => item.category))];
      renderCategories();
      renderProducts();
      
      const ocEl = document.getElementById("wix-offers-count");
      if (ocEl) ocEl.innerText = items.length;
      
      setDashboardTab("list");
      alert("Produto '" + title + "' adicionado com sucesso!");
    };

    function renderAdminDashboardList() {
      const container = document.getElementById("db-items-container");
      document.getElementById("db-item-count").innerText = items.length;
      
      if (items.length === 0) {
        container.innerHTML = \`
          <div class="text-center py-10 text-slate-400 text-xs">
            Nenhum produto cadastrado no momento. Clique em "+ Adicionar Novo" para começar!
          </div>
        \`;
        return;
      }
      
      container.innerHTML = items.map((p, idx) => {
        return \`
          <div class="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                <img src="\${p.imageUrl}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'">
              </div>
              <div class="min-w-0 text-left">
                <h4 class="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[340px]">\${p.title}</h4>
                <div class="flex gap-1.5 mt-0.5 items-center flex-wrap">
                  <span class="text-[9px] font-bold text-slate-400 font-mono">\${p.sourceShop}</span>
                  <span class="text-[9px] bg-slate-200 px-1 rounded font-bold text-slate-600">\${p.category}</span>
                  <span class="text-[9px] font-bold text-amber-600">\${p.price}</span>
                </div>
              </div>
            </div>
            
            <button 
              onclick="handleAdminDeleteProduct(\${idx})"
              type="button"
              class="p-2 text-red-500 hover:text-red-750 bg-red-50 hover:bg-red-100 rounded-lg transition shrink-0 cursor-pointer"
              title="Remover Produto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </div>
        \`;
      }).join("");
    }
  <\/script>
</body>
</html>`;
  };

  const handleCopyWixCode = () => {
    navigator.clipboard.writeText(generateWixEmbedCode());
    setWixCopied(true);
    showFeedback('success', 'Código de incorporação Wix copiado para sua área de transferência!');
    setTimeout(() => setWixCopied(false), 3000);
  };

  const generateBloggerEmbedCode = () => {
    const rawWixCode = generateWixEmbedCode();
    // Re-adapt comment tags for clear Blogger labeling
    return rawWixCode
      .replace('<!-- VITRINE DE PRODUTOS DE AFILIADOS GERADA AUTOMATICAMENTE -->', '<!-- VITRINE DE AFILIADOS PARA BLOGGER -->')
      .replace('<!-- Cole este código inteiro no widget "Incorpore HTML" do seu site Wix -->', '<!-- Adicione como postagem HTML ou Gadget de Layout (HTML/JavaScript) -->');
  };

  const handleCopyBloggerCode = () => {
    navigator.clipboard.writeText(generateBloggerEmbedCode());
    setBloggerCopied(true);
    showFeedback('success', 'Código de incorporação Blogger copiado para sua área de transferência!');
    setTimeout(() => setBloggerCopied(false), 3000);
  };

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Populate form with product to edit
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setTitle(product.title);
    setDescription(product.description);
    setPrice(product.price);
    setImageUrl(product.imageUrl);
    setImageGallery(product.imageGallery || []);
    setAffiliateUrl(product.affiliateUrl);
    setCategory(product.category as Category);
    setRating(product.rating.toString());
    setSourceShop(product.sourceShop);
    setEmbedCode(product.embedCode || '');
    setUseEmbed(!!product.useEmbed);
    
    // Smooth scroll back to form
    const formElement = document.getElementById('product-form-header');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset core product inputs
  const resetProductForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setImageGallery([]);
    setAffiliateUrl('');
    setCategory('Eletrônicos');
    setRating('4.8');
    setSourceShop('Amazon');
    setEmbedCode('');
    setUseEmbed(false);
    setRawPaste('');
  };

  // Submit product creation/edition
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !imageUrl || !affiliateUrl) {
      showFeedback('error', 'Por favor, preencha os campos obrigatórios (Título, Preço, Link da Imagem, Link de Afiliado).');
      return;
    }

    const numericRating = parseFloat(rating) || 4.5;

    const productPayload: Product = {
      id: editingId || `prod-${Date.now()}`,
      title,
      description: description || 'Sem descrição fornecida. Clique para acessar o link de afiliados.',
      price,
      imageUrl,
      imageGallery: imageGallery.filter(Boolean),
      affiliateUrl,
      category,
      rating: numericRating > 5 ? 5 : numericRating < 1 ? 1 : numericRating,
      sourceShop: sourceShop || 'Loja Parceira',
      embedCode: embedCode || undefined,
      useEmbed,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      onUpdateProduct(productPayload);
      showFeedback('success', `Produto "${title.substring(0, 20)}..." atualizado com sucesso!`);
    } else {
      onAddProduct(productPayload);
      showFeedback('success', `Produto "${title.substring(0, 20)}..." adicionado com sucesso!`);
    }

    resetProductForm();
  };

  // Call server route to optimize content using Gemini
  const handleGeminiGeneration = async () => {
    if (!rawPaste.trim()) {
      setAiError('Por favor, cole alguma especificação ou nome do produto primeiro.');
      return;
    }

    setIsAiLoading(true);
    setAiError('');
    setAiStatusMessage('Lendo texto e compreendendo o produto...');

    const loadingStages = [
      'Identificando recursos cruciais...',
      'Escrevendo textos persuasivos de venda...',
      'Formatando preço brasileiro e ajustando moeda...',
      'Calculando categorias ideais...'
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      if (stageIdx < loadingStages.length) {
        setAiStatusMessage(loadingStages[stageIdx]);
        stageIdx++;
      }
    }, 1200);

    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || undefined,
          rawText: rawPaste,
          category: category
        })
      });

      const result = await response.json();
      clearInterval(interval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erro ao gerar conteúdo via IA.');
      }

      const info = result.data;
      
      // Auto-populate the form values!
      setTitle(info.title);
      setDescription(info.description);
      setPrice(info.estimatedPrice);
      setCategory(info.suggestedCategory as Category);
      setSourceShop(info.suggestedShop);

      // Auto-populate affiliate link if a URL was pasted
      const urlRegex = /(https?:\/\/[^\s]+)/gi;
      const foundUrls = rawPaste.match(urlRegex);
      if (foundUrls && foundUrls.length > 0) {
        setAffiliateUrl(foundUrls[0]);
      }
      
      showFeedback('success', 'Copywriting & Título otimizados pela Inteligência Artificial!');
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setAiError(err.message || 'Falha de comunicação com a API. Verifique as credenciais.');
    } finally {
      setIsAiLoading(false);
      setAiStatusMessage('');
    }
  };

  // Export current list to JSON backup on browser
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup-produtos-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showFeedback('success', 'Backup JSON baixado com sucesso!');
  };

  // Upload/Import products JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (event) => {
      try {
        const parsedProducts = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsedProducts)) {
          onImportProducts(parsedProducts);
          showFeedback('success', `${parsedProducts.length} produtos importados com sucesso!`);
        } else {
          showFeedback('error', 'O arquivo JSON deve conter um array válido de produtos.');
        }
      } catch (err) {
        showFeedback('error', 'Erro ao ler arquivo JSON. Verifique a formatação do arquivo.');
      }
    };
    fileReader.readAsText(files[0]);
  };

  // Save changes to Global Frontpage configuration
  const handleSaveConfig = () => {
    if (!siteName.trim()) {
      showFeedback('error', 'O nome do site não pode ficar em branco.');
      return;
    }
    onUpdateConfig({
      siteName,
      bannerTitle,
      bannerSubtitle,
      facebookUrl: facebookUrl || undefined,
      instagramUrl: instagramUrl || undefined,
      contactEmail: contactEmail || undefined
    });
    showFeedback('success', 'Configurações globais atualizadas com sucesso!');
  };

  return (
    <div id="admin-panel-container" className="space-y-8 pb-12">
      
      {/* Alert Banner / Toast Feedback */}
      {feedback && (
        <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 ${
          feedback.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <CheckCircle2 size={20} />
          <span className="text-xs font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Config/Import Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Product Creator Form Area */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
          <div id="product-form-header" className="flex items-center justify-between mb-6">
            <h2 className="text-slate-900 font-display font-bold text-xl flex items-center gap-2">
              <Plus className="text-amber-500" />
              {editingId ? 'Editar Produto de Afiliado' : 'Fácil Upload - Novo Produto'}
            </h2>
            {editingId && (
              <button
                onClick={resetProductForm}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          {/* Gemini AI Magic Assistant Section */}
          <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 bg-amber-500/10 text-amber-600 rounded-bl-xl font-bold font-mono text-[9px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} />
              IA Ativa
            </div>

            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2 leading-relaxed">
              <Sparkles size={14} className="text-amber-500" />
              Preenchimento Inteligente com IA (Gemini)
            </h3>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Cole o título bruto, link ou especificações técnicas copiadas de outros e-commerces (como Amazon, AliExpress).
              A IA gerará um título limpo, preço do dia, categoria sugerida e uma cópia de vendas persuasiva contendo benefícios do produto e emojis!
            </p>

            <div className="space-y-3">
              <textarea
                value={rawPaste}
                onChange={(e) => setRawPaste(e.target.value)}
                placeholder="Exemplo: Fritadeira Digital Mondial AF-31. Capacidade de 3.5 litros, antiaderente, cor preta com detalhes em cobre, 1500w de potência. Link da oferta na americanas por 350 reais."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-700 transition"
              />

              {/* Gemini Key Validation Warning */}
              {isGeminiActive === false && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-800 leading-relaxed">
                  <AlertTriangle size={15} className="mt-0.5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold">Atenção:</span> A inteligência artificial Gemini não pôde ser inicializada. 
                    Para usar esta função, adicione a chave <code className="bg-amber-100/60 px-1 rounded font-mono">GEMINI_API_KEY</code> no painel <strong>Settings &gt; Secrets</strong> do AI Studio.
                  </div>
                </div>
              )}

              {aiError && (
                <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  {aiError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGeminiGeneration}
                  disabled={isAiLoading || isGeminiActive === false}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 active:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  {isAiLoading ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      {aiStatusMessage || 'Processando com IA...'}
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      Otimizar com Gemini IA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleProductSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Product Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Título do Produto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome do produto atraente e limpo"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              {/* Affiliate URL */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Link de Afiliado <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={affiliateUrl}
                  onChange={(e) => setAffiliateUrl(e.target.value)}
                  placeholder="Seu link parceiro completo (Magalu, Amazon Associados, Shopee, etc.)"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Preço <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: R$ 149,90"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              {/* Product Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Link da Imagem <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL direta de uma imagem do produto"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              {/* Image Gallery Manager */}
              <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  📸 Galeria de Imagens Adicionais ({imageGallery.length})
                </label>
                <p className="text-[10px] text-slate-500">
                  Insira múltiplos links de imagens que mostrem o produto em outros ângulos para montar uma galeria deslizável.
                </p>
                
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="new-gallery-image-input"
                    placeholder="Cole a URL da imagem (ex: https://imagens.com/produto-02.jpg)"
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) {
                          setImageGallery([...imageGallery, val]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('new-gallery-image-input') as HTMLInputElement;
                      if (el && el.value.trim()) {
                        setImageGallery([...imageGallery, el.value.trim()]);
                        el.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Adicionar
                  </button>
                </div>

                {imageGallery.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {imageGallery.map((url, index) => (
                      <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-white group shadow-sm shrink-0">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageGallery(imageGallery.filter((_, idx) => idx !== index))}
                          className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[10px]"
                        >
                          Excluir
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full border border-slate-200 bg-white rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                >
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Casa e Cozinha">Casa e Cozinha</option>
                  <option value="Eletroportáteis">Eletroportáteis</option>
                  <option value="Moda e Estilo">Moda e Estilo</option>
                  <option value="Livros e Papelaria">Livros e Papelaria</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {/* Store Partner Brand */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Loja de Origem
                </label>
                <input
                  type="text"
                  value={sourceShop}
                  onChange={(e) => setSourceShop(e.target.value)}
                  placeholder="Ex: Amazon, Shopee, AliExpress"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Avaliação (1.0 a 5.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                />
              </div>

              {/* Use Embed Toggle is optional */}
              <div className="flex items-center gap-2 mt-7 pl-1">
                <input
                  type="checkbox"
                  id="useEmbed"
                  checked={useEmbed}
                  onChange={(e) => setUseEmbed(e.target.checked)}
                  className="rounded text-amber-500 accent-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="useEmbed" className="text-xs font-bold text-slate-700 select-none cursor-pointer">
                  Mostrar Widget Incorporado por padrão
                </label>
              </div>

              {/* Embed Code Section */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Código de Incorporação ou Iframe (Opcional)
                </label>
                <textarea
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder="Cole aqui códigos HTML de widgets promocionais (Amazon), analisadores de YouTube ou iframes."
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Isso habilita a reprodução de mídias ou banners promocionais interativos diretamente nos detalhes do produto.
                </p>
              </div>

              {/* Full Description / Affiliate Sell Copy */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Cópia Persuasiva / Descrição Completa
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escreva em formato de tópicos os principais atrativos do produto."
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-amber-500 outline-none whitespace-pre-wrap"
                />
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={resetProductForm}
                className="px-5 py-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                {editingId ? 'Cancelar Edição' : 'Limpar Form'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteProduct(editingId);
                    resetProductForm();
                  }}
                  className="flex items-center gap-1.5 px-5 py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Trash2 size={13} />
                  Excluir Produto
                </button>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-950 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:bg-amber-600 hover:border-amber-600"
              >
                <Save size={14} />
                {editingId ? 'Salvar Alterações' : 'Adicionar ao Site'}
              </button>
            </div>
          </form>

        </div>

        {/* Configurations, Backup & Utilities Panel */}
        <div className="space-y-6">
          
          {/* Site Configurations Area */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-900 font-display font-bold text-base mb-4 flex items-center gap-2">
              <Info className="text-amber-500" size={18} />
              Configurar Site de Afiliados
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nome do Seu Portal
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Título Principal do Banner
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Subtítulo do Banner
                </label>
                <textarea
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Social Channels Config */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Redes Sociais e Contato</span>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Link do Instagram</label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/seu_perfil"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">E-mail de Contato Comercial</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contato@seusite.com.br"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveConfig}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition"
              >
                Atualizar Portal e Contatos
              </button>
            </div>
          </div>

          {/* Backup Database Board */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-slate-900 font-display font-bold text-base mb-4 flex items-center gap-2">
              <Download className="text-amber-500" size={18} />
              Backup & Portabilidade JSON
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Não perca seus produtos! Salve-os baixando um arquivo de backup local ou importe um catálogo inteiro em instantes.
            </p>

            <div className="space-y-3">
              {/* Export Button */}
              <button
                onClick={handleExportJson}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs transition"
              >
                <Download size={14} />
                Exportar Produtos como JSON
              </button>

              {/* Import Button */}
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  id="import-input"
                  className="hidden"
                />
                <label
                  htmlFor="import-input"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs cursor-pointer transition"
                >
                  <Upload size={14} />
                  Importar Produtos (JSON)
                </label>
              </div>
            </div>
          </div>

          {/* Wix and Blogger Integration Code Export Board */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm overflow-hidden">
            <h3 className="text-slate-900 font-display font-bold text-base mb-2 flex items-center gap-2">
              <Layers className="text-amber-500" size={18} />
              Exportar Vitrine (Wix / Blogger)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Transforme toda esta vitrine (busca, categorias, avaliações e imagens) em um widget autônomo super rápido e colar no seu site Wix ou Blogger!
            </p>

            {/* Platform Selector Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveExportTab('wix')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeExportTab === 'wix'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Wix Widget
              </button>
              <button
                type="button"
                onClick={() => setActiveExportTab('blogger')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeExportTab === 'blogger'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Blogger (Blogspot)
              </button>
            </div>

            {/* Live updated code preview panels */}
            <div className="space-y-4">
              {activeExportTab === 'wix' ? (
                <>
                  <button
                    onClick={handleCopyWixCode}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs transition-all tracking-wide uppercase ${
                      wixCopied 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                        : 'bg-amber-500 hover:bg-slate-900 border border-amber-500 hover:border-slate-950 text-white hover:text-white shadow-md'
                    }`}
                  >
                    {wixCopied ? (
                      <>
                        <Check size={14} />
                        Código Wix Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copiar Código para o Wix
                      </>
                    )}
                  </button>

                  {/* Step-by-step Portuguese embedding manual for Wix */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Como colar no Wix:</span>
                    
                    <ol className="space-y-2.5 text-slate-600 text-xs list-decimal pl-4 leading-relaxed">
                      <li>
                        Clique no botão acima para copiar o script de integração instantâneo.
                      </li>
                      <li>
                        Abra o seu <strong>Wix Site Editor</strong>.
                      </li>
                      <li>
                        No menu lateral esquerdo, clique no botão <strong>Adicionar Elementos (+)</strong>.
                      </li>
                      <li>
                        Navegue até a aba <strong>Código Incorporado (Embed Code)</strong> &gt; <strong>Incorpore um widget (HTML Embed)</strong>.
                      </li>
                      <li>
                        Clique em <strong>Editar Código</strong> no elemento criado, cole o conteúdo e clique em <b>Aplicar</b>. Ajuste a caixa para o tamanho que preferir!
                      </li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCopyBloggerCode}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs transition-all tracking-wide uppercase ${
                      bloggerCopied 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                        : 'bg-slate-900 hover:bg-amber-500 border border-slate-950 hover:border-amber-500 text-white shadow-md'
                    }`}
                  >
                    {bloggerCopied ? (
                      <>
                        <Check size={14} />
                        Código Blogger Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copiar Código para o Blogger
                      </>
                    )}
                  </button>

                  {/* Step-by-step Portuguese embedding manual for Blogger */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Como colar no Blogger:</span>
                    
                    <ol className="space-y-2.5 text-slate-600 text-xs list-decimal pl-4 leading-relaxed">
                      <li>
                        Copie o código otimizado para o Blogger no botão acima.
                      </li>
                      <li>
                        <strong>Em uma Postagem ou Página:</strong> No painel do Blogger, crie ou edite uma postagem, mude o editor de "Visualização de Escrever" para <strong>Visualização em HTML</strong> e cole o código.
                      </li>
                      <li>
                        <strong>Como um Gadget Lateral/Layout:</strong> Vá em <strong>Layout</strong> no menu esquerdo, clique em <strong>Adicionar um Gadget</strong> &gt; selecione <strong>HTML/JavaScript</strong>, dê um título e cole o código!
                      </li>
                      <li>
                        Pronto! A vitrine inteira ficará 100% interativa com busca de produtos e filtros para todos os leitores do seu blog.
                      </li>
                    </ol>
                  </div>
                </>
              )}

              {/* Dynamic code size estimator */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span>Versão do Motor: V1.3</span>
                <span className="text-emerald-600 font-bold">● Pronto para Produção</span>
              </div>
            </div>
          </div>

          {/* Catalog Listing Quick View */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm max-h-[350px] overflow-y-auto">
            <h3 className="text-slate-900 font-display font-bold text-base mb-3 block">
              Lista de Produtos ({products.length})
            </h3>

            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="p-2 border border-slate-105 rounded-xl bg-slate-50 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover bg-white border border-slate-100 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-700 truncate">{p.title}</p>
                      <p className="text-[10px] text-amber-600 font-bold">{p.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0 select-none">
                    <button
                      type="button"
                      onClick={() => handleEditClick(p)}
                      title="Editar"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600 rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      <Edit2 size={11} className="text-slate-500" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteProduct(p.id);
                      }}
                      title="Excluir"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-[11px] font-bold text-red-600 rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      <Trash2 size={11} />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {products.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">Nenhum produto cadastrado no momento.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

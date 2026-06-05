import React, { useState, useEffect, useMemo } from 'react';
import { Product, Category, AffiliateConfig } from './types';
import { INITIAL_PRODUCTS } from './initialProducts';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AdminPanel from './components/AdminPanel';
import { 
  Search, 
  ShoppingBag, 
  Settings, 
  Sparkles, 
  Instagram, 
  Facebook, 
  Mail, 
  Eye, 
  ListRestart, 
  CheckCircle2, 
  ArrowUpRight,
  UserCheck
} from 'lucide-react';

const decodeStateFromUrl = () => {
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
      if (parsed && typeof parsed === 'object') {
        return {
          products: Array.isArray(parsed.p) ? parsed.p : null,
          config: (parsed.c && typeof parsed.c === 'object') ? parsed.c : null
        };
      }
    }
  } catch (error) {
    console.error("Erro ao decodificar configurações da URL", error);
  }
  return null;
};

const DEFAULT_CONFIG: AffiliateConfig = {
  siteName: 'Guia de Ofertas',
  bannerTitle: 'Os Melhores Achadinhos e Indicações da Internet',
  bannerSubtitle: 'Economize tempo e dinheiro! Reunimos aqui links verificados e cupons especiais das maiores lojas de e-commerce do Brasil para você comprar com total segurança.',
  instagramUrl: 'https://instagram.com/seu_perfil',
  facebookUrl: '',
  contactEmail: 'contato@seusite.com.br'
};

export default function App() {
  // Load State dynamically from URL or default fallback
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<AffiliateConfig>(DEFAULT_CONFIG);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Notice Banner state and dynamic copy detection
  const [showCopiedNotice, setShowCopiedNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  // Initial URL parse
  useEffect(() => {
    const decoded = decodeStateFromUrl();
    if (decoded) {
      if (decoded.products) {
        setProducts(decoded.products);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
      if (decoded.config) {
        setConfig(decoded.config);
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      setConfig(DEFAULT_CONFIG);
    }
    setIsLoading(false);
  }, []);

  // Sync memory state back to url query parameters instantly
  useEffect(() => {
    if (isLoading) return;
    try {
      const dataObj = {
        p: products,
        c: config
      };
      const jsonStr = JSON.stringify(dataObj);
      const utf8Bytes = new TextEncoder().encode(jsonStr);
      let binaryStr = "";
      for (let i = 0; i < utf8Bytes.length; i++) {
        binaryStr += String.fromCharCode(utf8Bytes[i]);
      }
      const b54 = btoa(binaryStr);
      
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('c', b54);
      window.history.replaceState(null, '', newUrl.toString());
    } catch (e) {
      console.error("Erro ao sincronizar URL:", e);
    }
  }, [products, config, isLoading]);

  // Sync state functions
  const saveProductsToStorage = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const handleAddProduct = (newProd: Product) => {
    const updated = [newProd, ...products];
    saveProductsToStorage(updated);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    saveProductsToStorage(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    saveProductsToStorage(updated);
  };

  const handleImportProducts = (imported: Product[]) => {
    saveProductsToStorage(imported);
  };

  const handleUpdateConfig = (newConfig: AffiliateConfig) => {
    setConfig(newConfig);
  };

  // Reset to showcase products in 1 click
  const handleResetCatalog = () => {
    if (window.confirm('Deseja redefinir todo o catálogo para os produtos demonstrativos iniciais? Seu progresso atual será limpo.')) {
      saveProductsToStorage(INITIAL_PRODUCTS);
    }
  };

  const handleCopyShareLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar link:", err);
    }
  };

  // Memoized filtered lists
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Text Search Filter (Title, Description, Shop)
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sourceShop.toLowerCase().includes(searchQuery.toLowerCase());
        
      // 2. Category Dropdown Filter
      const matchesCategory = 
        selectedCategory === 'Todos' || 
        p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const categories: Category[] = [
    'Todos', 
    'Eletrônicos', 
    'Casa e Cozinha', 
    'Eletroportáteis', 
    'Moda e Estilo', 
    'Livros e Papelaria', 
    'Outros'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Carregando Vitrine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between selection:bg-amber-150 selection:text-amber-900">
      
      {/* Upper Brand / Admin Header Toolbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/10">
              <ShoppingBag size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-slate-900 font-display font-extrabold text-lg leading-none tracking-tight">
                {config.siteName}
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Parceiro Indicado</span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Direct Link Share Button */}
            <button
              onClick={handleCopyShareLink}
              title="Copiar link direto contendo seu catálogo"
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold font-sans transition-all border shadow-sm cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
              }`}
            >
              {copiedLink ? <CheckCircle2 size={13} className="animate-bounce" /> : <ArrowUpRight size={13} />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link Direto'}</span>
            </button>

            {/* Quick Catalog Reset Button - Only in Admin Mode */}
            {isAdmin && (
              <button
                onClick={handleResetCatalog}
                title="Redefinir catálogo de demonstração"
                className="p-2.5 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-150 rounded-xl transition cursor-pointer border border-slate-200 flex items-center gap-1 text-xs font-semibold"
              >
                <ListRestart size={14} />
                <span className="hidden sm:inline">Exemplos</span>
              </button>
            )}

            {/* Toggle Administration View Mode Button */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-sans transition-all shadow-sm cursor-pointer border ${
                isAdmin 
                  ? 'bg-amber-100 hover:bg-amber-150 text-amber-900 border-amber-200' 
                  : 'bg-slate-900 hover:bg-amber-600 text-white border-slate-900 hover:border-amber-600'
              }`}
            >
              <Settings size={14} className={isAdmin ? 'animate-spin' : ''} />
              <span>{isAdmin ? 'Voltar para Vitrine' : 'Painel de Controle'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* State 1: Owner Directory Dashboard Active */}
        {isAdmin ? (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {/* Top Info Banner for Administrators */}
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold font-mono text-[9px] uppercase tracking-wider rounded-md">Modo Admin</span>
                <h2 className="text-xl font-display font-bold">Gerencie Seus Links de Afiliados</h2>
                <p className="text-xs text-slate-400">Adicione novos produtos, customize metadados e aproveite sugestões por inteligência artificial!</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700/80">
                <UserCheck size={14} className="text-amber-500" />
                <span className="text-[11px] font-mono font-medium text-slate-350">{products.length} Produtos Cadastrados</span>
              </div>
            </div>

            {/* Render full dashboard interface */}
            <AdminPanel
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onImportProducts={handleImportProducts}
              config={config}
              onUpdateConfig={handleUpdateConfig}
              onClose={() => setIsAdmin(false)}
            />
          </div>
        ) : (
          /* State 2: Standard Visitor Showcase Directory Active */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Interactive Search Bar ("barra de pesquisa") & Category Filters Board */}
            <section className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
              <div className="flex flex-col gap-3">
                
                {/* Search Bar Input */}
                <div className="relative w-full">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="O que você está procurando hoje? Busque por marca, produto, preço..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-amber-500 active:border-amber-550 focus:ring-1 focus:ring-amber-500 text-xs text-slate-800 rounded-xl outline-none placeholder-slate-450 transition"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-800"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Below Search: Zoom adjustment and counter */}
                <div className="flex flex-wrap items-center justify-between gap-3.5 pt-1">
                  {/* Product Grid Zoom Adjustment Slider */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl flex-1 max-w-xs sm:max-w-md">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Zoom:</span>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={zoomLevel}
                      onChange={(e) => setZoomLevel(Number(e.target.value))}
                      className="w-24 sm:w-36 accent-amber-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none flex-1"
                    />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-600 font-mono">Lvl.{zoomLevel}</span>
                  </div>

                  {/* Live products counter badge */}
                  <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center justify-center gap-2 shrink-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-bold text-slate-705">
                      {filteredProducts.length === products.length 
                        ? `${products.length} Items` 
                        : `${filteredProducts.length}/${products.length}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Responsive Category Filters Area */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                {/* Mobile View: Left sided categories menu */}
                <div className="sm:hidden relative text-left w-full" id="mobile-categories-dropdown-holder">
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => setShowMobileCategories(!showMobileCategories)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <span>Categorias</span>
                      <span className="text-[10px] text-amber-600 font-mono">
                        {selectedCategory !== 'Todos' ? `[${selectedCategory}]` : '▾'}
                      </span>
                    </button>
                    {selectedCategory !== 'Todos' && (
                      <button
                        onClick={() => setSelectedCategory('Todos')}
                        className="text-[10px] text-slate-400 hover:text-amber-600 font-bold"
                      >
                        Limpar Filtro
                      </button>
                    )}
                  </div>

                  {showMobileCategories && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMobileCategories(false)} />
                      <div className="absolute left-0 mt-1.5 bg-white border border-slate-200 rounded-xl p-2 shadow-xl z-50 flex flex-col gap-1 min-w-[180px] animate-in fade-in slide-in-from-top-1 duration-150">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowMobileCategories(false);
                            }}
                            className={`px-3 py-1.5 text-left text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              selectedCategory === cat 
                                ? 'bg-amber-500 text-white shadow-sm' 
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Desktop View: Horizontal Scrollable Category Pills Filter */}
                <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">Filtrar:</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full border tracking-wide transition whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/10' 
                          : 'bg-white text-slate-600 border-slate-250 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Products Grid Showcase */}
            <section>
              <div className={
                zoomLevel === 1 ? "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5" :
                zoomLevel === 3 ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6" :
                zoomLevel === 4 ? "grid grid-cols-1 max-w-xl mx-auto gap-6" :
                "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
              }>
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isAdmin={false}
                    onSelect={(prod) => setSelectedProduct(prod)}
                    zoomLevel={zoomLevel}
                  />
                ))}
              </div>

              {/* Empty Search/Filter State */}
              {filteredProducts.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-lg mx-auto">
                  <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
                    <Search size={22} />
                  </div>
                  <h3 className="text-slate-900 font-display font-bold text-lg mb-1">Nenhum produto encontrado</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Não encontramos resultados para a sua pesquisa em "<span className="font-semibold text-slate-800">{searchQuery}</span>". 
                    Tente outras palavras-chave ou navegue por outra categoria!
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todos');
                    }}
                    className="mt-5 px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition"
                  >
                    Mostrar Tudo
                  </button>
                </div>
              )}
            </section>

          </div>
        )}

      </main>

      {/* Global Brand Footer Block */}
      <footer className="bg-white border-t border-slate-100 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Brand Disclaimer */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded bg-amber-500 flex items-center justify-center text-white font-black text-sm">A</div>
                <span className="font-display font-extrabold text-sm">{config.siteName}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Este é um portal de curadoria de comércio eletrônico. Atuamos divulgando links de indicação e afiliados.
                Ao comprar usando nossos links recomendados, nós podemos ganhar uma pequena comissão sem que você pague nada a mais por isso!
              </p>
            </div>

            {/* Column 2: Legal compliance info */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">🔒 Transparência e Segurança</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Todos os produtos apresentados passam por filtros rigorosos para garantir as melhores ofertas de lojas oficiais 
                (Amazon, Shopee, AliExpress, Magalu, Mercado Livre etc.). Suas transações e dados financeiros são processados diretamente no checkout das lojas parceiras.
              </p>
            </div>

            {/* Column 3: Contact Commercial and Social links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">👋 Fale Conosco</h4>
              
              <div className="flex flex-col gap-2 pt-1">
                {config.contactEmail && (
                  <a 
                    href={`mailto:${config.contactEmail}`}
                    className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-2 transition"
                  >
                    <Mail size={14} className="text-amber-500" />
                    <span>{config.contactEmail}</span>
                  </a>
                )}
                
                {config.instagramUrl && (
                  <a 
                    href={config.instagramUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-2 transition"
                  >
                    <Instagram size={14} className="text-amber-500" />
                    <span>Instagram Oficial</span>
                    <ArrowUpRight size={10} className="text-slate-300" />
                  </a>
                )}

                {config.facebookUrl && (
                  <a 
                    href={config.facebookUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-amber-600 flex items-center gap-2 transition"
                  >
                    <Facebook size={14} className="text-amber-500" />
                    <span>Facebook</span>
                    <ArrowUpRight size={10} className="text-slate-300" />
                  </a>
                )}
              </div>
            </div>

          </div>

          <div className="h-[1px] bg-slate-100 my-8"></div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} {config.siteName}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span>Portal de Afiliações Online</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating detail popup modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}

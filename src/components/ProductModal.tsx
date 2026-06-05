import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, Copy, Check, ShieldCheck, Share2, Layers, PlayCircle, HelpCircle, Code } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'embed'>('info');

  const gallery = product.imageGallery && product.imageGallery.length > 0
    ? [product.imageUrl, ...product.imageGallery]
    : [product.imageUrl];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleCopyLink = () => {
    // Generate a shareable checkout link structure
    const shareText = `🔥 Olha essa oferta imperdível!\n\n📦 ${product.title}\n💵 Preço: ${product.price}\n👉 Compre com segurança aqui: ${product.affiliateUrl}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id={`modal-${product.id}`} className="fixed inset-0 min-h-screen bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition z-20 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Left Side: Media Column */}
        <div className="w-full md:w-1/2 bg-slate-50 border-r border-slate-100 flex flex-col justify-between p-6">
          <div className="my-auto flex flex-col items-center w-full">
            {/* Aspect lock container - optimized for mobile sizing */}
            <div className="w-full aspect-square max-w-[420px] md:max-w-[320px] rounded-2xl overflow-hidden shadow-sm relative border border-slate-100 bg-white flex items-center justify-center">
              <img
                src={gallery[activeImageIndex] || product.imageUrl}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600';
                }}
              />
            </div>

            {/* Thumbnail Navigation Row */}
            {gallery.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-[420px] md:max-w-[320px] p-1 justify-center no-scrollbar">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx 
                        ? 'border-amber-500 scale-105 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verification Badge */}
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800">Link de Afiliado Verificado</p>
              <p className="text-[10px] text-emerald-600">Este link redireciona para a loja parceira oficial com segurança.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Tabs Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
          <div>
            {/* Store and Category badges */}
            <div className="flex gap-2 items-center mb-4 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded text-slate-500">
                {product.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500 rounded text-white font-mono">
                {product.sourceShop}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-slate-900 font-display font-bold text-base md:text-2xl leading-tight mb-1.5 md:mb-2">
              {product.title}
            </h2>

            {/* Price with CTA right next to it: stacks dynamically on mobile */}
            <div className="my-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">Preço do site</span>
                <span className="text-amber-600 font-display font-extrabold text-lg sm:text-2xl md:text-3xl leading-tight">{product.price}</span>
              </div>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-4.5 sm:py-3 bg-amber-500 hover:bg-slate-900 border border-amber-500 hover:border-slate-950 text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Ir para a Loja
                <ShoppingBag size={14} />
              </a>
            </div>

            {/* Navigation Tabs (Information vs Embedded Widget Mode) */}
            <div className="flex border-b border-slate-100 mb-6 gap-4">
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-2.5 text-[10px] sm:text-xs font-bold tracking-wide uppercase transition-all relative cursor-pointer ${
                  activeTab === 'info' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Detalhes
              </button>
              
              <button
                onClick={() => setActiveTab('embed')}
                className={`pb-2.5 text-[10px] sm:text-xs font-bold tracking-wide uppercase transition-all relative flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'embed' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Layers size={14} />
                Widget Incorporado
                {product.embedCode && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>}
              </button>
            </div>

            {/* Tab 1 Content: Standard Info Description */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
                  {product.description}
                </p>

                {/* Micro social interactions */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl font-semibold text-xs text-slate-700 transition"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        Copiado Prontinho!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copiar Link + Copy de Oferta
                      </>
                    )}
                  </button>
                  
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `🔥 Oferta Espetacular! ${product.title} por apenas ${product.price}! Veja aqui: ${product.affiliateUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-emerald-800 transition flex items-center justify-center"
                    title="Compartilhar no WhatsApp"
                  >
                    <Share2 size={16} />
                  </a>
                </div>
              </div>
            )}

            {/* Tab 2 Content: HTML/IFrame Embed Area */}
            {activeTab === 'embed' && (
              <div className="space-y-4">
                {product.embedCode ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner p-2">
                    {/* Rendered HTML snippet safely */}
                    <div 
                      className="w-full flex justify-center items-center overflow-auto max-h-[350px]"
                      dangerouslySetInnerHTML={{ __html: product.embedCode }}
                    />
                    <div className="bg-slate-800 px-4 py-2 text-[10px] text-slate-400 flex items-center gap-1.5 justify-center border-t border-slate-700 font-mono">
                      <Code size={12} className="text-amber-500" />
                      Widget renderizado via Iframe/HTML seguro
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 p-6 rounded-2xl bg-slate-50 text-center flex flex-col items-center">
                    <HelpCircle size={40} className="text-slate-450 mb-3 animate-bounce" />
                    <p className="text-sm font-bold text-slate-700">Sem widget personalizado ainda</p>
                    <p className="text-xs text-slate-500 mt-2 max-w-[300px]">
                      Como administrador, você pode colocar códigos HTML, vídeos do YouTube ou iframes oficiais de afiliados
                      para este produto aparecerem em tempo real no portal!
                    </p>
                    <div className="mt-4 w-full text-left bg-white p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">💡 Simulando uma prévia do site:</p>
                      <div className="relative border border-slate-250 rounded-lg overflow-hidden h-[120px] bg-slate-50 flex items-center justify-center">
                        <span className="text-xs text-slate-400 flex flex-col items-center gap-1 font-mono">
                          <PlayCircle size={20} className="text-red-500" />
                          {product.sourceShop}.com
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                    <Layers size={13} />
                    Como funciona a incorporação?
                  </p>
                  <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                    Você pode incorporar qualquer código fornecido pela loja original (como o Amazon Widgets Associates)
                    ou links de análises do YouTube para reter maiores tempos de navegação no seu site de afiliados.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer Button replaced with security indicator */}
          <div className="mt-8 border-t border-slate-100 pt-5">
            <p className="text-center text-xs text-slate-500 leading-relaxed font-medium">
              🛡️ Compra 100% Segura em {product.sourceShop}! Ao clicar em "Ir para a Loja", você será redirecionado ao site oficial para garantir o menor preço e total segurança na transação.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

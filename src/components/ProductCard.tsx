import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, Star, ExternalLink, Code, Eye, Layers } from 'lucide-react';

interface ProductCardProps {
  key?: any;
  product: Product;
  onSelect: (product: Product) => void;
  isAdmin: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  zoomLevel?: number;
}

export default function ProductCard({ product, onSelect, isAdmin, onEdit, onDelete, zoomLevel = 2 }: ProductCardProps) {
  const [showDesc, setShowDesc] = useState(false);

  // Get stylized colors for the original store
  const getStoreBadgeStyles = (shopName: string) => {
    const name = shopName.toLowerCase();
    if (name.includes('amazon')) {
      return 'bg-amber-100 text-amber-950 font-bold border border-amber-300';
    } else if (name.includes('shopee')) {
      return 'bg-orange-100 text-orange-850 font-bold border border-orange-300';
    } else if (name.includes('aliexpress') || name.includes('ali')) {
      return 'bg-red-100 text-red-955 font-bold border border-red-300';
    } else if (name.includes('shein')) {
      return 'bg-neutral-900 text-neutral-50 border border-neutral-705';
    }
    return 'bg-slate-100 text-slate-850 border border-slate-300';
  };

  // Render Star Ratings
  const renderStars = (rating: number) => {
    const starCount = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={zoomLevel === 1 ? 9 : 12}
            className={`${
              i < starCount ? 'fill-amber-500 text-amber-500' : 
              i === starCount && hasHalf ? 'fill-amber-300 text-amber-400' : 'text-slate-200'
            }`}
          />
        ))}
        <span className="text-[9px] sm:text-xs text-slate-500 ml-1 font-mono font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Dynamic zoom styles mapping
  const titleTextClass = 
    zoomLevel === 1 ? "text-[10px] leading-tight" :
    zoomLevel === 3 ? "text-xs sm:text-lg leading-snug" :
    zoomLevel === 4 ? "text-sm sm:text-xl leading-snug" :
    "text-[11px] sm:text-base leading-snug"; // Default index 2

  const priceTextClass = 
    zoomLevel === 1 ? "text-[10px] font-bold" :
    zoomLevel === 3 ? "text-sm sm:text-xl font-extrabold" :
    zoomLevel === 4 ? "text-base sm:text-2xl font-black" :
    "text-xs sm:text-lg font-bold";

  const paddingClass = 
    zoomLevel === 1 ? "p-1.5 sm:p-3" :
    zoomLevel === 3 ? "p-3 sm:p-6" :
    zoomLevel === 4 ? "p-4 sm:p-8" :
    "p-2.5 sm:p-5";

  const gapClass = 
    zoomLevel === 1 ? "gap-1" : "gap-1.5 sm:gap-2";

  return (
    <div 
      id={`card-${product.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 flex flex-col h-full product-card group animate-fadeIn"
    >
      {/* Product Image Panel: larger ratio aspect-[4/3] on mobile */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-slate-50 group-hover:opacity-95 transition-opacity">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600';
          }}
        />

        {/* Floating Category and Shop badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-wrap gap-1 z-10">
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[11px] font-bold uppercase tracking-wider rounded bg-white/95 text-slate-800 shadow-sm border border-slate-100">
            {product.category}
          </span>
          <span className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[11px] font-bold uppercase tracking-wider rounded shadow-sm ${getStoreBadgeStyles(product.sourceShop)}`}>
            {product.sourceShop}
          </span>
        </div>

        {/* Embedded content availability tag */}
        {product.embedCode && (
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10">
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[11px] font-bold tracking-wide uppercase rounded bg-amber-500 text-white shadow-md animate-pulse">
              <Layers size={9} />
              Widget
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className={`${paddingClass} flex-grow flex flex-col justify-between`}>
        <div>
          {/* Rating */}
          <div className="mb-1 sm:mb-2">
            {renderStars(product.rating)}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(product)}
            className={`text-slate-800 font-display font-semibold hover:text-amber-600 transition-colors cursor-pointer line-clamp-2 ${titleTextClass} mb-1 sm:mb-2`}
          >
            {product.title}
          </h3>

          {/* Collapsible Description Area */}
          <div className="mb-2 sm:mb-4">
            <button
              type="button"
              onClick={() => setShowDesc(!showDesc)}
              className="text-slate-500 hover:text-amber-600 text-[9px] sm:text-[10px] font-bold flex items-center gap-1 cursor-pointer select-none py-1"
            >
              <span>{showDesc ? 'Ocultar descrição ▲' : 'Ver descrição ▼'}</span>
            </button>
            {showDesc && (
              <p className="text-slate-500 text-[9px] sm:text-xs leading-relaxed mt-1 animate-in fade-in slide-in-from-top-1 duration-205">
                {product.description}
              </p>
            )}
          </div>
        </div>

        <div>
          {/* Divider */}
          <div className="h-[1px] bg-slate-100 my-1.5 sm:my-3"></div>

          {/* Footer Area: Price & Call to Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
            {/* Desktop-only Price */}
            <div className="hidden sm:flex flex-col">
              <span className="text-[8px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider">Menor Preço</span>
              <span className={`text-amber-600 font-display font-bold select-text ${priceTextClass}`}>{product.price}</span>
            </div>

            <div className={`flex flex-col w-full sm:w-auto ${gapClass}`}>
              <div className="flex gap-1 sm:gap-1.5 w-full">
                {/* Detailed view / Widget Preview */}
                <button 
                  onClick={() => onSelect(product)}
                  title="Ver detalhes e conteúdo incorporado"
                  className="p-1 sm:p-2 text-slate-500 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-lg sm:rounded-xl transition border border-slate-200 cursor-pointer shrink-0"
                >
                  {product.embedCode ? <Layers size={11} className="text-amber-600" /> : <Eye size={11} />}
                </button>

                {/* Deep Affiliate Referral Link */}
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex-1 flex items-center justify-center gap-1 px-1.5 py-1 sm:px-4 sm:py-2 bg-slate-900 border border-slate-900 text-white hover:bg-amber-600 hover:border-amber-600 font-bold text-[9px] sm:text-xs rounded-lg sm:rounded-xl shadow-sm transition-all text-center"
                >
                  Comprar
                </a>
              </div>

              {/* Mobile Price: ALWAYS BELOW COMPRAR on Mobile */}
              <div className="sm:hidden flex items-center justify-center gap-1 mt-0.5">
                <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider block text-center leading-none">Menor Preço:</span>
                <span className="text-amber-600 font-display font-bold text-[10px] block text-center select-text leading-tight">{product.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Action Bar (only visible to site creators) */}
      {isAdmin && (
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex gap-2 justify-end z-10">
          <button
            onClick={() => onEdit?.(product)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-150 transition-colors border border-slate-200 cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete?.(product.id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg text-red-600 hover:bg-red-50 hover:border-red-150 transition-colors border border-transparent cursor-pointer"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}

// src/components/skins/AtariSkin.tsx
import React from 'react';

export const AtariSkin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative p-8 bg-[#3d2b1f] rounded-lg border-b-8 border-black shadow-2xl">
      {/* Detalhe de Madeira Superior */}
      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#5c4033] to-[#3d2b1f] rounded-t-lg"></div>
      
      {/* Moldura da TV de Tubo */}
      <div className="bg-black p-4 rounded-3xl border-4 border-[#222]">
        <div className="relative aspect-video bg-black overflow-hidden rounded-md shadow-inner">
          {children}
        </div>
      </div>

      {/* Painel de Controle Inferior */}
      <div className="mt-6 flex justify-around items-center bg-[#1a1a1a] p-4 rounded border-t-2 border-[#333]">
        <div className="text-[#ff9000] font-mono text-xs">POWER</div>
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-red-600 rounded-full border-b-4 border-red-800 active:translate-y-1 transition-all"></div>
          <div className="w-8 h-8 bg-gray-600 rounded-sm border-b-4 border-gray-800"></div>
        </div>
        <div className="text-[#ff9000] font-mono text-xs">SELECT</div>
      </div>
    </div>
  );
};
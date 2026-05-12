import { useState, useEffect } from 'react';
import { Gamepad2, Bluetooth } from 'lucide-react';
import { isGamepadSupported, getConnectedGamepads, formatGamepadName } from '../lib/gamepad';

export default function GamepadStatus() {
  const [connected, setConnected] = useState(false);
  const [gamepadName, setGamepadName] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!isGamepadSupported()) return;

    const check = () => {
      const pads = getConnectedGamepads();
      if (pads.length > 0) {
        setConnected(true);
        setGamepadName(formatGamepadName(pads[0].id));
      } else {
        setConnected(false);
        setGamepadName('');
      }
    };

    check();
    const interval = setInterval(check, 2000);

    window.addEventListener('gamepadconnected', check);
    window.addEventListener('gamepaddisconnected', check);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gamepadconnected', check);
      window.removeEventListener('gamepaddisconnected', check);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          connected
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'bg-white/5 text-white/40 border border-white/5'
        }`}
      >
        {connected ? (
          <>
            <Bluetooth className="w-3.5 h-3.5" />
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Conectado</span>
          </>
        ) : (
          <>
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sem controle</span>
          </>
        )}
      </button>

      {showTooltip && gamepadName && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-[#1a1a2e] border border-white/10 rounded-xl text-xs text-white/70 whitespace-nowrap z-50 shadow-xl">
          {gamepadName}
        </div>
      )}
    </div>
  );
}

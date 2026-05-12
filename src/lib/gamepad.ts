export interface GamepadState {
  connected: boolean;
  id: string;
  mapping: string;
  buttons: boolean[];
  axes: number[];
  timestamp: number;
}

let gamepadListeners: ((state: GamepadState[]) => void)[] = [];
let animationFrameId: number | null = null;
let isPolling = false;

export function startGamepadPolling(): void {
  if (isPolling) return;
  isPolling = true;

  function poll() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const states: GamepadState[] = [];

    for (let i = 0; i < gamepads.length; i++) {
      const gp = gamepads[i];
      if (gp) {
        states.push({
          connected: true,
          id: gp.id,
          mapping: gp.mapping,
          buttons: Array.from(gp.buttons).map((b) => b.pressed),
          axes: Array.from(gp.axes),
          timestamp: gp.timestamp,
        });
      }
    }

    gamepadListeners.forEach((cb) => cb(states));
    animationFrameId = requestAnimationFrame(poll);
  }

  poll();
}

export function stopGamepadPolling(): void {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  isPolling = false;
}

export function addGamepadListener(callback: (states: GamepadState[]) => void): () => void {
  gamepadListeners.push(callback);
  return () => {
    gamepadListeners = gamepadListeners.filter((cb) => cb !== callback);
  };
}

export function getConnectedGamepads(): GamepadState[] {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  const states: GamepadState[] = [];
  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i];
    if (gp) {
      states.push({
        connected: true,
        id: gp.id,
        mapping: gp.mapping,
        buttons: Array.from(gp.buttons).map((b) => b.pressed),
        axes: Array.from(gp.axes),
        timestamp: gp.timestamp,
      });
    }
  }
  return states;
}

export function isGamepadSupported(): boolean {
  return 'getGamepads' in navigator;
}

export function formatGamepadName(id: string): string {
  return id
    .replace(/\(.*\)/g, '')
    .replace(/Vendor:.*Product:.*/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 40);
}

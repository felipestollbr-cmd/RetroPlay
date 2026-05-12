import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, File, X, Gamepad2, AlertCircle, Check, Lock } from 'lucide-react';
import { CONSOLES } from '../lib/consoles';
import { getPlan, canPlay, incrementPlay } from '../lib/subscription';

export default function UploadRom() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedConsole, setSelectedConsole] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState('');

  const plan = getPlan();

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files.length > 0) validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (file: File) => {
    setError(''); setUploaded(false);
    const validExts = ['.nes', '.smc', '.sfc', '.md', '.bin', '.gen', '.gb', '.gba', '.z64', '.n64', '.nds', '.zip'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExts.includes(ext)) {
      setError(`Formato ${ext} não suportado.`);
      return;
    }
    if (file.size > plan.limits.maxRomSizeMB * 1024 * 1024) {
      setError(`Arquivo muito grande. Máximo ${plan.limits.maxRomSizeMB}MB no plano ${plan.name}.`);
      return;
    }

    setSelectedFile(file);
    const consoleId = CONSOLES.find((c) => c.extensions.some((e) => e.toLowerCase() === ext))?.id;
    if (consoleId) setSelectedConsole(consoleId);
  };

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !selectedConsole) return;
    if (!canPlay()) {
      navigate('/plans');
      return;
    }

    setUploading(true); setError('');
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const blob = new Blob([arrayBuffer]);
      const url = URL.createObjectURL(blob);
      const gameSlug = selectedFile.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/\s+/g, '-');
      sessionStorage.setItem(`rom-${selectedConsole}-${gameSlug}`, JSON.stringify({ url, name: selectedFile.name }));
      incrementPlay();
      setUploading(false); setUploaded(true);
      setTimeout(() => navigate(`/play/${selectedConsole}/${gameSlug}`), 1000);
    } catch {
      setUploading(false);
      setError('Erro ao processar o arquivo.');
    }
  }, [selectedFile, selectedConsole, navigate, plan]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="pt-8 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Upload de ROM</h1>
            <p className="text-white/40 mb-2">Faça upload da sua própria ROM para jogar</p>
            <div className="flex items-center gap-2 mb-10">
              <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-full">
                Limite: {plan.limits.maxRomSizeMB}MB • Plano {plan.name}
              </span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-10 sm:p-16 text-center ${
                dragOver ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".nes,.smc,.sfc,.md,.bin,.gen,.gb,.gba,.z64,.n64,.nds,.zip" onChange={handleFileSelect} className="hidden" />
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-white font-medium text-lg mb-2">Arraste sua ROM aqui ou clique para selecionar</p>
              <p className="text-white/30 text-sm">NES, SNES, Genesis, Game Boy, GBA, N64, NDS • Máx. {plan.limits.maxRomSizeMB}MB</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            {selectedFile && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <File className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{selectedFile.name}</p>
                    <p className="text-white/30 text-xs">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setSelectedConsole(''); setUploaded(false); }} className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/60 mb-3">Selecione o console</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CONSOLES.map((c) => {
                      const isValid = c.extensions.some((e) => '.' + selectedFile.name.split('.').pop()?.toLowerCase() === e.toLowerCase());
                      return (
                        <button
                          key={c.id}
                          onClick={(e) => { e.stopPropagation(); if (isValid) setSelectedConsole(c.id); }}
                          disabled={!isValid}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            selectedConsole === c.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' :
                            isValid ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white' :
                            'bg-white/[0.02] text-white/20 cursor-not-allowed'
                          }`}
                        >
                          {c.shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  disabled={!selectedConsole || uploading || uploaded}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                    uploaded ? 'bg-green-600 text-white' :
                    'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {uploading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processando...</>
                  ) : uploaded ? (
                    <><Check className="w-5 h-5" />ROM carregada! Abrindo...</>
                  ) : (
                    <><Gamepad2 className="w-5 h-5" />Jogar Agora</>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

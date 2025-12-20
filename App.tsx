
import React, { useState, useCallback } from 'react';
import { Upload, Wand2, RefreshCcw, Download, Sparkles, AlertCircle } from 'lucide-react';
import { geminiService } from './services/geminiService';
import { ImageState, AppStatus } from './types';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    originalUrl: null,
    editedUrl: null,
    base64: null,
    mimeType: null,
  });
  const [prompt, setPrompt] = useState('Ajoute un bonnet de Noël rouge et blanc festif sur la tête de la personne dans cette image.');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setImageState({
        originalUrl: result,
        editedUrl: null,
        base64: base64,
        mimeType: file.type,
      });
      setStatus(AppStatus.IDLE);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyEdit = async () => {
    if (!imageState.base64 || !imageState.mimeType) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const resultUrl = await geminiService.editImage(
        imageState.base64,
        imageState.mimeType,
        prompt
      );
      setImageState(prev => ({ ...prev, editedUrl: resultUrl }));
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la modification de l'image.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setImageState({
      originalUrl: null,
      editedUrl: null,
      base64: null,
      mimeType: null,
    });
    setPrompt('Ajoute un bonnet de Noël rouge et blanc festif sur la tête de la personne dans cette image.');
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  const downloadImage = () => {
    if (!imageState.editedUrl) return;
    const link = document.createElement('a');
    link.href = imageState.editedUrl;
    link.download = `festive-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20">
      {/* Header section */}
      <header className="w-full bg-red-600 text-white py-12 px-4 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex flex-wrap gap-10 p-4">
            {Array.from({length: 20}).map((_, i) => (
                <Sparkles key={i} size={48} className="animate-pulse" />
            ))}
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-festive mb-4 drop-shadow-lg">
            Atelier de Noël AI
          </h1>
          <p className="text-xl md:text-2xl text-red-100 font-light italic">
            Ajoutez instantanément un bonnet de Noël à vos photos grâce à l'IA
          </p>
        </div>
      </header>

      <main className="max-w-5xl w-full px-4 flex flex-col gap-8">
        {!imageState.originalUrl ? (
          <section className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-dashed border-red-200 flex flex-col items-center text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6">
              <Upload className="text-red-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Commencez par importer une photo</h2>
            <p className="text-slate-500 mb-8 max-w-md">
              Choisissez une photo d'une personne, d'un animal ou d'un objet et laissez notre IA faire le reste.
            </p>
            <label className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2">
              <Upload size={20} />
              Choisir une image
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Control Panel */}
            <div className="flex flex-col gap-6 order-2 md:order-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Wand2 className="text-red-500" />
                  Options de modification
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Instructions pour l'IA</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none min-h-[120px] text-slate-700 resize-none transition-all"
                      placeholder="Ex: Ajoute un bonnet de Noël à tout le monde..."
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setPrompt('Ajoute un bonnet de Noël rouge et blanc festif sur la tête de la personne.')}
                      className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      🎅 Bonnet Classique
                    </button>
                    <button 
                      onClick={() => setPrompt('Ajoute un filtre vintage chaleureux de Noël et un bonnet sur le chien.')}
                      className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-100 hover:bg-green-100 transition-colors"
                    >
                      🐶 Noël pour Animaux
                    </button>
                    <button 
                      onClick={() => setPrompt('Ajoute de la neige qui tombe et un bonnet de Noël sur chaque personne.')}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      ❄️ Ambiance Neige
                    </button>
                  </div>

                  <button
                    onClick={handleApplyEdit}
                    disabled={status === AppStatus.LOADING}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 
                      ${status === AppStatus.LOADING ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:scale-[1.02]'}`}
                  >
                    {status === AppStatus.LOADING ? (
                      <>
                        <RefreshCcw className="animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles />
                        Appliquer la Magie
                      </>
                    )}
                  </button>

                  <button
                    onClick={reset}
                    className="w-full py-3 text-slate-500 font-medium hover:text-red-600 transition-colors"
                  >
                    Changer d'image
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-bounce">
                  <AlertCircle className="shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="flex flex-col gap-6 order-1 md:order-2">
              <div className="bg-white p-2 rounded-2xl shadow-xl overflow-hidden relative group">
                {status === AppStatus.LOADING && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center">
                    <div className="relative">
                        <RefreshCcw size={64} className="text-red-600 animate-spin mb-4" />
                        <Sparkles className="absolute top-0 right-0 text-yellow-400 animate-pulse" />
                    </div>
                    <p className="text-xl font-bold text-slate-800 mb-2">L'IA déballe votre cadeau...</p>
                    <p className="text-slate-500 text-sm">Cela peut prendre quelques secondes pour que les lutins finissent le travail.</p>
                  </div>
                )}
                
                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
                  {imageState.editedUrl ? (
                    <img src={imageState.editedUrl} alt="Résultat" className="w-full h-full object-contain" />
                  ) : (
                    <img src={imageState.originalUrl} alt="Original" className="w-full h-full object-contain" />
                  )}

                  {imageState.editedUrl && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-fade-in">
                      Édité par IA
                    </div>
                  )}
                </div>

                {imageState.editedUrl && (
                  <div className="p-4 flex gap-4">
                    <button
                      onClick={downloadImage}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Download size={20} />
                      Télécharger
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center text-xs text-slate-400 font-medium px-2">
                <p>Propulsé par Gemini 2.5 Flash Image</p>
                <p>Gratuit et instantané</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-auto pt-20 text-center text-slate-400 text-sm w-full px-4">
        <p>© 2024 Atelier de Noël IA - Joyeuses Fêtes !</p>
      </footer>
    </div>
  );
};

export default App;

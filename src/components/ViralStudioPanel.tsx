import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Video,
  Play,
  Flame,
  Calendar,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Share2,
  FileText,
  Lightbulb,
  CheckSquare,
  Square,
  RefreshCw,
  Smartphone,
} from 'lucide-react';

interface ViralProductTemplate {
  id: string;
  name: string;
  angleTitle: string;
  problem: string;
  hookHeadline: string;
  inVideoPrompt: string;
  capCutScript: string;
  communityScript: string;
}

const VIRAL_TEMPLATES: ViralProductTemplate[] = [
  {
    id: 'cloud9-bed',
    name: 'The Cloud9™ Orthopedic Calming Pet Bed',
    angleTitle: '⚡ Tempestades, Trovões e Fogos de Artifício (Alta Conversão)',
    problem: 'Cães tremendo, ofegantes e com pânico de ruídos altos',
    hookHeadline: '"Stop locking your dog in the bathroom during storms..."',
    inVideoPrompt: `Create a 30-second TikTok viral UGC video for an American dog brand called Ling Petshop.
Topic: How to stop a dog from shaking and panting during sudden thunderstorms and fireworks.
Target Audience: US dog parents who hate seeing their pets anxious.
Product Featured: The Cloud9 Orthopedic Calming Pet Bed with a 7-inch raised bolster that mimics a mother's embrace to relieve joint stress and anxiety.
Tone: Empathetic, urgent, veterinarian-approved, conversational.
Voiceover: Natural friendly American female voice, warm and caring tone.
Visuals: Fast-paced vertical 9:16 clips of nervous dogs comforting themselves in luxury cozy orthopedic beds in bright modern homes, close-ups of soft plush textures, thunderstorm outside window.
Subtitles: Dynamic bold yellow and white TikTok-style animated word-by-word captions.
Ending Call to Action: "Save 20% off your first US order with code LING20. Link in bio!"`,
    capCutScript: `Scene 1 (0-3s): Stop locking your dog in the bathroom when it storms.
Scene 2 (4-12s): If your dog shakes and pants during thunder or fireworks, traditional flat beds actually spike their cortisol.
Scene 3 (13-22s): The Cloud9 bed has a 7-inch raised orthopedic rim that mimics a mother's embrace, instantly lowering heart rate and soothing their spine.
Scene 4 (23-30s): Over 3,000 US pups sleep right through storms now. Tap the link in bio and use code LING20 for 20% off with 2-4 day US delivery!`,
    communityScript: `Hey! I went through this exact same nightmare with my Golden Retriever every single thunderstorm season in South Florida. Melatonin alone wasn't enough. What made the biggest difference was switching his crate bed to an orthopedic donut bed with a raised 7-inch bolster (we got the Cloud9 bed from Ling Petshop). The rim surrounds their neck and gives them that deep pressure feeling like they are sleeping against their mother. He actually slept through a 2 AM storm last week for the first time in years. Hope this helps your pup!`,
  },
  {
    id: 'aquapure-fountain',
    name: 'AquaPure™ Ultra-Quiet Wireless Pet Fountain',
    angleTitle: '💧 Saúde Renal & Gatos que Bebem Pouca Água',
    problem: 'Gatos com risco de infecção urinária e água parada com bactérias',
    hookHeadline: '"Vets are begging cat owners to throw away traditional water bowls..."',
    inVideoPrompt: `Create a 30-second TikTok viral UGC product video for Ling Petshop.
Topic: Why traditional water bowls cause dehydration and feline kidney issues, and why cats only drink flowing water.
Target Audience: American cat moms and cat dads in modern apartments.
Product Featured: The AquaPure Ultra-Quiet Wireless Induction Pet Fountain with medical grade 304 stainless steel basin and 4-stage active carbon filter.
Tone: Educational, surprising, satisfying, clean aesthetic.
Voiceover: Clear conversational American young adult voice.
Visuals: Vertical 9:16 footage showing crystal-clear oxygenated bubbling water, cute cat happily drinking with ears perked up, whisper-quiet motor demo, easy one-lift wireless cleaning basin.
Subtitles: Bold TikTok captions with green accent highlights.
Ending Call to Action: "Protect their kidney health. Get 20% off with code LING20 in bio!"`,
    capCutScript: `Scene 1 (0-3s): Vets are begging cat owners to throw away traditional water bowls.
Scene 2 (4-12s): In the wild, cats instinctively avoid stagnant water because it harbors bacteria. That's why your cat begs for running sink faucets!
Scene 3 (13-22s): AquaPure delivers continuous bubbling spring water through medical-grade stainless steel with zero exposed cords. It's whisper quiet under 20 decibels.
Scene 4 (23-30s): Keep their kidneys healthy for life. Ships from US warehouses in 2-4 days. Use code LING20 for 20% off in bio!`,
    communityScript: `Our vet warned us our cat was borderline dehydrated because she refused to touch standing bowl water. We switched to the AquaPure wireless fountain from Ling Petshop and she started drinking 3x more water on day one. It's whisper silent and has a 304 stainless basin so it prevents chin acne. Highly recommend testing a flowing fountain if your kitty is stubborn!`,
  },
  {
    id: 'airglide-harness',
    name: 'AirGlide™ Zero-Pull Ergonomic Dog Harness',
    angleTitle: '🦮 Passeios Sem Puxar & Proteção da Traqueia',
    problem: 'Cães que puxam a guia até tossir e machucar os ombros do tutor',
    hookHeadline: '"If your dog walks YOU instead of you walking them, watch this..."',
    inVideoPrompt: `Create a 30-second TikTok viral product video for Ling Petshop US.
Topic: How to instantly stop dog leash pulling without choke collars or pain.
Target Audience: US dog owners struggling with strong pullers on neighborhood walks.
Product Featured: The AirGlide Zero-Pull Ergonomic Harness with front-chest clip steering and breathable honeycomb mesh padding.
Tone: High energy, relatable, before-and-after transformation.
Voiceover: Enthusiastic friendly American voice.
Visuals: Vertical 9:16 video starting with dog pulling hard, then clipping leash to the front chest ring of the AirGlide harness, instant relaxed loose-leash walking, reflective night stitching glowing under headlights.
Subtitles: High-contrast yellow and white animated captions.
Ending Call to Action: "Enjoy walks again. Ships in 24h via USPS. Save 20% with code LING20 in bio!"`,
    capCutScript: `Scene 1 (0-3s): If your dog walks you instead of you walking them, watch this.
Scene 2 (4-11s): Traditional collars put 100% of the strain directly on your dog's sensitive trachea and cause permanent coughing damage.
Scene 3 (12-21s): The AirGlide harness uses a patented front-clip steering ring. The second they try to lunge forward, it gently redirects their shoulders back toward you without any choking.
Scene 4 (22-30s): Walks are finally peaceful again. Backed by a 30-day trial and 2-4 day US delivery. Code LING20 saves you 20% in bio!`,
    communityScript: `I used to dread 6 AM walks because my 70 lb Lab would yank my shoulder so hard it ached. The front-clip on the AirGlide harness completely rewired his brain on day one. Whenever he lunges, his momentum just turns him back towards me with zero choking. Game changer for strong pullers!`,
  },
  {
    id: 'chomroller',
    name: 'ChomRoller™ Reusable Electrostatic Pet Hair Tool',
    angleTitle: '✨ Satisfação Visual Absoluta (TikTok Viral)',
    problem: 'Sofá, tapetes e bancos do carro cobertos de pelos difíceis de tirar',
    hookHeadline: '"I threw away all my sticky tape rollers after buying this..."',
    inVideoPrompt: `Create a 30-second oddly satisfying TikTok viral cleaning video for Ling Petshop.
Topic: Deep cleaning embedded dog and cat hair from couches and car seats with zero sticky paper refills.
Target Audience: Pet parents sick of fur covered furniture and vacuuming daily.
Product Featured: ChomRoller Electrostatic Reusable Pet Hair Removal Roller with one-touch trap door.
Tone: Satisfying, punchy, problem-solving, clean aesthetic.
Voiceover: Upbeat natural American voice with subtle ASMR clean vibe.
Visuals: Close-up vertical 9:16 video rolling back and forth over a dark couch covered in thick white pet hair, hair disappearing instantly like magic in one swipe, pressing button to open clean chamber packed with fur.
Subtitles: Bold punchy white captions with sound effects.
Ending Call to Action: "Buy once, use forever. 2-4 day US delivery. Use code LING20 for 20% off in bio!"`,
    capCutScript: `Scene 1 (0-3s): I threw away all my sticky lint rollers after finding this on TikTok.
Scene 2 (4-11s): Sticky sheets run out in two days and vacuums can't lift hair embedded deep in sofa fibers.
Scene 3 (12-21s): Just roll the ChomRoller back and forth. The electrostatic silicone blade sweeps 100% of embedded fur straight into the sealed trap chamber.
Scene 4 (22-30s): Click the back button and dump it right in the trash. No sticky refills ever again. Ships in 24h from US hubs. Code LING20 in bio!`,
    communityScript: `If you have heavy shedders like Huskies or Goldens, stop wasting money on sticky roller sheets. The ChomRoller from Ling Petshop uses electrostatic friction and it cleans our entire velvet couch in 45 seconds flat with a pop-open chamber. Best $17 I ever spent for our house!`,
  },
];

export const ViralStudioPanel: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ViralProductTemplate>(VIRAL_TEMPLATES[0]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Daily checklist state stored in localStorage
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ling_launch_days');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleDay = (key: string) => {
    setCompletedDays((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('ling_launch_days', JSON.stringify(next));
      return next;
    });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const igBioText = `🐾 Orthopedic comfort for anxious pets\n🇺🇸 Fast 2-4 day US dispatch\n🛡️ 30-day risk-free trial\n🎁 20% OFF code: LING20 👇`;
  const ttBioText = `Calming orthopedic pet gear 🐾\nShips in 24h across the US 🇺🇸\nCode: LING20 👇`;
  const logoPromptText = `Vector flat minimalist logo for an upscale modern American pet brand named "LING PETSHOP". The design must feature a clean, elegant geometric dog and cat silhouette softly embracing or a subtle paw integrated into an architectural modern sanctuary arch. Color palette: Deep Royal Navy Blue (#0F2942) and Vibrant Cobalt Blue (#2563EB) on a pure solid white background (#FFFFFF). Swiss modernist graphic design style, ultra-clean lines, balanced negative space, premium luxury DTC pet brand aesthetic like Aesop or Ling Petshop. No realistic photography, no 3D bevels, no drop shadows, no colorful gradients, no clip art, no cluttered text outside the brand name. Centered, isolated vector icon with modern sans-serif typography "LING PETSHOP" below.`;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0F2942] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-blue-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles size={13} />
              <span>OPERAÇÃO ORGÂNICA DOS ESTADOS UNIDOS · CUSTO R$ 0,00</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-serif">
              Viral Studio & Kit de Lançamento de Alta Conversão
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed font-light">
              Aqui está todo o arsenal para você fazer as primeiras vendas em <strong>dólares (USD)</strong> sem gastar com anúncios pagos e sem precisar de editor de vídeo. Use as ferramentas de IA de 1 clique, copie as bios testadas e execute o cronograma.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#0A192F]/80 p-4 rounded-2xl border border-blue-900/60 text-xs flex-shrink-0">
            <div>
              <span className="text-[10px] text-blue-300 uppercase tracking-wider block">Custo de Tráfego</span>
              <strong className="text-emerald-400 text-sm font-black">$0.00 USD</strong>
            </div>
            <div>
              <span className="text-[10px] text-blue-300 uppercase tracking-wider block">Lucro Médio/Venda</span>
              <strong className="text-amber-300 text-sm font-black">+$29.50 USD</strong>
            </div>
            <div>
              <span className="text-[10px] text-blue-300 uppercase tracking-wider block">Tempo Médio 1ª Venda</span>
              <strong className="text-white text-xs font-bold">6 a 12 dias</strong>
            </div>
            <div>
              <span className="text-[10px] text-blue-300 uppercase tracking-wider block">Meta Diária</span>
              <strong className="text-white text-xs font-bold">3 vídeos / dia</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bios Exatas com Contagem de Caracteres (Instagram & TikTok) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs space-y-5">
        <div>
          <h3 className="text-lg font-bold text-[#0F2942] font-serif flex items-center gap-2">
            <Smartphone className="text-[#2563EB]" size={18} />
            <span>1. Perfis Oficiais Prontos para Copiar (Instagram & TikTok)</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-1 font-light">
            Textos calibrados exatamente abaixo do limite estrito de caracteres de cada rede social para nunca cortar sua bio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Instagram Card */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                  Instagram (@lingpetshop.us)
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {igBioText.length} / 150 caracteres (✓ Aprovado)
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-[#475569]">
                <p>
                  <strong>Nome (Name):</strong> Ling Petshop | Dog Calm 🐾 <span className="text-[#94A3B8]">(26/30)</span>
                </p>
                <div className="p-3 bg-white rounded-xl border border-[#CBD5E1] font-mono text-xs text-[#0F2942] whitespace-pre-line leading-relaxed">
                  {igBioText}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(igBioText, 'ig-bio')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {copiedKey === 'ig-bio' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedKey === 'ig-bio' ? 'Bio do Instagram Copiada!' : 'Copiar Bio do Instagram'}</span>
            </button>
          </div>

          {/* TikTok Card */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                  TikTok (@lingpetshop.us)
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {ttBioText.length} / 80 caracteres (✓ Aprovado)
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-[#475569]">
                <p>
                  <strong>Nome (Nickname):</strong> Ling Petshop US 🐾 <span className="text-[#94A3B8]">(18/30)</span>
                </p>
                <div className="p-3 bg-white rounded-xl border border-[#CBD5E1] font-mono text-xs text-[#0F2942] whitespace-pre-line leading-relaxed">
                  {ttBioText}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(ttBioText, 'tt-bio')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {copiedKey === 'tt-bio' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedKey === 'tt-bio' ? 'Bio do TikTok Copiada!' : 'Copiar Bio do TikTok'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Prompt Oficial do Logotipo para ChatGPT (DALL-E 3) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#0F2942] font-serif flex items-center gap-2">
              <Sparkles className="text-amber-500" size={18} />
              <span>2. Prompt Exato para Gerar o Logotipo no ChatGPT (DALL-E 3)</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 font-light">
              Cole este comando em inglês no ChatGPT para gerar um logo vetor minimalista nas cores oficiais da marca.
            </p>
          </div>

          <button
            onClick={() => handleCopy(logoPromptText, 'logo-prompt')}
            className="py-2 px-4 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F2942] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto border border-[#CBD5E1]"
          >
            {copiedKey === 'logo-prompt' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedKey === 'logo-prompt' ? 'Prompt Copiado!' : 'Copiar Prompt do Logo'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#334155] leading-relaxed select-all">
          {logoPromptText}
        </div>
        <p className="text-[11px] text-[#64748B]">
          💡 <em>Dica:</em> Abra o ChatGPT (com GPT-4o ou DALL-E 3 habilitado), cole o texto acima e aperte Enter. Em 20 segundos ele cria a marca perfeita para a sua foto de perfil do Instagram e TikTok.
        </p>
      </div>

      {/* 4. Gerador de Vídeos 100% por IA (1-Clique sem Editor) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-2">
            <Video size={13} />
            <span>Vídeos Prontos Sem Precisar Editar</span>
          </div>
          <h3 className="text-xl font-bold text-[#0F2942] font-serif">
            3. Gerador de Prompts de 1-Clique para InVideo AI & CapCut
          </h3>
          <p className="text-xs text-[#64748B] mt-1 font-light max-w-3xl leading-relaxed">
            Selecione o produto abaixo para carregar o prompt exato. Ao colar no <strong>InVideo AI</strong> (invideo.io) ou na função <strong>Script to Video do CapCut</strong>, a IA monta o vídeo vertical (9:16) completo com cenas dinâmicas, voz de narrador americano e legendas animadas em menos de 60 segundos.
          </p>
        </div>

        {/* Product Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {VIRAL_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedProduct(tpl)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                selectedProduct.id === tpl.id
                  ? 'bg-[#0F2942] text-white shadow-md'
                  : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-80">{tpl.angleTitle}</div>
              <div className="text-xs font-bold mt-0.5">{tpl.name}</div>
            </button>
          ))}
        </div>

        {/* Selected Product Angles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left 7 Columns: InVideo AI Prompt Box */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0A192F] text-white border border-[#1E293B] shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Prompt Pronto para InVideo AI (invideo.io)
                  </span>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded-full">
                  1-Clique 100% IA
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block mb-1">
                  Gancho dos Primeiros 3 Segundos:
                </span>
                <p className="text-sm font-extrabold text-white font-serif italic mb-3">
                  {selectedProduct.hookHeadline}
                </p>

                <span className="text-[11px] text-blue-300 font-bold uppercase tracking-wider block mb-1">
                  Prompt Completo em Inglês (Cole no InVideo AI):
                </span>
                <div className="p-4 rounded-2xl bg-[#001830] border border-blue-900/60 font-mono text-xs text-blue-100 leading-relaxed max-h-56 overflow-y-auto select-all">
                  {selectedProduct.inVideoPrompt}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleCopy(selectedProduct.inVideoPrompt, `invideo-${selectedProduct.id}`)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {copiedKey === `invideo-${selectedProduct.id}` ? (
                  <Check size={15} className="text-emerald-400" />
                ) : (
                  <Copy size={15} />
                )}
                <span>
                  {copiedKey === `invideo-${selectedProduct.id}`
                    ? 'Prompt InVideo Copiado com Sucesso!'
                    : 'Copiar Prompt para InVideo AI'}
                </span>
              </button>

              <a
                href="https://invideo.io"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span>Abrir invideo.io</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Right 5 Columns: CapCut Script & Community Text */}
          <div className="lg:col-span-5 space-y-4">
            {/* CapCut Box */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider">
                  Roteiro Rápido para CapCut (Script to Video)
                </span>
                <button
                  onClick={() => handleCopy(selectedProduct.capCutScript, `capcut-${selectedProduct.id}`)}
                  className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Copy size={12} />
                  <span>{copiedKey === `capcut-${selectedProduct.id}` ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="text-xs text-[#475569] font-mono whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto p-2.5 bg-white rounded-xl border border-[#CBD5E1]">
                {selectedProduct.capCutScript}
              </div>
            </div>

            {/* Community Outreach Box */}
            <div className="p-5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#BFDBFE]">
                <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-[#2563EB]" />
                  <span>Script para Reddit / Facebook EUA</span>
                </span>
                <button
                  onClick={() => handleCopy(selectedProduct.communityScript, `comm-${selectedProduct.id}`)}
                  className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Copy size={12} />
                  <span>{copiedKey === `comm-${selectedProduct.id}` ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#334155] leading-relaxed italic bg-white p-2.5 rounded-xl border border-[#BFDBFE]">
                "{selectedProduct.communityScript}"
              </p>
              <p className="text-[10px] text-[#64748B]">
                Use este texto para responder posts de donos de pets perguntando como resolver o problema. É natural, empático e gera vendas sem parecer propaganda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Cronograma Interativo Dia a Dia (Do Zero à 1ª Venda) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-xs space-y-5">
        <div>
          <h3 className="text-lg font-bold text-[#0F2942] font-serif flex items-center gap-2">
            <Calendar className="text-[#2563EB]" size={18} />
            <span>4. Cronograma Interativo: Do Zero à Primeira Venda em Dólar</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5 font-light">
            Marque as tarefas diárias concluídas para manter a consistência algorítmica exigida pelo TikTok e Reels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              id: 'phase-1',
              title: 'Dias 1 a 3: Configuração & Aquecimento',
              tasks: [
                'Criar perfil com a bio calibrada e logo oficial',
                'Navegar 15 minutos na For You de pets dos EUA',
                'Postar os 3 primeiros vídeos de apresentação',
                'Fixar o cupom LING20 no comentário dos vídeos',
              ],
            },
            {
              id: 'phase-2',
              title: 'Dias 4 a 6: Consistência de 3 Vídeos/Dia',
              tasks: [
                'Gerar 3 vídeos por dia no InVideo AI / CapCut',
                'Postar às 9h, 14h e 19h no horário dos EUA (EST)',
                'Testar os ganchos da Cloud9 Bed e da AquaPure',
                'Responder comentários com vídeos complementares',
              ],
            },
            {
              id: 'phase-3',
              title: 'Dias 7 a 9: Tração Algorítmica',
              tasks: [
                'Identificar o vídeo com mais retenção (>1.000 views)',
                'Duplicar o estilo do gancho que mais prendeu público',
                'Comentar em 5 posts do Reddit (r/Dogtraining)',
                'Conferir cliques no link da loja na bio',
              ],
            },
            {
              id: 'phase-4',
              title: 'Dias 10 a 14: Primeira Venda em Dólar',
              tasks: [
                'Entrega algorítmica em escala (>20k visualizações)',
                'Receber primeira notificação de pedido pago no Stripe',
                'Avisar o agente do armazém para despacho imediato',
                'Comemorar os primeiros $29 a $40 USD de lucro limpo!',
              ],
            },
          ].map((col) => {
            const isDone = completedDays[col.id];
            return (
              <div
                key={col.id}
                onClick={() => toggleDay(col.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isDone
                    ? 'bg-[#F0FDF4] border-emerald-300 ring-1 ring-emerald-400'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
                    <span className="text-xs font-bold text-[#0F2942]">{col.title}</span>
                    {isDone ? (
                      <CheckSquare size={16} className="text-emerald-600" />
                    ) : (
                      <Square size={16} className="text-[#94A3B8]" />
                    )}
                  </div>

                  <ul className="space-y-2 text-[11px] text-[#475569]">
                    {col.tasks.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-[#2563EB] font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[10px] font-bold text-center">
                  <span className={isDone ? 'text-emerald-700' : 'text-[#64748B]'}>
                    {isDone ? '✓ Fase Concluída!' : 'Clique para marcar como concluído'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

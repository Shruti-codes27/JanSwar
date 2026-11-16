import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';

export default function DemoPromptPills({ currentState, onSelectPrompt }) {
  const samplePrompts = currentState?.sampleQueries || [
    "मुझे वृद्धावस्था पेंशन के नियम बताएं",
    "किसान सम्मान निधि योजना में 6000 रुपये कैसे मिलेंगे?",
    "आयुष्मान भारत 5 लाख मुफ्त इलाज कार्ड कैसे बनेगा?",
    "महिला एवं बालिका सशक्तिकरण की योजनाएं बताएं"
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
        <span>लोकप्रिय प्रश्न बोलें या चुनें (Quick Sample Questions for {currentState?.name || "India"}):</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-xs text-slate-800 hover:text-orange-950 font-medium transition-all shadow-sm hover:shadow text-left"
          >
            <Volume2 className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform shrink-0" />
            <span className="line-clamp-1">"{prompt}"</span>
          </button>
        ))}
      </div>
    </div>
  );
}

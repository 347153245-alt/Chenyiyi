
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Printer, ChevronUp, ChevronDown, RotateCcw, Save, Image as ImageIcon, MapPin, Clock, Info } from 'lucide-react';
import { MeetingInfo, AgendaItem, Officer, DayOfWeek, Month } from './types';
import { DEFAULT_AGENDA, DEFAULT_OFFICERS, DAYS, MONTHS, DATES } from './constants';

const TMLogo = () => (
  <svg viewBox="0 0 500 320" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-md">
    <defs>
      <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
        <stop offset="0%" stopColor="#007EB5" />
        <stop offset="70%" stopColor="#004165" />
        <stop offset="100%" stopColor="#002D45" />
      </radialGradient>
    </defs>
    <circle cx="250" cy="160" r="152" fill="#772432" />
    <circle cx="250" cy="160" r="144" fill="#F2DF74" />
    <circle cx="250" cy="160" r="140" fill="url(#globeGradient)" />
    <g stroke="white" strokeWidth="1" opacity="0.5" fill="none">
      <ellipse cx="250" cy="160" rx="45" ry="140" />
      <ellipse cx="250" cy="160" rx="95" ry="140" />
      <line x1="110" y1="160" x2="390" y2="160" />
      <path d="M135 90 Q 250 115 365 90" />
      <path d="M135 230 Q 250 205 365 230" />
    </g>
    <rect x="65" y="125" width="370" height="70" fill="white" stroke="#772432" strokeWidth="5" />
    <text x="250" y="158" fontFamily="Helvetica, Arial, sans-serif" fontSize="36" fill="#004165" textAnchor="middle" fontWeight="900" letterSpacing="-1">TOASTMASTERS</text>
    <text x="250" y="184" fontFamily="Helvetica, Arial, sans-serif" fontSize="19" fill="#772432" textAnchor="middle" letterSpacing="5" fontWeight="bold">INTERNATIONAL</text>
  </svg>
);

const App: React.FC = () => {
  const STORAGE_KEY = 'sttm-agenda-v38-print-optimized';
  const introRef = useRef<HTMLTextAreaElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const [info, setInfo] = useState<MeetingInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '-info');
    return saved ? JSON.parse(saved) : {
      meetingNumber: '258',
      theme: 'Step Out of Comfort Zone',
      introduction: 'Great things never came from comfort zones. Let us explore our potential together in this wonderful meeting session.',
      day: DayOfWeek.Monday,
      month: Month.January,
      date: '1',
      time: '14:30',
      location: '汕头市龙湖区梅溪西路2号知书空间',
      locationEn: 'Zhishu Space, Meixi West Road No. 2',
      wordOfTheDay: 'RESILIENCE',
      logoUrl: '' 
    };
  });

  const [agenda, setAgenda] = useState<AgendaItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '-agenda');
    return saved ? JSON.parse(saved) : DEFAULT_AGENDA;
  });

  const [officers, setOfficers] = useState<Officer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '-officers');
    return saved ? JSON.parse(saved) : DEFAULT_OFFICERS;
  });

  const [reminders] = useState<string[]>([
    'Please turn off your mobile phone or turn it into silent mode!',
    'Do not talk about topics of Politics, Religion or Sex!',
    'Do not walk around when speakers present their speeches!',
    'Remember to bring your manuals and get project credits!'
  ]);

  useEffect(() => {
    if (introRef.current) {
      handleAutoHeight(introRef.current);
    }
  }, [info.introduction]);

  const handleAutoHeight = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  const addMinutes = (timeStr: string, minutesToAdd: string): string => {
    const parts = (timeStr || "14:30").split(':').map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return timeStr;
    const [hours, minutes] = parts;
    let mins = parseFloat(minutesToAdd.replace(/[^0-9.]/g, '')) || 0;
    const date = new Date();
    date.setHours(hours, minutes + Math.round(mins), 0);
    return date.toTimeString().slice(0, 5);
  };

  const computedAgenda = useMemo(() => {
    let currentTime = info.time || "14:30";
    return agenda.map((item) => {
      const itemStartTime = currentTime;
      if (!item.isSectionHeader && item.duration) {
        currentTime = addMinutes(currentTime, item.duration);
      }
      return { ...item, calculatedTime: itemStartTime };
    });
  }, [agenda, info.time]);

  const handleSaveData = () => {
    localStorage.setItem(STORAGE_KEY + '-info', JSON.stringify(info));
    localStorage.setItem(STORAGE_KEY + '-agenda', JSON.stringify(agenda));
    localStorage.setItem(STORAGE_KEY + '-officers', JSON.stringify(officers));
    alert('保存成功！');
  };

  const handlePrint = () => window.print();

  const handleSaveImage = async () => {
    if (!paperRef.current) return;
    try {
      window.scrollTo(0, 0);
      // @ts-ignore
      const canvas = await html2canvas(paperRef.current, {
        scale: 4, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 793, 
        height: 1123,
      });
      const link = document.createElement('a');
      link.download = `STTM-Agenda-M${info.meetingNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('生成图片失败');
    }
  };

  const handleReset = () => {
    if (confirm('确认清空所有数据并重置？')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const updateAgendaItem = (id: string, field: keyof AgendaItem, value: any) => {
    setAgenda(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addAgendaItemAt = (index: number, isHeader: boolean = false) => {
    const newItem: AgendaItem = {
      id: Math.random().toString(36).substr(2, 9),
      time: '', 
      activity: isHeader ? 'NEW SESSION' : 'New Activity',
      role: '',
      duration: isHeader ? '' : '5m',
      isSectionHeader: isHeader
    };
    const newAgenda = [...agenda];
    newAgenda.splice(index, 0, newItem);
    setAgenda(newAgenda);
  };

  const deleteAgendaItem = (id: string) => {
    setAgenda(prev => prev.filter(item => item.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newAgenda = [...agenda];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newAgenda.length) {
      [newAgenda[index], newAgenda[targetIndex]] = [newAgenda[targetIndex], newAgenda[index]];
      setAgenda(newAgenda);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center py-4 md:py-8 px-0 md:px-4 font-sans overflow-x-hidden">
      
      {/* Action Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t p-3 flex justify-around md:static md:bg-transparent md:border-none md:p-0 md:flex-row md:mb-6 md:gap-4 no-print z-50 shadow-2xl md:shadow-none">
        <button onClick={handlePrint} className="bg-[#772432] text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm hover:brightness-110 transition-all"><Printer size={16}/> 打印</button>
        <button onClick={handleSaveImage} className="bg-[#004165] text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm hover:brightness-110 transition-all"><ImageIcon size={16}/> 图片</button>
        <button onClick={handleSaveData} className="bg-emerald-600 text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm hover:brightness-110 transition-all"><Save size={16}/> 保存</button>
        <button onClick={handleReset} className="bg-white text-[#772432] border-2 border-[#772432] px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm hover:bg-gray-50 transition-all"><RotateCcw size={16}/> 重置</button>
      </div>

      {/* Main A4 Paper Area */}
      <div 
        ref={paperRef}
        className="bg-white w-[210mm] h-[297mm] p-8 md:p-10 pb-8 shadow-2xl print-container relative flex flex-col border-t-[14px] border-[#772432] box-border overflow-hidden"
      >
        
        {/* TOP HEADER */}
        <div className="flex justify-between items-start mb-2.5 gap-6 shrink-0 border-b-2 border-gray-100 pb-2.5">
          <div className="w-40 shrink-0">
             <TMLogo />
          </div>
          <div className="flex-grow flex flex-col items-end">
            <h2 className="text-4xl font-black text-[#004165] tracking-[0.1em] mb-1 leading-none">汕头国际演讲俱乐部</h2>
            <div className="flex items-center gap-3 w-full justify-end mt-1">
              <div className="h-[1.5px] bg-[#772432]/30 flex-grow"></div>
              <h1 className="text-sm font-black text-[#772432] uppercase italic tracking-[0.05em] whitespace-nowrap leading-none">ShanTou Toastmasters</h1>
              <div className="h-[1.5px] bg-[#772432]/30 flex-grow"></div>
              <div className="flex items-baseline gap-1.5 bg-[#772432] px-3 py-1 rounded shadow-sm shrink-0">
                <span className="text-[10px] font-black text-white italic leading-none uppercase tracking-wider">Meeting#</span>
                <input className="text-xl font-black text-[#F2DF74] w-12 bg-transparent outline-none leading-none text-center" value={info.meetingNumber} onChange={e => setInfo({...info, meetingNumber: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* Theme and Introduction */}
        <div className="flex flex-col gap-1 mb-1.5 shrink-0">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-black text-[#004165] shrink-0 uppercase italic tracking-wider leading-none">Theme:</span>
            <input className="text-2xl font-black text-[#772432] bg-transparent outline-none flex-grow border-b border-dashed border-gray-200 focus:border-[#772432] px-2 italic leading-none pb-0.5" value={info.theme} onChange={e => setInfo({...info, theme: e.target.value})} placeholder="Theme..." />
          </div>
          <div className="bg-[#772432]/5 px-3 py-1 rounded-lg border-l-4 border-[#772432] flex items-start gap-2">
             <Info className="text-[#772432] shrink-0 mt-0.5" size={14} />
             <textarea 
              ref={introRef} 
              rows={1}
              className="text-[14px] font-bold text-gray-700 bg-transparent outline-none flex-grow italic leading-snug resize-none overflow-hidden" 
              value={info.introduction} 
              onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)}
              onChange={e => setInfo({...info, introduction: e.target.value})} 
              placeholder="Introduction..."
            />
          </div>
        </div>

        {/* TWO-COLUMN CONTENT AREA - VERTICALLY OPTIMIZED */}
        <div className="flex-grow flex gap-6 overflow-hidden min-h-0">
          
          {/* LEFT MAIN AGENDA (63%) */}
          <div className="w-[63%] flex flex-col border-r-2 border-dashed border-gray-100 pr-3 overflow-hidden">
            
            <div className="flex items-center px-2 mb-1 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-[#004165]/10 pb-0.5 shrink-0">
              <div className="w-12 text-center">Time</div>
              <div className="flex-grow px-2">Activity</div>
              <div className="w-28 px-2 text-right">Role</div>
              <div className="w-8 text-right">Dur.</div>
            </div>

            <div className="flex-grow space-y-0 relative bg-amber-50/5 rounded-xl overflow-y-auto no-scrollbar">
              {computedAgenda.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="h-0.5 relative group/plus no-print shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/plus:opacity-100 transition-all z-50 scale-75">
                      <div className="flex gap-2">
                        <button onClick={() => addAgendaItemAt(index)} className="bg-[#004165] text-white p-0.5 rounded-full shadow flex items-center gap-1 px-1.5 text-[7px] font-bold"><Plus size={8}/> Item</button>
                        <button onClick={() => addAgendaItemAt(index, true)} className="bg-[#772432] text-white p-0.5 rounded-full shadow flex items-center gap-1 px-1.5 text-[7px] font-bold"><Plus size={8}/> Sec</button>
                      </div>
                    </div>
                  </div>

                  <div className={`group relative transition-all duration-150 ${item.isSectionHeader ? 'my-0.5' : ''} shrink-0`}>
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 no-print flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg rounded p-0.5 border border-gray-100 z-40">
                      <button onClick={() => moveItem(index, 'up')} className="p-0.5 hover:bg-gray-100 rounded text-[#004165]"><ChevronUp size={10}/></button>
                      <button onClick={() => moveItem(index, 'down')} className="p-0.5 hover:bg-gray-100 rounded text-[#004165]"><ChevronDown size={10}/></button>
                      <button onClick={() => deleteAgendaItem(item.id)} className="p-0.5 hover:bg-red-50 rounded text-red-600"><Trash2 size={10}/></button>
                    </div>

                    {item.isSectionHeader ? (
                      <div className="bg-[#772432] text-white px-2 py-0.5 font-black uppercase tracking-widest text-[9px] rounded shadow-sm flex items-center border-l-4 border-[#F2DF74]">
                        <input className="bg-transparent border-none outline-none w-full text-center placeholder:text-white/50" value={item.activity} onChange={e => updateAgendaItem(item.id, 'activity', e.target.value)} />
                      </div>
                    ) : (
                      <div className="flex items-start border-b border-gray-50 py-0.5 hover:bg-white transition-all overflow-hidden">
                        <div className="w-12 font-black text-[#004165] text-[10px] text-center mt-0.5 shrink-0">
                          {index === 0 ? (
                            <input className="w-full bg-transparent outline-none text-center font-black text-[#772432]" value={info.time} onChange={e => setInfo({...info, time: e.target.value})} />
                          ) : (
                            item.calculatedTime
                          )}
                        </div>
                        <div className="flex-grow px-2 overflow-hidden min-w-0">
                          <textarea rows={1} className="w-full bg-transparent outline-none font-bold text-gray-800 text-[11px] resize-none overflow-hidden block leading-tight pb-0.5" value={item.activity} onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)} onChange={e => updateAgendaItem(item.id, 'activity', e.target.value)} />
                        </div>
                        <div className="w-28 px-1 text-right shrink-0 overflow-hidden min-w-0">
                          <textarea rows={1} className="w-full bg-transparent outline-none text-[11px] font-black text-[#772432] text-right italic resize-none overflow-hidden block pb-0.5 leading-tight" value={item.role} onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)} onChange={e => updateAgendaItem(item.id, 'role', e.target.value)} placeholder="..." />
                        </div>
                        <div className="w-8 text-right font-black text-gray-400 text-[9px] mt-0.5 shrink-0">
                          <input className="w-full bg-transparent outline-none text-right" value={item.duration} onChange={e => updateAgendaItem(item.id, 'duration', e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* CLUB MISSION - MOVED UP */}
            <div className="mt-1.5 pt-2 pb-1.5 text-center border-t-2 border-[#F2DF74]/30 shrink-0">
               <h3 className="text-[#004165] font-black italic text-[12px] uppercase mb-0.5 tracking-[0.2em]">Club Mission</h3>
               <p className="text-[#004165] font-black text-[10.5px] leading-relaxed italic opacity-95 px-4">
                 "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth."
               </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR (37%) - REFINED VERTICAL FLOW */}
          <div className="w-[37%] flex flex-col gap-2 overflow-hidden">
            
            {/* 1. Time & Venue */}
            <div className="bg-gray-50/50 p-2 rounded-xl border border-gray-100 shadow-inner shrink-0">
              <div className="flex items-center gap-1.5 text-[#004165] font-black border-b border-[#004165]/10 pb-0.5 mb-1">
                <Clock size={12}/> <span className="text-[9px] tracking-widest uppercase">Time & Venue</span>
              </div>
              <div className="text-[9px] font-black text-gray-700 space-y-0.5">
                <div className="flex gap-1 bg-white p-0.5 rounded-md border border-gray-100 shadow-sm">
                  <select value={info.day} onChange={e => setInfo({...info, day: e.target.value})} className="bg-transparent border-none p-0 focus:ring-0 appearance-none flex-grow text-center text-[12px] font-black">{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <select value={info.month} onChange={e => setInfo({...info, month: e.target.value})} className="bg-transparent border-none p-0 focus:ring-0 appearance-none flex-grow text-center text-[12px] font-black">{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                  <select value={info.date} onChange={e => setInfo({...info, date: e.target.value})} className="bg-transparent border-none p-0 focus:ring-0 appearance-none flex-grow text-center text-[12px] font-black">{DATES.map(d => <option key={d} value={d}>{d}</option>)}</select>
                </div>
                <div className="flex items-center justify-center bg-[#772432] text-white py-0.5 rounded-md shadow-sm">
                  <input className="bg-transparent outline-none w-20 font-black text-center text-2xl leading-none" value={info.time} onChange={e => setInfo({...info, time: e.target.value})} />
                </div>
              </div>
              <div className="text-[12px] leading-tight font-bold text-gray-800 space-y-0.5 mt-1">
                <textarea className="w-full bg-transparent outline-none resize-none overflow-hidden p-0 border-none focus:ring-0 font-black leading-tight" rows={1} value={info.location} onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)} onChange={e => setInfo({...info, location: e.target.value})} />
                <textarea className="w-full bg-transparent outline-none resize-none overflow-hidden p-0 border-none focus:ring-0 text-[#004165] text-[10px] uppercase font-black italic opacity-60 leading-tight" rows={1} value={info.locationEn} onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)} onChange={e => setInfo({...info, locationEn: e.target.value})} />
              </div>
            </div>

            {/* 2. Word of the Day */}
            <div className="bg-[#004165] text-white px-2.5 py-1 rounded-xl border-b-4 border-[#F2DF74] shadow-md shrink-0">
               <span className="text-[8px] font-black text-white/70 uppercase block mb-0.5 tracking-widest leading-none">Word of the Day</span>
               <input className="w-full bg-transparent outline-none text-xl font-black text-[#F2DF74] italic uppercase tracking-[0.05em] text-center leading-none" value={info.wordOfTheDay} onChange={e => setInfo({...info, wordOfTheDay: e.target.value})} />
            </div>

            {/* 3. Time Rule */}
            <div className="border border-blue-100 rounded-xl overflow-hidden shadow-sm shrink-0 bg-white">
              <div className="bg-[#e1f5fe] px-3 py-1 border-b border-blue-100">
                <h3 className="font-bold italic text-base text-[#004165] leading-none">Time Rule</h3>
              </div>
              <table className="w-full text-left text-[11px] font-bold border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/30">
                    <th className="px-2 py-0.5 text-[#004165]">Type</th>
                    <th className="px-1 py-0.5 text-[#004165]">Short</th>
                    <th className="px-1 py-0.5 text-[#004165]">Long</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="bg-[#ccff00] px-2 py-0.5 leading-none text-black">Green</td>
                    <td className="px-1 py-0.5 leading-none">1m left</td>
                    <td className="px-1 py-0.5 leading-none">2m left</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="bg-yellow-400 px-2 py-0.5 leading-none text-black">Yellow</td>
                    <td className="px-1 py-0.5 leading-none">0.5m left</td>
                    <td className="px-1 py-0.5 leading-none">1m left</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="bg-red-600 text-white px-2 py-0.5 leading-none">Red</td>
                    <td className="px-1 py-0.5 leading-none">Up</td>
                    <td className="px-1 py-0.5 leading-none">Up</td>
                  </tr>
                  <tr>
                    <td className="bg-gray-50 px-2 py-0.5 text-gray-600 leading-none">Grace</td>
                    <td className="px-1 py-0.5 leading-none">30s</td>
                    <td className="px-1 py-0.5 leading-none">30s</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Reminder */}
            <div className="border border-red-50 rounded-xl overflow-hidden shadow-sm shrink-0 flex flex-col bg-white">
              <div className="bg-[#fce4ec] px-3 py-1 border-b border-red-100">
                <h3 className="font-bold italic text-base text-[#772432] leading-none">Reminder</h3>
              </div>
              <div className="p-2 py-1 space-y-0.5 text-[10px] font-bold text-gray-800 leading-tight">
                {reminders.map((r, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="shrink-0 text-[#772432] font-black">{idx + 1}.</span>
                    <p className="flex-grow">{r}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Club Officers - MOVED UP */}
            <div className="mt-1 pt-1 shrink-0 overflow-hidden">
               <h3 className="text-[#004165] font-black italic text-[12px] uppercase mb-1 tracking-[0.1em] border-b-2 border-[#004165]/10 pb-0.5">Club Officers</h3>
               <div className="space-y-0.5">
                  {officers.map((off, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[9px] font-black border-b border-gray-50/50 pb-0.5 last:border-0">
                      <span className="text-gray-400 uppercase w-[50%] tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">{off.role}</span>
                      <input className="bg-transparent outline-none text-[#772432] text-right w-[50%] font-black border-none p-0 h-3 leading-none" value={off.name} onChange={e => {
                        const next = [...officers]; next[idx].name = e.target.value; setOfficers(next);
                      }} />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BRANDING - MOVED UP AND MADE MORE COMPACT */}
        <div className="mt-4 pt-2.5 border-t-2 border-[#F2DF74] flex flex-col items-center w-full shrink-0">
          <p className="text-[#004165] font-black text-[11px] tracking-[0.35em] uppercase leading-none mb-1 opacity-90">CONNECT • LEARN • GROW</p>
          <p className="text-[#772432] font-black text-[14px] tracking-[0.15em] uppercase leading-none mt-0.5 mb-2">粤东地区首家头马国际演讲俱乐部</p>
        </div>
      </div>
    </div>
  );
};

export default App;

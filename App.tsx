
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
  const STORAGE_KEY = 'sttm-agenda-v32-final';
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
      time: '02:30',
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

  const [reminders, setReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '-reminders');
    return saved ? JSON.parse(saved) : [
      'Please turn off your mobile phone or turn it into silent mode!',
      'Do not talk about topics of Politics, Religion or Sex!',
      'Do not walk around when speakers present their speeches!',
      'Remember to bring your manuals and get project credits!'
    ];
  });

  useEffect(() => {
    if (introRef.current) {
      handleAutoHeight(introRef.current);
    }
  }, [info.introduction]);

  const handleAutoHeight = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight + 4}px`;
  };

  const addMinutes = (timeStr: string, minutesToAdd: string): string => {
    const parts = (timeStr || "02:30").split(':').map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return timeStr;
    const [hours, minutes] = parts;
    let mins = parseFloat(minutesToAdd.replace(/[^0-9.]/g, '')) || 0;
    const date = new Date();
    date.setHours(hours, minutes + Math.round(mins), 0);
    return date.toTimeString().slice(0, 5);
  };

  const computedAgenda = useMemo(() => {
    let currentTime = info.time || "02:30";
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
    localStorage.setItem(STORAGE_KEY + '-reminders', JSON.stringify(reminders));
    alert('保存成功！');
  };

  const handlePrint = () => window.print();

  const handleSaveImage = async () => {
    if (!paperRef.current) return;
    try {
      window.scrollTo(0, 0);
      // @ts-ignore
      const canvas = await html2canvas(paperRef.current, {
        scale: 3, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (doc) => {
          const tas = doc.querySelectorAll('textarea');
          tas.forEach(ta => {
            ta.style.overflow = 'visible';
            ta.style.height = (ta.scrollHeight + 5) + 'px';
          });
        }
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
        <button onClick={handlePrint} className="bg-[#772432] text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm hover:brightness-110 active:scale-95 transition-all"><Printer size={16}/> 打印</button>
        <button onClick={handleSaveImage} className="bg-[#004165] text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm hover:brightness-110 active:scale-95 transition-all"><ImageIcon size={16}/> 图片</button>
        <button onClick={handleSaveData} className="bg-emerald-600 text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm hover:brightness-110 active:scale-95 transition-all"><Save size={16}/> 保存</button>
        <button onClick={handleReset} className="bg-white text-[#772432] border-2 border-[#772432] px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 font-bold text-sm hover:bg-gray-50 active:scale-95 transition-all"><RotateCcw size={16}/> 重置</button>
      </div>

      {/* Main A4 Paper Area */}
      <div 
        ref={paperRef}
        className="bg-white w-[210mm] min-h-[297mm] p-8 md:p-10 shadow-2xl print-container relative flex flex-col border-t-[14px] border-[#772432] box-border overflow-visible"
      >
        
        {/* TOP HEADER */}
        <div className="flex justify-between items-start mb-4 gap-6 shrink-0">
          <div className="w-40 shrink-0">
             <TMLogo />
          </div>
          <div className="text-right flex-grow">
            <h1 className="text-3xl font-black text-[#772432] uppercase tracking-tighter leading-none mb-1">ShanTou Toastmasters</h1>
            <div className="flex items-center justify-end gap-3 mt-1">
              <h2 className="text-3xl font-black text-[#004165] tracking-widest">汕头国际演讲俱乐部</h2>
              <div className="flex items-baseline gap-2 bg-[#772432] px-3 py-1 rounded shadow-md border-b-4 border-[#F2DF74]">
                <span className="text-base font-black text-white italic leading-none uppercase">Meeting #</span>
                <input className="text-2xl font-black text-[#F2DF74] w-16 bg-transparent outline-none leading-none border-b-2 border-[#F2DF74]/50 focus:border-[#F2DF74] text-center" value={info.meetingNumber} onChange={e => setInfo({...info, meetingNumber: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* Theme and Introduction Section */}
        <div className="flex flex-col gap-2 border-b-2 border-[#772432] pb-3 mb-4 shrink-0 overflow-visible">
          <div className="flex items-baseline gap-4">
            <span className="text-xl font-black text-[#004165] shrink-0 uppercase italic tracking-wider">Theme:</span>
            <input className="text-2xl font-black text-[#772432] bg-transparent outline-none flex-grow border-b border-dashed border-gray-200 focus:border-[#772432] px-2 italic" value={info.theme} onChange={e => setInfo({...info, theme: e.target.value})} placeholder="Input Meeting Theme..." />
          </div>
          <div className="relative mt-1 overflow-visible">
            <div className="bg-[#772432]/5 px-3 py-2 rounded-lg border-l-4 border-[#772432] flex items-start gap-3">
               <Info className="text-[#772432] shrink-0 mt-1" size={18} />
               <textarea 
                ref={introRef} 
                rows={1}
                className="text-lg font-bold text-gray-700 bg-transparent outline-none flex-grow italic leading-snug resize-none overflow-visible pb-1" 
                value={info.introduction} 
                onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)}
                onChange={e => setInfo({...info, introduction: e.target.value})} 
                placeholder="Input meeting introduction..."
              />
            </div>
          </div>
        </div>

        {/* TWO-COLUMN CONTENT AREA */}
        <div className="flex-grow flex gap-6 overflow-visible">
          
          {/* LEFT MAIN AGENDA (68%) */}
          <div className="w-[66%] flex flex-col border-r-2 border-dashed border-gray-100 pr-4 overflow-visible">
            
            <div className="flex items-center px-2 mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-[#004165]/10 pb-1 shrink-0">
              <div className="w-14 text-center">Time</div>
              <div className="flex-grow px-2">Activity</div>
              <div className="w-36 px-2 text-right">Role</div>
              <div className="w-10 text-right">Dur.</div>
            </div>

            <div className="flex-grow space-y-0 relative bg-amber-50/5 rounded-xl overflow-visible">
              {computedAgenda.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="h-1.5 relative group/plus no-print">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/plus:opacity-100 transition-all z-50 scale-75">
                      <div className="flex gap-2">
                        <button onClick={() => addAgendaItemAt(index)} className="bg-[#004165] text-white p-1 rounded-full shadow flex items-center gap-1 px-2 text-[8px] font-bold"><Plus size={8}/> 项目</button>
                        <button onClick={() => addAgendaItemAt(index, true)} className="bg-[#772432] text-white p-1 rounded-full shadow flex items-center gap-1 px-2 text-[8px] font-bold"><Plus size={8}/> 环节</button>
                      </div>
                    </div>
                  </div>

                  <div className={`group relative transition-all duration-150 ${item.isSectionHeader ? 'my-1.5' : ''} overflow-visible`}>
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 no-print flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg rounded p-0.5 border border-gray-100 z-40">
                      <button onClick={() => moveItem(index, 'up')} className="p-0.5 hover:bg-gray-100 rounded text-[#004165]"><ChevronUp size={12}/></button>
                      <button onClick={() => moveItem(index, 'down')} className="p-0.5 hover:bg-gray-100 rounded text-[#004165]"><ChevronDown size={12}/></button>
                      <button onClick={() => deleteAgendaItem(item.id)} className="p-0.5 hover:bg-red-50 rounded text-red-600"><Trash2 size={12}/></button>
                    </div>

                    {item.isSectionHeader ? (
                      <div className="bg-[#772432] text-white px-3 py-1 font-black uppercase tracking-widest text-xs rounded shadow flex items-center border-l-4 border-[#F2DF74]">
                        <input className="bg-transparent border-none outline-none w-full text-center placeholder:text-white/50" value={item.activity} onChange={e => updateAgendaItem(item.id, 'activity', e.target.value)} />
                      </div>
                    ) : (
                      <div className="flex items-start border-b border-gray-50 py-1 hover:bg-white transition-all overflow-visible">
                        <div className="w-14 font-black text-[#004165] text-xs text-center mt-1 shrink-0">
                          {index === 0 ? (
                            <input className="w-full bg-transparent outline-none text-center font-black text-[#772432] border-b border-[#772432]/10" value={info.time} onChange={e => setInfo({...info, time: e.target.value})} />
                          ) : (
                            item.calculatedTime
                          )}
                        </div>
                        <div className="flex-grow px-2 overflow-visible min-w-0">
                          <textarea rows={1} className="w-full bg-transparent outline-none font-bold text-gray-800 text-[13px] resize-none overflow-visible block leading-tight pb-0.5" value={item.activity} onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)} onChange={e => updateAgendaItem(item.id, 'activity', e.target.value)} />
                        </div>
                        <div className="w-36 px-1 text-right shrink-0 overflow-visible min-w-0">
                          <textarea rows={1} className="w-full bg-transparent outline-none text-[13px] font-black text-[#772432] text-right italic resize-none overflow-visible block pb-0.5" value={item.role} onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)} onChange={e => updateAgendaItem(item.id, 'role', e.target.value)} placeholder="..." />
                        </div>
                        <div className="w-10 text-right font-black text-gray-400 text-[10px] mt-1 shrink-0">
                          <input className="w-full bg-transparent outline-none text-right" value={item.duration} onChange={e => updateAgendaItem(item.id, 'duration', e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="no-print mt-3 flex gap-3 shrink-0">
              <button onClick={() => addAgendaItemAt(agenda.length)} className="flex-grow py-1.5 border border-dashed border-[#004165]/30 text-[#004165] rounded-lg font-black hover:bg-[#004165] hover:text-white transition-all text-[10px] uppercase tracking-widest">+ 项目</button>
              <button onClick={() => addAgendaItemAt(agenda.length, true)} className="flex-grow py-1.5 border border-dashed border-[#772432]/30 text-[#772432] rounded-lg font-black hover:bg-[#772432] hover:text-white transition-all text-[10px] uppercase tracking-widest">+ 环节</button>
            </div>

            <div className="mt-4 pt-4 pb-2 text-center border-t border-[#F2DF74]/30 shrink-0">
               <h3 className="text-[#004165] font-black italic text-sm uppercase mb-1 tracking-[0.2em]">Club Mission</h3>
               <p className="text-[#004165] font-black text-[12px] leading-snug italic opacity-95 px-4">
                 "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth."
               </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR (34%) */}
          <div className="w-[34%] flex flex-col gap-4 overflow-visible">
            
            {/* 1. Time & Venue */}
            <div className="space-y-2.5 bg-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-inner shrink-0">
              <div className="flex items-center gap-2 text-[#004165] font-black border-b border-[#004165]/10 pb-1">
                <Clock size={16}/> <span className="text-[11px] tracking-widest uppercase">Time & Venue</span>
              </div>
              <div className="text-xs font-black text-gray-700 space-y-1.5">
                <div className="flex gap-1 bg-white p-1 rounded-md border border-gray-50">
                  <select value={info.day} onChange={e => setInfo({...info, day: e.target.value})} className="bg-transparent border-none p-0.5 focus:ring-0 appearance-none flex-grow text-center">{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <select value={info.month} onChange={e => setInfo({...info, month: e.target.value})} className="bg-transparent border-none p-0.5 focus:ring-0 appearance-none flex-grow text-center">{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                  <select value={info.date} onChange={e => setInfo({...info, date: e.target.value})} className="bg-transparent border-none p-0.5 focus:ring-0 appearance-none flex-grow text-center">{DATES.map(d => <option key={d} value={d}>{d}</option>)}</select>
                </div>
                <div className="flex items-center justify-center bg-[#772432] text-white py-1 rounded-md shadow-sm">
                  <input className="bg-transparent outline-none w-20 font-black text-center text-lg" value={info.time} onChange={e => setInfo({...info, time: e.target.value})} />
                </div>
              </div>
              <div className="text-[12px] leading-snug font-bold text-gray-800 space-y-1 overflow-visible">
                <textarea className="w-full bg-transparent outline-none resize-none overflow-visible p-0 border-none focus:ring-0 font-black" rows={1} value={info.location} onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)} onChange={e => setInfo({...info, location: e.target.value})} />
                <textarea className="w-full bg-transparent outline-none resize-none overflow-visible p-0 border-none focus:ring-0 text-[#004165] text-[10px] uppercase font-black italic opacity-60 leading-tight" rows={1} value={info.locationEn} onInput={e => handleAutoHeight(e.target as HTMLTextAreaElement)} onChange={e => setInfo({...info, locationEn: e.target.value})} />
              </div>
            </div>

            {/* 2. Word of the Day */}
            <div className="bg-[#004165] text-white p-3 rounded-xl border-b-4 border-[#F2DF74] shadow-md shrink-0">
               <span className="text-[9px] font-black text-white/70 uppercase block mb-0.5 tracking-widest">Word of the Day</span>
               <input className="w-full bg-transparent outline-none text-xl font-black text-[#F2DF74] italic uppercase tracking-[0.1em] text-center" value={info.wordOfTheDay} onChange={e => setInfo({...info, wordOfTheDay: e.target.value})} />
            </div>

            {/* 3. Time Rule - Table Format as in Image */}
            <div className="border border-blue-200 rounded-xl overflow-hidden shadow-sm shrink-0">
              <div className="bg-[#e0f2f1] px-4 py-2 border-b border-blue-200">
                <h3 className="font-bold italic text-xl text-[#004165]">Time Rule</h3>
              </div>
              <table className="w-full text-left text-[11px] font-bold">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-3 py-1 text-[#004165]">Type</th>
                    <th className="px-2 py-1 text-[#004165]">Short Speech</th>
                    <th className="px-2 py-1 text-[#004165]">Long Speech</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="bg-[#bfff00] px-3 py-1">Green</td>
                    <td className="px-2 py-1">1 min left</td>
                    <td className="px-2 py-1">2 min left</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="bg-yellow-400 px-3 py-1">Yellow</td>
                    <td className="px-2 py-1">0.5 min left</td>
                    <td className="px-2 py-1">1 min left</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="bg-red-600 text-white px-3 py-1">Red</td>
                    <td className="px-2 py-1">Time is up</td>
                    <td className="px-2 py-1">Time is up</td>
                  </tr>
                  <tr>
                    <td className="bg-gray-100 px-3 py-1">Grace time</td>
                    <td className="px-2 py-1">30 sec</td>
                    <td className="px-2 py-1">30 sec</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Reminder - Header with Background as in Image */}
            <div className="border border-red-100 rounded-xl overflow-hidden shadow-sm shrink-0 flex flex-col">
              <div className="bg-[#fce4ec] px-4 py-2 border-b border-red-100">
                <h3 className="font-bold italic text-xl text-[#772432]">Reminder</h3>
              </div>
              <div className="p-4 space-y-2 text-[12px] font-bold text-gray-800 bg-white leading-snug">
                {reminders.map((r, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="shrink-0">{idx + 1}.</span>
                    <p className="flex-grow">{r}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Club Officers - Larger Font */}
            <div className="mt-auto pt-3 shrink-0 overflow-visible">
               <h3 className="text-[#004165] font-black italic text-[14px] uppercase mb-3 tracking-[0.1em] border-b-2 border-[#004165]/10 pb-1">Club Officers</h3>
               <div className="space-y-2">
                  {officers.map((off, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[12px] font-black border-b border-gray-50 pb-1">
                      <span className="text-gray-400 uppercase w-[50%] tracking-tighter">{off.role}</span>
                      <input className="bg-transparent outline-none text-[#772432] text-right w-[50%] overflow-visible border-b border-transparent focus:border-[#772432]/30 font-black" value={off.name} onChange={e => {
                        const next = [...officers]; next[idx].name = e.target.value; setOfficers(next);
                      }} />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BRANDING - Even Smaller Fonts */}
        <div className="mt-6 pt-3 border-t-2 border-[#F2DF74] flex flex-col items-center w-full shrink-0">
          <p className="text-[#004165] font-black text-base tracking-[0.35em] uppercase leading-none mb-1.5 opacity-90">CONNECT • LEARN • GROW</p>
          <p className="text-[#772432] font-black text-xl tracking-[0.15em] uppercase leading-none mt-1">粤东地区首家头马国际演讲俱乐部</p>
          <div className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-3 opacity-40 italic">
            Shantou Toastmasters Club • Professional Agenda Series
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

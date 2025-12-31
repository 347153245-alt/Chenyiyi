
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Printer, ChevronUp, ChevronDown, RotateCcw, Save, Quote, Image as ImageIcon, MapPin, Clock, PlusCircle } from 'lucide-react';
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
  const STORAGE_KEY = 'sttm-agenda-v20-ux-plus';
  const introRef = useRef<HTMLTextAreaElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const [info, setInfo] = useState<MeetingInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '-info');
    return saved ? JSON.parse(saved) : {
      meetingNumber: '42',
      theme: 'Dream Big',
      introduction: 'Great things never came from comfort zones. Today we explore how to step out and reach our true potential.',
      day: DayOfWeek.Monday,
      month: Month.January,
      date: '1',
      time: '19:30',
      location: '汕头市龙湖区梅溪西路2号知书空间',
      locationEn: 'Zhishu Space, Meixi West Road No. 2',
      wordOfTheDay: 'Excellence',
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

  const [timeRules, setTimeRules] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '-timerules');
    return saved ? JSON.parse(saved) : [
      '1 min left / 2 min left',
      '0.5 min left / 1 min left',
      'Time is Up - Wrap up!'
    ];
  });

  const [reminders, setReminders] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '-reminders');
    return saved ? JSON.parse(saved) : [
      '1. Cell phone: silent mode',
      '2. Attend the meeting on time',
      '3. No sex+ no politics+ no religion topic +no ads',
      '4. Shake hands on and off the stage'
    ];
  });

  useEffect(() => {
    if (introRef.current) {
      introRef.current.style.height = 'auto';
      introRef.current.style.height = `${introRef.current.scrollHeight}px`;
    }
  }, [info.introduction]);

  const handleAutoHeight = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  const addMinutes = (timeStr: string, minutesToAdd: string): string => {
    const parts = (timeStr || "19:30").split(':').map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return timeStr;
    const [hours, minutes] = parts;
    let mins = parseInt(minutesToAdd.replace(/[^0-9]/g, '')) || 0;
    if (minutesToAdd.toLowerCase().includes('h')) mins *= 60;
    const date = new Date();
    date.setHours(hours, minutes + mins, 0);
    return date.toTimeString().slice(0, 5);
  };

  const computedAgenda = useMemo(() => {
    let currentTime = info.time || "19:30";
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
    localStorage.setItem(STORAGE_KEY + '-timerules', JSON.stringify(timeRules));
    localStorage.setItem(STORAGE_KEY + '-reminders', JSON.stringify(reminders));
    alert('保存成功！');
  };

  const handlePrint = () => window.print();

  const handleSaveImage = async () => {
    if (!paperRef.current) return;
    try {
      // @ts-ignore
      const canvas = await html2canvas(paperRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-0 md:py-8 px-0 md:px-4 font-sans overflow-x-hidden">
      {/* Universal Floating Control Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t p-3 flex justify-around md:static md:bg-transparent md:border-none md:p-0 md:flex-col md:fixed md:top-8 md:right-8 md:left-auto md:bottom-auto md:gap-3 no-print z-50 shadow-2xl md:shadow-none">
        <button onClick={handlePrint} className="bg-[#772432] hover:bg-[#5a1b26] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 font-bold text-xs md:text-sm">
          <Printer size={16} /> <span>打印</span>
        </button>
        <button onClick={handleSaveImage} className="bg-[#004165] hover:bg-[#002d45] text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 font-bold text-xs md:text-sm">
          <ImageIcon size={16} /> <span>图片</span>
        </button>
        <button onClick={handleSaveData} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 font-bold text-xs md:text-sm">
          <Save size={16} /> <span>保存</span>
        </button>
        <button onClick={handleReset} className="bg-white text-[#772432] border-2 border-[#772432] px-5 py-2.5 md:px-6 md:py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 font-bold text-xs md:text-sm">
          <RotateCcw size={16} /> <span>重置</span>
        </button>
      </div>

      {/* Main A4 Document */}
      <div 
        ref={paperRef}
        className="bg-white w-full max-w-[210mm] min-h-screen md:min-h-[297mm] p-6 md:p-12 shadow-2xl print-container relative flex flex-col border-t-[10px] md:border-t-[16px] border-[#772432] mb-20 md:mb-0"
      >
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 gap-4 md:gap-6">
          <div className="w-32 md:w-52 shrink-0">
             <TMLogo />
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-xl md:text-4xl font-black text-[#772432] uppercase tracking-tight leading-none mb-1">
              ShanTou Toastmasters
            </h1>
            <h2 className="text-sm md:text-xl font-bold text-[#004165] tracking-widest md:tracking-[0.2em]">
              汕头国际演讲俱乐部
            </h2>
          </div>
        </div>

        {/* Meeting Information Section */}
        <div className="space-y-4 md:space-y-6 mb-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b-2 border-[#772432] pb-2 md:pb-4">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-lg md:text-3xl font-black text-[#004165] italic">Meeting #</span>
              <input
                type="text"
                className="text-xl md:text-4xl font-black text-[#772432] outline-none w-14 md:w-32 bg-transparent"
                value={info.meetingNumber}
                onChange={(e) => setInfo({ ...info, meetingNumber: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 flex-grow min-w-[240px]">
              <span className="text-lg md:text-3xl font-black text-[#004165] shrink-0">主题:</span>
              <input
                type="text"
                className="text-lg md:text-3xl font-black text-[#772432] outline-none flex-grow bg-transparent"
                value={info.theme}
                onChange={(e) => setInfo({ ...info, theme: e.target.value })}
                placeholder="会议主题..."
              />
            </div>
          </div>

          <div className="border-l-4 md:border-l-[6px] border-[#772432] py-2 px-4 md:px-6">
            <div className="flex items-start gap-3">
              <Quote size={18} className="text-[#772432] mt-0.5 shrink-0 opacity-40" />
              <div className="flex-grow">
                <span className="text-[9px] md:text-[11px] font-black text-[#772432] uppercase tracking-widest block mb-0.5 opacity-60">Introduction 导语:</span>
                <textarea
                  ref={introRef}
                  className="w-full bg-transparent outline-none text-xs md:text-lg font-bold text-gray-700 italic leading-snug resize-none border-none p-0 focus:ring-0 overflow-hidden"
                  value={info.introduction}
                  onChange={(e) => setInfo({ ...info, introduction: e.target.value })}
                  rows={1}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#004165]/5 border border-[#004165]/10 p-3 md:p-4 rounded-xl flex items-center gap-4 md:gap-6 w-full shadow-sm">
            <div className="flex flex-col items-center shrink-0 border-r-2 border-[#004165]/20 pr-4 md:pr-6">
              <Clock size={16} className="text-[#004165] mb-0.5 opacity-60" />
              <span className="text-[10px] md:text-base font-black text-[#004165]">时间</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 font-bold text-xs md:text-xl text-[#004165] whitespace-nowrap overflow-x-auto no-scrollbar">
              <select value={info.day} onChange={(e) => setInfo({...info, day: e.target.value})} className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none hover:text-[#772432] transition-colors">
                {DAYS.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
              </select>
              <select value={info.month} onChange={(e) => setInfo({...info, month: e.target.value})} className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none hover:text-[#772432] transition-colors">
                {MONTHS.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
              </select>
              <select value={info.date} onChange={(e) => setInfo({...info, date: e.target.value})} className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none hover:text-[#772432] transition-colors">
                {DATES.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
              </select>
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className="text-[#772432] font-black opacity-60">@</span>
                <input
                  type="text"
                  className="w-14 md:w-28 bg-transparent border-b md:border-b-2 border-[#004165]/20 outline-none text-center font-black focus:border-[#772432] transition-all text-[#004165]"
                  value={info.time}
                  onChange={(e) => setInfo({ ...info, time: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl flex items-center gap-4 md:gap-6 w-full shadow-sm">
            <div className="flex flex-col items-center shrink-0 border-r-2 border-gray-200 pr-4 md:pr-6">
              <MapPin size={16} className="text-[#772432] mb-0.5 opacity-60" />
              <span className="text-[10px] md:text-base font-black text-[#772432]">地点</span>
            </div>
            <div className="flex-grow flex flex-col gap-0.5">
              <textarea
                className="text-xs md:text-lg font-bold text-gray-800 w-full bg-transparent outline-none resize-none leading-tight overflow-visible p-0 border-none focus:ring-0"
                value={info.location}
                rows={1}
                onInput={(e) => handleAutoHeight(e.target as HTMLTextAreaElement)}
                onChange={(e) => setInfo({ ...info, location: e.target.value })}
              />
              <textarea
                className="text-[9px] md:text-xs font-black text-gray-400 w-full bg-transparent outline-none uppercase resize-none leading-tight overflow-visible p-0 border-none focus:ring-0"
                value={info.locationEn}
                rows={1}
                onInput={(e) => handleAutoHeight(e.target as HTMLTextAreaElement)}
                onChange={(e) => setInfo({ ...info, locationEn: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Word of the Day Banner */}
        <div className="mb-6 md:mb-8 bg-[#004165]/5 border-l-[8px] md:border-l-[10px] border-[#004165] p-3.5 md:p-5 flex flex-col md:flex-row items-center gap-2 md:gap-6 rounded-r-xl">
          <span className="text-[10px] md:text-xs font-black text-[#004165] uppercase tracking-wider shrink-0 opacity-70">Word of the Day:</span>
          <input
            className="flex-grow bg-transparent outline-none text-xl md:text-3xl font-black text-[#772432] italic uppercase tracking-widest text-center md:text-left w-full"
            value={info.wordOfTheDay}
            onChange={(e) => setInfo({ ...info, wordOfTheDay: e.target.value })}
          />
        </div>

        {/* Club Mission Box */}
        <div className="mb-6 md:mb-10 text-center py-4 md:py-6 px-6 md:px-10 rounded-2xl relative shadow-sm overflow-hidden" style={{ backgroundColor: '#FFFDE7' }}>
           <h3 className="text-[#004165] font-black italic text-sm md:text-lg uppercase tracking-widest mb-1.5 md:mb-2">Club Mission</h3>
           <p className="text-[#004165] font-bold text-[10px] md:text-[15px] leading-relaxed italic max-w-3xl mx-auto opacity-80">
             "We provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth."
           </p>
           <div className="absolute top-0 left-0 w-1 md:w-2 h-full bg-[#F2DF74]"></div>
        </div>

        {/* Main Agenda Content */}
        <div className="flex-grow">
          {/* Header Labels */}
          <div className="flex items-center px-2 mb-3 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">
            <div className="w-10 md:w-24 text-center">Time</div>
            <div className="flex-grow px-3">Activity (活动项目)</div>
            <div className="w-20 md:w-56 px-3 text-right">Role (负责人)</div>
            <div className="w-8 md:w-14 text-right">Dur.</div>
          </div>

          <div className="space-y-0.5 relative">
            {computedAgenda.map((item, index) => (
              <React.Fragment key={item.id}>
                {/* IN-BETWEEN ADD BUTTONS (Visible on Hover) */}
                <div className="h-2 relative group/plus no-print">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/plus:opacity-100 transition-all z-50">
                    <div className="flex gap-2">
                       <button onClick={() => addAgendaItemAt(index)} className="bg-[#004165] text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-1 px-3 text-[10px] font-bold">
                         <Plus size={12} /> ITEM
                       </button>
                       <button onClick={() => addAgendaItemAt(index, true)} className="bg-[#772432] text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-1 px-3 text-[10px] font-bold">
                         <Plus size={12} /> SECTION
                       </button>
                    </div>
                  </div>
                </div>

                <div className={`group relative transition-all duration-200 ${item.isSectionHeader ? 'pt-4 pb-1.5' : ''}`}>
                  {/* Inline Action Buttons (Updated for easier access) */}
                  <div className="absolute -left-1 md:-left-12 top-1/2 -translate-y-1/2 no-print flex flex-col gap-1 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur shadow-xl rounded-lg p-1 border border-gray-100 z-40">
                    <button onClick={() => moveItem(index, 'up')} className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-[#772432] transition-colors"><ChevronUp size={16}/></button>
                    <button onClick={() => moveItem(index, 'down')} className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-[#772432] transition-colors"><ChevronDown size={16}/></button>
                    <button onClick={() => deleteAgendaItem(item.id)} className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                  </div>

                  {item.isSectionHeader ? (
                    <div className="bg-[#772432] text-white px-3 md:px-5 py-2 md:py-3 font-black uppercase tracking-widest text-[10px] md:text-lg rounded-lg shadow-sm flex items-center print-bg-maroon overflow-hidden">
                      <input
                        className="bg-transparent border-none outline-none flex-grow font-black text-center md:text-left"
                        value={item.activity}
                        onChange={(e) => updateAgendaItem(item.id, 'activity', e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-start border-b border-gray-50 py-2 md:py-3 hover:bg-gray-50 transition-colors rounded-lg px-2">
                      <div className="w-10 md:w-24 font-black text-[#004165] text-[10px] md:text-lg text-center mt-0.5">
                        {index === 0 ? (
                          <input
                            className="w-full bg-transparent outline-none text-center font-black text-[#772432]"
                            value={info.time}
                            onChange={(e) => setInfo({...info, time: e.target.value})}
                          />
                        ) : (
                          item.calculatedTime
                        )}
                      </div>
                      <div className="flex-grow px-3">
                        <textarea
                          rows={1}
                          className="w-full bg-transparent outline-none font-bold text-gray-800 text-[11px] md:text-base resize-none overflow-hidden block"
                          value={item.activity}
                          onInput={(e) => handleAutoHeight(e.target as HTMLTextAreaElement)}
                          onChange={(e) => updateAgendaItem(item.id, 'activity', e.target.value)}
                        />
                      </div>
                      <div className="w-20 md:w-56 px-3 text-right">
                        {/* Role Textarea - Optimized with padding-right for italics */}
                        <textarea
                          rows={1}
                          className="w-full bg-transparent outline-none text-[11px] md:text-base font-black text-[#772432] text-right italic resize-none overflow-hidden block pr-2 md:pr-4"
                          value={item.role}
                          onInput={(e) => handleAutoHeight(e.target as HTMLTextAreaElement)}
                          onChange={(e) => updateAgendaItem(item.id, 'role', e.target.value)}
                          placeholder="..."
                        />
                      </div>
                      <div className="w-8 md:w-14 text-right font-black text-gray-300 text-[10px] md:text-[13px] mt-0.5 shrink-0">
                        <input
                          className="w-full bg-transparent outline-none text-right"
                          value={item.duration}
                          onChange={(e) => updateAgendaItem(item.id, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Bottom Creation Controls (Still kept for convenience) */}
          <div className="no-print mt-8 flex gap-3 md:gap-5">
            <button onClick={() => addAgendaItemAt(agenda.length)} className="flex-grow py-3 border-2 border-dashed border-[#004165]/20 text-[#004165] rounded-xl font-bold hover:bg-[#004165] hover:text-white transition-all text-[10px] md:text-sm uppercase tracking-widest">+ 项目 Item</button>
            <button onClick={() => addAgendaItemAt(agenda.length, true)} className="flex-grow py-3 border-2 border-dashed border-[#772432]/20 text-[#772432] rounded-xl font-bold hover:bg-[#772432] hover:text-white transition-all text-[10px] md:text-sm uppercase tracking-widest">+ 环节 Section</button>
          </div>
        </div>

        {/* Support Section Grid */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          <div className="bg-[#004165] text-white p-4 md:p-6 rounded-2xl shadow-lg print-bg-blue">
            <h3 className="font-black italic text-[11px] md:text-base uppercase border-b border-white/20 pb-1.5 mb-3 tracking-widest">Time Rule 计时规则</h3>
            <div className="space-y-2.5 md:space-y-3 text-[10px] md:text-[13px] font-bold">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="flex items-center gap-3 md:gap-4">
                  <span className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shrink-0 ${idx === 0 ? 'bg-green-500' : idx === 1 ? 'bg-[#f2df74]' : 'bg-red-500'}`}></span>
                  <input className="bg-transparent border-none outline-none w-full p-0.5 rounded transition-colors" value={timeRules[idx]} onChange={(e) => {
                    const next = [...timeRules]; next[idx] = e.target.value; setTimeRules(next);
                  }} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#772432] text-white p-4 md:p-6 rounded-2xl shadow-lg print-bg-maroon">
            <h3 className="font-black italic text-[11px] md:text-base uppercase border-b border-white/20 pb-1.5 mb-3 tracking-widest">Kind Reminders 提示</h3>
            <div className="space-y-2 md:space-y-2.5">
              {reminders.map((reminder, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-white/40 rounded-full shrink-0"></div>
                  <input className="bg-transparent border-none outline-none w-full text-[10px] md:text-[13px] font-black italic opacity-95 p-0.5 rounded transition-colors" value={reminder} onChange={(e) => {
                      const next = [...reminders]; next[idx] = e.target.value; setReminders(next);
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Officers Team Grid */}
        <div className="bg-gray-50 p-6 md:p-10 rounded-[32px] border-2 border-gray-100 mt-auto shadow-inner">
          <h3 className="text-[#004165] font-black italic text-sm md:text-xl uppercase mb-5 md:mb-8 text-center tracking-widest">Club Officers Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 md:gap-y-4">
            {officers.map((officer, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-1 md:pb-2.5 hover:bg-white transition-colors px-2 rounded-lg">
                <span className="text-[11px] md:text-base font-black text-gray-400 uppercase tracking-tighter w-1/2">{officer.role}</span>
                <input className="bg-transparent outline-none text-[12px] md:text-base font-black text-[#772432] text-right w-1/2" value={officer.name} onChange={(e) => {
                  const next = [...officers]; next[index].name = e.target.value; setOfficers(next);
                }} />
              </div>
            ))}
          </div>
          
          <div className="mt-8 md:mt-14 text-center space-y-3 md:space-y-5">
            <p className="text-[#004165] font-black text-lg md:text-2xl tracking-[0.3em] uppercase leading-none opacity-90">CONNECT LEARN AND GROW</p>
            <p className="text-[#772432] font-black text-[12px] md:text-xl tracking-widest opacity-95 uppercase leading-none">粤东地区首家头马国际演讲俱乐部</p>
          </div>
        </div>
      </div>
      
      {/* Page Footer Note */}
      <div className="mt-6 md:mt-8 text-gray-400 font-black uppercase text-[10px] md:text-sm tracking-[0.4em] no-print pb-24 md:pb-16 px-6 text-center">
        ShanTou Toastmasters Club • Weekly Agenda Maker
      </div>
    </div>
  );
};

export default App;

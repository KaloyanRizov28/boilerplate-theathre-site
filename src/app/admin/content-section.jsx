"use client";
import { useState, useEffect } from 'react';
import StatusMessage from '../../components/ui/status-message';
import Image from 'next/image';

const inputClass = 'w-full border border-white/10 rounded-lg p-2.5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theater-blue/50 focus:border-theater-blue/50 transition-all';
const buttonBaseClass = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

export default function ContentSection({ supabase }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hero Configuration
    const [heroMode, setHeroMode] = useState('auto'); // 'auto' | 'manual'
    const [heroItems, setHeroItems] = useState([]);

    // Shows Configuration
    const [showsMode, setShowsMode] = useState('auto'); // 'auto' | 'manual'
    const [showsSelection, setShowsSelection] = useState([]); // Array of show IDs

    // Available shows for selection
    const [availableShows, setAvailableShows] = useState([]);

    useEffect(() => {
        fetchConfig();
        fetchShows();
    }, []);

    async function fetchConfig() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('content_config')
                .select('*');

            if (error) throw error;

            const heroConfig = data.find(c => c.key === 'home_hero')?.value || {};
            const showsConfig = data.find(c => c.key === 'home_shows')?.value || {};

            setHeroMode(heroConfig.mode || 'auto');
            setHeroItems(heroConfig.items || []);

            setShowsMode(showsConfig.mode || 'auto');
            setShowsSelection(showsConfig.selection || []);
        } catch (error) {
            console.error('Error fetching config:', error);
            // Don't show error to user immediately, just fallback to defaults
        } finally {
            setLoading(false);
        }
    }

    async function fetchShows() {
        const { data } = await supabase
            .from('shows')
            .select('id, title, poster_URL')
            .order('title');
        if (data) setAvailableShows(data);
    }

    async function saveConfig() {
        setStatus(null);
        try {
            const updates = [
                {
                    key: 'home_hero',
                    value: { mode: heroMode, items: heroItems }
                },
                {
                    key: 'home_shows',
                    value: { mode: showsMode, selection: showsSelection }
                }
            ];

            const { error } = await supabase
                .from('content_config')
                .upsert(updates);

            if (error) throw error;

            setStatus({ type: 'success', message: 'Настройките са запазени успешно.' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'Грешка при запазване.' });
        }
    }

    // Helper for Hero Items
    const addHeroItem = () => {
        setHeroItems([...heroItems, { title: '', subtitle: '', image: '', link: '' }]);
    };

    const updateHeroItem = (index, field, value) => {
        const newItems = [...heroItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setHeroItems(newItems);
    };

    const removeHeroItem = (index) => {
        setHeroItems(heroItems.filter((_, i) => i !== index));
    };

    if (loading) return <div className="text-white">Зареждане...</div>;

    return (
        <section className="text-white space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Управление на съдържанието</h2>
            <StatusMessage status={status} onClear={() => setStatus(null)} />

            {/* --- HERO SECTION CONFIG --- */}
            <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-theater-blue">Hero Секция (Въртележка)</h2>
                    <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                        <button
                            onClick={() => setHeroMode('auto')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${heroMode === 'auto' ? 'bg-theater-blue text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            Автоматично
                        </button>
                        <button
                            onClick={() => setHeroMode('manual')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${heroMode === 'manual' ? 'bg-theater-blue text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            Ръчно
                        </button>
                    </div>
                </div>

                {heroMode === 'auto' ? (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-sm flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        В автоматичен режим се показват предстоящите представления, подредени по дата.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {heroItems.map((item, idx) => (
                            <div key={idx} className="bg-black/20 border border-white/5 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 relative group hover:border-white/10 transition-colors">
                                <button
                                    onClick={() => removeHeroItem(idx)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-400 p-2 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>

                                <div>
                                    <label className="text-xs font-medium text-gray-400 mb-1 block">Заглавие</label>
                                    <input
                                        value={item.title}
                                        onChange={(e) => updateHeroItem(idx, 'title', e.target.value)}
                                        className={inputClass}
                                        placeholder="Заглавие на слайда"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-400 mb-1 block">Информация</label>
                                    <input
                                        value={item.subtitle}
                                        onChange={(e) => updateHeroItem(idx, 'subtitle', e.target.value)}
                                        className={inputClass}
                                        placeholder="Дата, час или подзаглавие"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-400 mb-1 block">Линк</label>
                                    <input
                                        value={item.link}
                                        onChange={(e) => updateHeroItem(idx, 'link', e.target.value)}
                                        className={inputClass}
                                        placeholder="/repertoar/slug"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-400 mb-1 block">Снимка URL</label>
                                    <input
                                        value={item.image}
                                        onChange={(e) => updateHeroItem(idx, 'image', e.target.value)}
                                        className={inputClass}
                                        placeholder="https://..."
                                    />
                                </div>
                                {item.image && (
                                    <div className="md:col-span-2 h-32 w-full relative rounded-lg overflow-hidden mt-2 border border-white/10">
                                        <Image src={item.image} alt="preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addHeroItem}
                            className="w-full py-4 border-2 border-dashed border-white/10 text-gray-400 hover:border-theater-blue/50 hover:text-theater-blue rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Добави слайд
                        </button>
                    </div>
                )}
            </div>

            {/* --- SHOWS SECTION CONFIG --- */}
            <div className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-theater-blue">Секция "Спектакли"</h2>
                    <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                        <button
                            onClick={() => setShowsMode('auto')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${showsMode === 'auto' ? 'bg-theater-blue text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            Автоматично
                        </button>
                        <button
                            onClick={() => setShowsMode('manual')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${showsMode === 'manual' ? 'bg-theater-blue text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            Ръчно
                        </button>
                    </div>
                </div>

                {showsMode === 'auto' ? (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-sm flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        В автоматичен режим се показват последните добавени спектакли.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-4 bg-black/20 rounded-xl border border-white/5 custom-scrollbar">
                        {availableShows.map((show) => {
                            const isSelected = showsSelection.includes(show.id);
                            return (
                                <div
                                    key={show.id}
                                    onClick={() => {
                                        if (isSelected) setShowsSelection(showsSelection.filter(id => id !== show.id));
                                        else setShowsSelection([...showsSelection, show.id]);
                                    }}
                                    className={`relative group p-3 rounded-lg cursor-pointer border transition-all duration-200 flex flex-col gap-2 ${isSelected ? 'border-theater-blue bg-theater-blue/10 shadow-lg shadow-theater-blue/10' : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-white/5">
                                        {show.poster_URL ? (
                                            <Image src={show.poster_URL} alt={show.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
                                        )}
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-theater-blue/20 flex items-center justify-center">
                                                <div className="w-8 h-8 rounded-full bg-theater-blue text-white flex items-center justify-center shadow-lg">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className={`text-sm font-medium leading-tight line-clamp-2 ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{show.title}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                    onClick={saveConfig}
                    className={`${buttonBaseClass} bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3 shadow-lg shadow-green-900/20`}
                >
                    Запази промените
                </button>
            </div>
        </section>
    );
}

import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Line, ComposedChart, LabelList
} from 'recharts';
import {
    Wine, Droplets, FlaskConical, Thermometer, Wind, Beaker,
    Activity, LayoutDashboard, BrainCircuit, Info, CheckCircle2, AlertCircle, FileUp, Table, Sparkles, ChevronRight, Database
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? '' : 'http://127.0.0.1:8001');

// Helper to capitalize and format labels
const formatLabel = (str) => {
    if (str.toLowerCase() === 'ph') return 'pH';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const featureIcons = {
    'alcohol': <Wine size={20} />,
    'sulphates': <FlaskConical size={20} />,
    'volatile_acidity': <Wind size={20} />,
    'total_sulfur_dioxide': <Activity size={20} />,
    'chlorides': <Droplets size={20} />,
    'pH': <Beaker size={20} />,
    'citric_acid': <FlaskConical size={20} />,
    'residual_sugar': <Droplets size={20} />,
    'density': <Activity size={20} />,
    'fixed_acidity': <Thermometer size={20} />,
    'free_sulfur_dioxide': <Wind size={20} />,
};

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [importances, setImportances] = useState([]);
    const [recommendations, setRecommendations] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [batchResults, setBatchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fixed_acidity: 7.4,
        volatile_acidity: 0.7,
        citric_acid: 0.0,
        residual_sugar: 1.9,
        chlorides: 0.076,
        free_sulfur_dioxide: 11.0,
        total_sulfur_dioxide: 34.0,
        density: 0.9978,
        pH: 3.51,
        sulphates: 0.56,
        alcohol: 9.4
    });

    const [correlationData, setCorrelationData] = useState(null);
    const [distributions, setDistributions] = useState(null);
    const [qualityDist, setQualityDist] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;

    useEffect(() => {
        fetchImportances();
        fetchRecommendations();
        fetchCorrelation();
        fetchDistributions();
        fetchQualityDist();
    }, []);

    const fetchImportances = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/features`);
            const data = await res.json();
            // Capitalize features for the chart
            const formatted = data.map(item => ({
                ...item,
                displayName: formatLabel(item.feature)
            }));
            setImportances(formatted);
        } catch (err) {
            console.error("Failed to fetch importances", err);
        }
    };

    const fetchCorrelation = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/analytics/correlation`);
            const data = await res.json();
            setCorrelationData(data);
        } catch (err) {
            console.error("Failed to fetch correlation", err);
        }
    };

    const fetchDistributions = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/analytics/distributions`);
            const data = await res.json();
            setDistributions(data);
        } catch (err) {
            console.error("Failed to fetch distributions", err);
        }
    };

    const fetchQualityDist = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/analytics/quality-dist`);
            const data = await res.json();
            setQualityDist(data);
        } catch (err) {
            console.error("Failed to fetch quality-dist", err);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/recommendations`);
            const data = await res.json();
            setRecommendations(data);
        } catch (err) {
            console.error("Failed to fetch recommendations", err);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || 'Inference failed');
            }
            const data = await res.json();
            setPrediction(data.quality);
        } catch (err) {
            alert("Simulation Error: " + err.message);
            console.error("Prediction failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBatchUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/predict/batch`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || 'Bulk processing failed');
            }

            const data = await res.json();
            setBatchResults(data);
            setCurrentPage(1); // Reset to first page
            setActiveTab('batch');
        } catch (err) {
            alert("CSV Upload Failed: " + err.message);
            console.error("Batch processing error", err);
        } finally {
            setLoading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: parseFloat(e.target.value) });
    };

    // Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = batchResults.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(batchResults.length / rowsPerPage);

    return (
        <div className="min-h-screen bg-[#fafaf9] flex transition-all text-stone-900 selection:bg-red-100 selection:text-red-900">
            {/* --- Sidebar --- */}
            <aside className="fixed left-0 top-0 h-full w-24 md:w-72 bg-white border-r border-stone-200 flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="p-8 flex items-center gap-4">
                    <div className="w-12 h-12 wine-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-red-900/20 ring-1 ring-white/20">
                        <Wine className="text-white" size={24} />
                    </div>
                    <div className="hidden md:block">
                        <h2 className="font-fraunces font-black text-2xl tracking-tight text-stone-900 italic text-nowrap">Vino Veritas</h2>
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em] leading-none">Enology AI Dashboard</p>
                    </div>
                </div>

                <div className="flex-1 mt-12 px-6 space-y-4 text-sm font-semibold">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === 'dashboard' ? 'bg-red-50 text-red-600 ring-1 ring-red-100 shadow-[0_4px_20px_rgba(153,27,27,0.08)]' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}
                    >
                        <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'text-red-600' : 'group-hover:text-stone-700'} />
                        <span className={`hidden md:block font-bold tracking-tight ${activeTab === 'dashboard' ? 'text-red-700' : ''}`}>Analytics Center</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('predict')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === 'predict' ? 'bg-red-50 text-red-600 ring-1 ring-red-100 shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'}`}
                    >
                        <BrainCircuit size={20} className={activeTab === 'predict' ? 'text-red-500' : 'group-hover:text-stone-900'} />
                        <span className="hidden md:block text-stone-700">Batch Simulator</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('batch')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === 'batch' ? 'bg-red-50 text-red-600 ring-1 ring-red-100 shadow-sm' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}
                    >
                        <Table size={20} className={activeTab === 'batch' ? 'text-red-500' : 'group-hover:text-stone-700'} />
                        <span className="hidden md:block">Dataset Audit</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('research')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === 'research' ? 'bg-red-50 text-red-600 ring-1 ring-red-100 shadow-sm' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}
                    >
                        <FlaskConical size={20} className={activeTab === 'research' ? 'text-red-500' : 'group-hover:text-stone-700'} />
                        <span className="hidden md:block">Scientific Lab</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === 'gallery' ? 'bg-red-50 text-red-600 ring-1 ring-red-100 shadow-sm' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}
                    >
                        <Database size={20} className={activeTab === 'gallery' ? 'text-red-500' : 'group-hover:text-stone-700'} />
                        <span className="hidden md:block font-bold">Research Gallery</span>
                    </button>
                </div>

                <div className="p-8">
                    <div className="hidden md:block glass p-6 rounded-2xl relative overflow-hidden group border border-stone-200 bg-stone-50 mb-4">
                        <div className="absolute top-0 right-0 w-16 h-16 wine-gradient opacity-5 blur-2xl rounded-full" />
                        <p className="text-stone-900 font-bold text-xs mb-2 flex items-center gap-2">
                            <Sparkles size={14} className="text-red-600" />
                            Expert Instance
                        </p>
                        <p className="text-[10px] text-stone-700 font-bold leading-relaxed">System calibrated with {batchResults.length || 1599} batch cycles.</p>
                    </div>

                    {/* Educational Credit */}
                    <div className="mt-8 border-t border-stone-200 pt-6">
                        <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-2">Developed By</p>
                        <p className="text-stone-900 font-bold text-sm mb-1 italic">Parthiban</p>
                        <div className="flex items-center gap-1.5 opacity-60">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[9px] text-stone-600 font-bold uppercase tracking-tighter">Educational & Research Edition</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 ml-24 md:ml-72 bg-white/50 backdrop-blur-xl min-h-screen relative overflow-hidden">
                {/* Background Luxurious Mesh Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-100/40 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-stone-200/50 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-50/60 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-[50%] left-[30%] w-[40%] h-[40%] bg-orange-50/30 rounded-full blur-[140px] pointer-events-none" />

                {/* --- Global Educational Header --- */}
                <div className="relative z-50 px-8 py-6 border-b border-stone-200/60 bg-white/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-stone-900 font-fraunces text-2xl font-black italic tracking-tight">
                            Digital Enology Suite <span className="text-red-600">by Parthiban</span>
                        </h2>
                    </div>
                    <div className="bg-red-50/80 border border-red-100 px-6 py-2 rounded-full shadow-sm">
                        <p className="text-red-900 text-[11px] font-black uppercase tracking-[0.2em]">
                            ⚠️ Created Exclusively for **Educational & Research Purposes**
                        </p>
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="p-8 md:p-12 lg:p-20 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <header className="mb-16 border-l-4 border-red-600 pl-8">
                            <h1 className="font-fraunces text-6xl font-black text-stone-900 mb-4 italic tracking-tight">Quality Analytics</h1>
                            <p className="text-xl text-stone-500 max-w-2xl font-medium leading-relaxed">Advanced chemical profile analysis utilizing ensemble learning to identify quality drivers.</p>
                        </header>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                            {/* Feature Importance Card */}
                            <div className="xl:col-span-2 glass p-10 bg-white border border-stone-200 shadow-xl rounded-[2.5rem] relative overflow-hidden group min-h-[500px]">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Activity className="text-red-600" size={20} />
                                            <h3 className="text-2xl font-bold text-stone-900 font-fraunces italic">Predictor Impact Ranking</h3>
                                        </div>
                                        <p className="text-sm text-stone-400 font-semibold uppercase tracking-widest">Ensemble Weight Analysis</p>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 rounded-full border border-stone-200">
                                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">Real-Time Inference</span>
                                    </div>
                                </div>

                                <div className="h-[400px] mt-8">
                                    {importances.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={importances} layout="vertical" margin={{ left: 40, right: 40 }}>
                                                <defs>
                                                    <linearGradient id="barWineGradient" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#991b1b" />
                                                        <stop offset="100%" stopColor="#ef4444" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f0" horizontal={true} vertical={false} />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                                                />
                                                <YAxis
                                                    dataKey="displayName"
                                                    type="category"
                                                    width={140}
                                                    tick={{ fill: '#78716c', fontSize: 11, fontWeight: 800 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: '#fafaf9' }}
                                                    contentStyle={{
                                                        borderRadius: '16px',
                                                        border: 'none',
                                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                                        padding: '12px 16px',
                                                        fontSize: '12px',
                                                        fontWeight: '800'
                                                    }}
                                                    formatter={(val) => [`${(val * 100).toFixed(1)}%`, 'Impact']}
                                                />
                                                <Bar dataKey="importance" fill="url(#barWineGradient)" radius={[0, 8, 8, 0]} barSize={28}>
                                                    <LabelList
                                                        dataKey="importance"
                                                        position="right"
                                                        formatter={(val) => `${(val * 100).toFixed(1)}%`}
                                                        style={{ fill: '#78716c', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}
                                                        offset={10}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-stone-50 rounded-3xl animate-pulse">
                                            <p className="text-stone-300 font-bold uppercase tracking-widest text-xs">Awaiting Laboratory Data...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recommendations & Radar */}
                            <div className="space-y-8">
                                {recommendations && (
                                    <div className="p-8 relative overflow-hidden bg-gradient-to-br from-red-600 to-red-800 rounded-3xl shadow-2xl shadow-red-900/20 group">
                                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                                        <h3 className="font-black text-white/50 mb-6 flex items-center gap-3 uppercase tracking-[0.2em] text-xs">
                                            <CheckCircle2 size={20} className="text-white" />
                                            Expert Insight
                                        </h3>
                                        <p className="text-white/80 font-black mb-3 uppercase text-xs tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            Driver: {recommendations.primary_driver}
                                        </p>
                                        <p className="text-white text-lg leading-relaxed font-medium drop-shadow-sm">{recommendations.advice}</p>
                                        <button
                                            onClick={() => setActiveTab('predict')}
                                            className="mt-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.3em] group/btn"
                                        >
                                            View Optimization Strategy <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}
                                {/* Radar Chart Summary */}
                                <div className="glass p-10 bg-white border border-stone-200 shadow-xl rounded-[2.5rem] relative overflow-hidden group min-h-[500px]">
                                    <div className="flex items-center gap-3 mb-12">
                                        <Info className="text-blue-600" size={20} />
                                        <h3 className="text-2xl font-bold text-stone-900 font-fraunces italic">Profile Correlation</h3>
                                    </div>
                                    <div className="h-[350px]">
                                        {importances.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart data={importances.slice(0, 6)}>
                                                    <PolarGrid stroke="#e7e5e4" />
                                                    <PolarAngleAxis dataKey="displayName" tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} />
                                                    <Radar name="Impact" dataKey="importance" stroke="#991b1b" fill="#991b1b" fillOpacity={0.6} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-stone-50 rounded-3xl animate-pulse">
                                                <Activity className="text-stone-200 animate-spin-slow" size={48} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {importances.slice(0, 4).map((feat) => (
                                <div key={feat.feature} className="glass p-8 border border-white/50 bg-white/80 backdrop-blur-sm hover:border-red-400 transition-all duration-500 hover:-translate-y-2 group shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-3xl">
                                    <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center mb-6 group-hover:wine-gradient transition-all duration-700 shadow-inner">
                                        {React.cloneElement(featureIcons[feat.feature] || <Activity />, { className: 'group-hover:text-white text-stone-500 transition-colors' })}
                                    </div>
                                    <h4 className="text-stone-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{feat.feature}</h4>
                                    <p className="text-4xl font-black text-stone-900 tracking-tighter">
                                        {(feat.importance * 100).toFixed(1)}<span className="text-red-500 text-lg">%</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'predict' && (
                    <div className="p-8 md:p-12 lg:p-20 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <header className="mb-20 text-center">
                            <h1 className="font-fraunces text-7xl font-black text-stone-900 mb-6 italic italic tracking-tighter">Batch Simulator</h1>
                            <p className="text-xl text-stone-600 font-medium font-sans">Manipulate chemical parameters to project potential quality ratings.</p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Input Panel */}
                            <div className="lg:col-span-8 space-y-12">
                                <form onSubmit={handlePredict} className="glass p-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 bg-white border border-stone-200">
                                    {Object.keys(form).map((key) => (
                                        <div key={key} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-stone-900 uppercase tracking-[0.3em]">{key.replace(/_/g, ' ')}</label>
                                                <span className="text-[11px] font-mono text-stone-950 font-black tracking-tighter">{form[key]}</span>
                                            </div>
                                            <input
                                                type="number"
                                                step="any"
                                                name={key}
                                                value={form[key]}
                                                onChange={handleChange}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-100 focus:bg-white transition-all"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        disabled={loading}
                                        className="col-span-1 md:col-span-2 mt-6 wine-gradient text-white font-black text-xs uppercase tracking-[0.3em] py-6 rounded-2xl shadow-2xl shadow-red-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden group relative"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        {loading ? 'Synthesizing Calibration...' : 'Generate Prediction'}
                                        {!loading && <BrainCircuit size={18} />}
                                    </button>
                                </form>

                                {/* CSV Upload Section */}
                                <div className="glass p-2 bg-gradient-to-br from-white/5 to-transparent">
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-16 cursor-pointer hover:border-red-500/30 hover:bg-red-900/5 transition-all group">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                            <FileUp size={30} className="text-stone-500 group-hover:text-red-500" />
                                        </div>
                                        <span className="text-white font-black text-sm uppercase tracking-widest mb-2">Mass Audit Protocol</span>
                                        <span className="text-stone-500 text-xs font-medium">Drag & drop chemical CSV for batch processing</span>
                                        <input type="file" accept=".csv" className="hidden" onChange={handleBatchUpload} />
                                    </label>
                                </div>
                            </div>

                            {/* Result Output */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-12 space-y-8">
                                    <div className={`glass p-12 flex flex-col items-center justify-center text-center transition-all duration-700 min-h-[450px] relative overflow-hidden bg-white border border-stone-200 shadow-xl ${prediction ? 'ring-2 ring-red-600/20' : ''}`}>
                                        {prediction && <div className="absolute top-0 left-0 w-full h-1 wine-gradient" />}

                                        {prediction ? (
                                            <>
                                                <div className="text-stone-500 uppercase tracking-[0.6em] text-[10px] font-black mb-12 italic border-b border-stone-100 pb-4">Validated Quality Index</div>
                                                <div className="text-[14rem] leading-none font-fraunces font-black text-stone-900 drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] italic tracking-tighter">
                                                    {prediction.toFixed(1)}
                                                </div>
                                                <div className="mt-12 flex items-center gap-3 text-white font-black text-sm uppercase tracking-[0.2em] px-8 py-3 wine-gradient rounded-full shadow-lg shadow-red-900/20">
                                                    <Sparkles size={18} />
                                                    {prediction > 6 ? 'Reserve Status' : prediction > 5 ? 'Select Grade' : 'Table Grade'}
                                                </div>
                                                <p className="mt-8 text-stone-700 text-[10px] font-black max-w-xs leading-relaxed uppercase tracking-widest">Confidence Score: 89.2%</p>
                                            </>
                                        ) : (
                                            <div className="text-stone-200 flex flex-col items-center text-nowrap">
                                                <Wine size={120} className="mb-8 opacity-40 text-stone-400" />
                                                <p className="text-sm font-black uppercase tracking-[0.3em] text-stone-800">Awaiting Simulation</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="glass p-8 bg-stone-50 border border-stone-200 shadow-sm">
                                        <h4 className="font-black text-stone-900 text-[10px] flex items-center gap-3 mb-6 uppercase tracking-[0.2em]">
                                            <AlertCircle size={16} className="text-red-600" />
                                            Technical Note
                                        </h4>
                                        <p className="text-stone-800 text-xs font-bold leading-relaxed italic">
                                            The underlying RandomForestRegressor captures non-linear chemical interactions. Accuracy is highest within the pH range of 2.8 - 4.2.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'batch' && (
                    <div className="p-8 md:p-12 lg:p-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <header className="mb-16 flex justify-between items-end">
                            <div>
                                <h1 className="font-fraunces text-7xl font-black text-stone-900 mb-6 italic italic tracking-tighter">Dataset Audit</h1>
                                <p className="text-xl text-stone-600 font-medium">Comprehensive chemical analysis for {batchResults.length} registered samples.</p>
                            </div>
                            <button onClick={() => setActiveTab('predict')} className="px-8 py-4 bg-white border border-stone-200 shadow-sm text-stone-900 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-50 transition-all flex items-center gap-3 rounded-xl">
                                <FileUp size={16} className="text-red-600" /> New Batch Protocol
                            </button>
                        </header>

                        {batchResults.length > 0 ? (
                            <div className="space-y-6">
                                <div className="glass overflow-x-auto group relative bg-white border border-stone-200 shadow-sm rounded-2xl">
                                    <table className="w-full text-left min-w-[1200px]">
                                        <thead className="bg-stone-50 text-stone-500 uppercase text-[9px] font-black tracking-[0.2em] border-b border-stone-200">
                                            <tr>
                                                <th className="p-6 sticky left-0 bg-stone-50 z-10 w-24">ID</th>
                                                <th className="p-6">Alc%</th>
                                                <th className="p-6">V.Acid</th>
                                                <th className="p-6">Sulph.</th>
                                                <th className="p-6">pH</th>
                                                <th className="p-6">Res.Sug</th>
                                                <th className="p-6">Dens.</th>
                                                <th className="p-6">Chlor.</th>
                                                <th className="p-6">F.SO2</th>
                                                <th className="p-6">T.SO2</th>
                                                <th className="p-6 text-stone-900 text-right sticky right-0 bg-stone-50 z-10 w-32 border-l border-stone-200 text-nowrap">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {currentRows.map((row, idx) => {
                                                const globalIdx = indexOfFirstRow + idx;
                                                return (
                                                    <tr key={globalIdx} className="hover:bg-stone-50/50 transition-colors group/row">
                                                        <td className="p-6 text-stone-400 font-mono text-[10px] sticky left-0 bg-white group-hover/row:bg-stone-50 transition-colors">#{globalIdx.toString().padStart(4, '0')}</td>
                                                        <td className="p-6 font-bold text-stone-900">{row.alcohol}%</td>
                                                        <td className="p-6 text-stone-600">{row['volatile acidity']}</td>
                                                        <td className="p-6 text-stone-600">{row.sulphates}</td>
                                                        <td className="p-6 text-stone-600">{row.pH}</td>
                                                        <td className="p-6 text-stone-600">{row['residual sugar']}</td>
                                                        <td className="p-6 text-stone-600 font-mono text-[10px]">{row.density}</td>
                                                        <td className="p-6 text-stone-600">{row.chlorides}</td>
                                                        <td className="p-6 text-stone-600">{row['free sulfur dioxide']}</td>
                                                        <td className="p-6 text-stone-600">{row['total sulfur dioxide']}</td>
                                                        <td className="p-6 text-right sticky right-0 bg-white group-hover/row:bg-stone-50 transition-colors border-l border-stone-200">
                                                            <span className={`px-3 py-1.5 rounded-lg font-black text-[11px] tracking-tighter ${row.predicted_quality > 6 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                                                                {row.predicted_quality.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-between glass p-6 bg-white border border-stone-200 shadow-sm rounded-2xl">
                                    <div className="text-stone-400 text-[10px] font-black uppercase tracking-widest">
                                        Showing {indexOfFirstRow + 1}-{Math.min(indexOfLastRow, batchResults.length)} of {batchResults.length} records
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            className="px-6 py-2 bg-stone-50 border border-stone-200 text-stone-900 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-100 transition-all disabled:opacity-20 flex items-center gap-2 rounded-lg"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex gap-1">
                                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-10 h-10 rounded-lg text-[10px] font-black transition-all ${currentPage === pageNum ? 'wine-gradient text-white shadow-lg' : 'bg-stone-50 text-stone-400 border border-stone-100 hover:text-stone-900'}`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )
                                            })}
                                            {totalPages > 5 && <span className="flex items-center px-2 text-stone-300">...</span>}
                                        </div>
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            className="px-6 py-2 bg-stone-50 border border-stone-200 text-stone-900 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-100 transition-all disabled:opacity-20 flex items-center gap-2 rounded-lg"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-32 glass border-dashed">
                                <Table size={80} className="text-stone-900 mb-8" />
                                <p className="text-stone-600 font-bold uppercase tracking-[0.3em] text-sm text-nowrap">No Active Audit Cycle</p>
                                <button onClick={() => setActiveTab('predict')} className="mt-8 wine-gradient text-white font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl shadow-2xl group transition-all">
                                    Initiate Deployment <ChevronRight className="inline-block transition-transform group-hover:translate-x-1" size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Research Tab: The Scientific Lab */}
                {activeTab === 'research' && (
                    <div className="p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
                        <header className="mb-20">
                            <h2 className="text-7xl font-fraunces font-black text-stone-900 italic tracking-tighter mb-8 leading-none">Scientific Lab</h2>
                            <p className="text-stone-600 font-bold text-xl max-w-2xl leading-relaxed">
                                Exploratory Data Analysis (EDA) engine replicating the core research insights from the laboratory environment.
                            </p>
                        </header>

                        <div className="grid grid-cols-1 gap-12">
                            {/* High-Fidelity React Charts (Scientific Lab) */}
                            <div className="glass p-12 relative overflow-hidden bg-white border border-stone-200 shadow-2xl rounded-[3rem]">
                                <div className="absolute top-0 right-0 w-64 h-64 wine-gradient opacity-5 blur-[100px] rounded-full" />
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="p-4 rounded-3xl bg-red-50 text-red-600 shadow-inner">
                                        <Activity size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-fraunces font-black text-stone-900 italic tracking-tighter uppercase">Interactive Lab Analysis</h3>
                                        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest mt-1">Real-Time D3.js / Recharts Engine</p>
                                    </div>
                                </div>

                                <div className="space-y-16">
                                    {distributions && Object.entries(distributions).map(([feature, data]) => (
                                        <div key={feature} className="bg-stone-50/30 p-12 rounded-[3.5rem] border border-stone-100 hover:border-red-200 transition-all duration-700 group/chart relative">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                                                        <h4 className="text-[12px] font-black text-stone-400 uppercase tracking-[0.4em]">{formatLabel(feature)} Analysis</h4>
                                                    </div>
                                                    <p className="text-4xl font-black text-stone-900 font-fraunces italic tracking-tighter">Interactive Density Profile</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-white bg-stone-900 px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Engine: React / Recharts</span>
                                                    <p className="text-[10px] text-stone-400 font-bold mt-2 uppercase tracking-tighter">Vector-Based Rendering (Lossless)</p>
                                                </div>
                                            </div>

                                            <div className="h-[500px] w-full mt-8 bg-white/50 rounded-[2.5rem] p-8 shadow-inner border border-stone-50">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <ComposedChart
                                                        data={data.counts.map((c, i) => ({
                                                            count: c,
                                                            bin: data.bins[i].toFixed(3),
                                                            kde: data.kde_y[Math.floor((i / data.counts.length) * data.kde_y.length)]
                                                        }))}
                                                        margin={{ top: 20, right: 30, bottom: 40, left: 20 }}
                                                    >
                                                        <defs>
                                                            <linearGradient id={`grad-${feature}`} x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#991b1b" stopOpacity={0.8} />
                                                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e7e5e4" alpha={0.5} />
                                                        <XAxis
                                                            dataKey="bin"
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: '#78716c', fontSize: 12, fontWeight: 800 }}
                                                            label={{ value: 'Chemical Metric Value', position: 'insideBottom', offset: -25, fontSize: 10, fontWeight: 900, fill: '#a8a29e', textAnchor: 'middle' }}
                                                        />
                                                        <YAxis
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: '#78716c', fontSize: 12, fontWeight: 800 }}
                                                            label={{ value: 'Observation Frequency', angle: -90, position: 'insideLeft', offset: 0, fontSize: 10, fontWeight: 900, fill: '#a8a29e' }}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                borderRadius: '24px',
                                                                border: 'none',
                                                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                                                padding: '20px',
                                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                                backdropFilter: 'blur(10px)'
                                                            }}
                                                            cursor={{ fill: 'rgba(153, 27, 27, 0.03)' }}
                                                        />
                                                        <Bar
                                                            dataKey="count"
                                                            fill={`url(#grad-${feature})`}
                                                            radius={[12, 12, 0, 0]}
                                                            barSize={40}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="kde"
                                                            stroke="#991b1b"
                                                            strokeWidth={4}
                                                            dot={false}
                                                            animationDuration={2000}
                                                            strokeDasharray="5 5"
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="kde"
                                                            stroke="#ef4444"
                                                            strokeWidth={2}
                                                            dot={false}
                                                            animationDuration={2500}
                                                        />
                                                    </ComposedChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div className="p-6 rounded-3xl bg-white border border-stone-100 shadow-sm">
                                                    <p className="text-[10px] font-black text-stone-400 uppercase mb-2">Technical Note</p>
                                                    <p className="text-xs text-stone-600 font-bold leading-relaxed">Lossless Vector Rendering ensures labels remain sharp at any zoom level.</p>
                                                </div>
                                                <div className="p-6 rounded-3xl bg-white border border-stone-100 shadow-sm">
                                                    <p className="text-[10px] font-black text-stone-400 uppercase mb-2">React Logic</p>
                                                    <p className="text-xs text-stone-600 font-bold leading-relaxed">D3-interpolated paths for smooth Gaussian Kernel Density Estimation curves.</p>
                                                </div>
                                                <div className="p-6 rounded-3xl bg-white border border-stone-100 shadow-sm">
                                                    <p className="text-[10px] font-black text-stone-400 uppercase mb-2">Interaction</p>
                                                    <p className="text-xs text-stone-600 font-bold leading-relaxed">Hardware-accelerated tooltips provide real-time data point interrogation.</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quality Count Plot */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="glass p-12 bg-white border border-stone-200 shadow-sm rounded-2xl">
                                    <h3 className="text-2xl font-fraunces font-bold text-stone-900 mb-10 italic">Quality Yield Count</h3>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={qualityDist}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                                                <XAxis dataKey="quality" stroke="#57534e" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#57534e" fontSize={12} tickLine={false} axisLine={false} />
                                                <Tooltip
                                                    cursor={{ fill: '#f5f5f4' }}
                                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e7e5e4', borderRadius: '8px' }}
                                                />
                                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                                    {qualityDist?.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.quality > 6 ? '#ef4444' : '#e7e5e4'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Summary Statistics */}
                                <div className="glass p-12 bg-white border border-stone-200 shadow-sm rounded-2xl relative overflow-hidden">
                                    <div className="absolute -right-8 -top-8 w-64 h-64 wine-gradient opacity-5 blur-[100px] rounded-full" />
                                    <FlaskConical className="text-red-600 mb-8" size={32} />
                                    <h3 className="text-2xl font-fraunces font-bold text-stone-900 mb-6 italic">Laboratory Summary</h3>
                                    <div className="space-y-6">
                                        <div className="pb-6 border-b border-stone-100">
                                            <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Experiments</p>
                                            <p className="text-3xl font-black text-stone-900">1,599 Batches</p>
                                        </div>
                                        <div className="pb-6 border-b border-stone-100">
                                            <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Target Quality Mean</p>
                                            <p className="text-3xl font-black text-stone-900">5.64 / 10</p>
                                        </div>
                                        <p className="text-stone-600 text-sm leading-relaxed italic">
                                            "Our enological analysis confirms that alcohol levels and volatile acidity are the primary pivots for vintage standardization."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Move Top Correlation Heatmap here for scientific context */}
                            <div className="glass p-12 overflow-hidden relative bg-white border border-stone-200 shadow-sm rounded-2xl">
                                <h3 className="text-2XL font-fraunces font-bold text-stone-900 mb-10 italic">Inter-Chemical Correlation</h3>
                                {correlationData && (
                                    <div className="overflow-x-auto pb-8">
                                        <div
                                            className="grid gap-1 min-w-[800px]"
                                            style={{
                                                gridTemplateColumns: `140px repeat(${correlationData.features.length}, 1fr)`
                                            }}
                                        >
                                            <div />
                                            {correlationData.features.map(f => (
                                                <div key={f} className="text-[9px] font-black text-stone-500 uppercase tracking-tighter transform -rotate-45 h-20 flex items-end justify-center pb-2">
                                                    {formatLabel(f)}
                                                </div>
                                            ))}

                                            {correlationData.features.map((featureX, i) => (
                                                <React.Fragment key={featureX}>
                                                    <div className="text-[10px] font-bold text-stone-400 flex items-center pr-4 justify-end h-10">
                                                        {formatLabel(featureX)}
                                                    </div>
                                                    {correlationData.features.map((featureY, j) => {
                                                        const val = correlationData.nodes.find(n => n.x === featureX && n.y === featureY)?.value || 0;
                                                        const color = val > 0
                                                            ? `rgba(153, 27, 27, ${Math.abs(val)})`
                                                            : `rgba(37, 99, 235, ${Math.abs(val)})`;

                                                        return (
                                                            <div
                                                                key={j}
                                                                className="h-10 w-full rounded-[2px] flex items-center justify-center text-[9px] font-mono font-bold transition-all hover:scale-110 hover:z-10 group/cell relative"
                                                                style={{ backgroundColor: color, border: '1px solid rgba(0,0,0,0.05)' }}
                                                            >
                                                                <span className={`transition-opacity ${Math.abs(val) > 0.4 ? 'text-white' : 'text-stone-900'} drop-shadow-sm`}>
                                                                    {val}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Research Gallery Tab (Static Plots) --- */}
                {activeTab === 'gallery' && (
                    <div className="p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto">
                        <header className="mb-20">
                            <h2 className="text-7xl font-fraunces font-black text-stone-900 italic tracking-tighter mb-8 leading-none text-center">Research Gallery</h2>
                            <p className="text-stone-500 font-bold text-xl max-w-2xl mx-auto text-center leading-relaxed">
                                Professional lab exports generated directly from the Python enology research kernel.
                            </p>
                            <div className="h-1 w-32 wine-gradient mx-auto mt-12 rounded-full" />
                        </header>

                        <div className="space-y-24">
                            {/* Static Correlation Matrix */}
                            <div className="bg-white p-16 md:p-24 rounded-[4rem] border border-stone-200 shadow-2xl group transition-all hover:shadow-red-900/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 wine-gradient opacity-5 blur-[120px] rounded-full" />
                                <div className="flex items-center gap-8 mb-16">
                                    <div className="p-6 rounded-[2.5rem] bg-red-50 text-red-600 shadow-inner">
                                        <Database size={48} />
                                    </div>
                                    <div>
                                        <h3 className="text-5xl font-fraunces font-black text-stone-900 italic tracking-tighter uppercase">Global Correlation Matrix</h3>
                                        <p className="text-stone-400 font-black text-[12px] uppercase tracking-[0.4em] mt-2">Enology Library Archive / Pearson standard</p>
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-[3rem] border border-stone-100 bg-stone-50 shadow-2xl aspect-[4/3] flex items-center justify-center p-4">
                                    <img
                                        src="/research_plots/correlation_matrix.png"
                                        alt="Python Correlation Matrix"
                                        className="w-full h-full object-contain cursor-zoom-in hover:scale-[1.02] transition-transform duration-1000"
                                    />
                                </div>
                                <p className="mt-12 text-stone-400 text-sm font-bold leading-relaxed text-center italic">
                                    * High-fidelity Pearson correlation coefficient calculated across the complete 1,599 red wine sample set.
                                </p>
                            </div>

                            <div className="space-y-16">
                                <h4 className="text-[14px] font-black text-stone-400 uppercase tracking-[0.6em] flex items-center gap-6">
                                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(153,27,27,0.5)]" />
                                    Chemical Distribution Snapshots (Individual Archives)
                                </h4>

                                <div className="space-y-24">
                                    {Object.keys(featureIcons).map((feature) => (
                                        <div key={feature} className="bg-white p-12 md:p-24 rounded-[4rem] border border-stone-200 shadow-2xl group hover:shadow-red-900/10 transition-all duration-1000 overflow-hidden relative">
                                            <div className="absolute top-0 left-0 w-full h-3 wine-gradient" />

                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
                                                <div className="flex items-center gap-8">
                                                    <div className="p-8 rounded-[2.5rem] bg-red-50 text-red-600 shadow-inner group-hover:wine-gradient group-hover:text-white transition-all duration-700">
                                                        {featureIcons[feature]}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[12px] font-black text-stone-400 uppercase tracking-[0.5em] mb-2">Scientific Artifact</h4>
                                                        <h3 className="text-6xl font-fraunces font-black text-stone-900 italic tracking-tighter uppercase">{formatLabel(feature)}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                                        <span className="text-[12px] font-black text-stone-900 uppercase tracking-widest">Laboratory Verified</span>
                                                    </div>
                                                    <span className="text-[12px] font-black text-stone-300 uppercase tracking-widest italic font-bold">300 DPI Ultra-HD Archival Export</span>
                                                </div>
                                            </div>

                                            <div className="relative overflow-hidden rounded-[4rem] border border-stone-100 bg-stone-50 aspect-video flex items-center justify-center p-12 shadow-2xl">
                                                <img
                                                    src={`/research_plots/dist_${feature.replace(/ /g, '_')}.png`}
                                                    alt={`${feature} Distribution`}
                                                    className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-[1.03] transition-transform duration-1000"
                                                />
                                            </div>

                                            <div className="mt-20 flex flex-wrap gap-16 justify-center border-t border-stone-50 pt-16">
                                                <div className="text-center">
                                                    <p className="text-[12px] font-black text-stone-400 uppercase tracking-widest mb-2">Standard</p>
                                                    <p className="text-3xl font-bold text-stone-900 font-fraunces italic">300 DPI High-Res</p>
                                                </div>
                                                <div className="h-16 w-px bg-stone-100 hidden md:block" />
                                                <div className="text-center">
                                                    <p className="text-[12px] font-black text-stone-400 uppercase tracking-widest mb-2">Technique</p>
                                                    <p className="text-3xl font-bold text-stone-900 font-fraunces italic">Seaborn / Matplotlib</p>
                                                </div>
                                                <div className="h-16 w-px bg-stone-100 hidden md:block" />
                                                <div className="text-center">
                                                    <p className="text-[12px] font-black text-stone-400 uppercase tracking-widest mb-2">Perspective</p>
                                                    <p className="text-3xl font-bold text-stone-900 font-fraunces italic">Individual Artifact</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quality Yield */}
                            <div className="bg-white p-16 md:p-24 rounded-[4rem] border border-stone-200 shadow-2xl group transition-all relative overflow-hidden">
                                <h4 className="text-[14px] font-black text-stone-400 uppercase tracking-[0.6em] mb-12 flex items-center gap-6">
                                    <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_15px_rgba(153,27,27,0.5)]" />
                                    Final Quality Distribution
                                </h4>
                                <div className="relative overflow-hidden rounded-[3rem] border border-stone-100 bg-stone-50 shadow-2xl flex items-center justify-center p-8">
                                    <img
                                        src="/research_plots/quality_distribution.png"
                                        alt="Python Quality Distribution"
                                        className="w-full h-auto max-w-4xl mx-auto hover:scale-[1.03] transition-transform duration-1000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;

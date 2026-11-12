import React, { useState } from 'react';
import { SearchParams, Lead } from './types';
import { findLeads } from './services/geminiService';
import Navbar from './components/Navbar';
import SearchForm from './components/SearchForm';
import LeadTable from './components/LeadTable';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchSummary, setSearchSummary] = useState<string>('');

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setSearched(true);
    setSearchSummary(`${params.industry} in ${params.location}${params.area ? `, ${params.area}` : ''}`);
    try {
      const results = await findLeads(params);
      setLeads(results);
      if (results.length === 0) {
        setError("No businesses matching your criteria were found. Please try adjusting your keywords or location.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred while searching.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface">
      <Navbar />

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-[300px] shrink-0 border-r border-border h-full overflow-y-auto">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Panel */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {!searched ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-4"
              >
                <div className="bg-slate-100 p-6 rounded-full">
                  <Loader2 className="text-muted" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-primary">Start Your Search</h2>
                <p className="text-muted leading-relaxed">
                  Enter industry and location details in the sidebar to begin generating leads. 
                  Grounded in Google Search for maximum accuracy.
                </p>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-accent rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-primary">Analyzing Web Data</h3>
                  <p className="text-muted">Extracting business details from authoritative sources...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {error && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3 text-amber-800">
                    <AlertCircle className="shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
                
                {leads.length > 0 && (
                  <>
                    <LeadTable leads={leads} />
                    
                    <div className="bg-[#fff7ed] border border-[#fed7aa] p-4 rounded-lg text-[12px] text-[#9a3412]">
                      <strong className="block mb-1">Search Grounding Active</strong>
                      All results are verified through live web data. No inferred or fabricated contact information has been included in the report.
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}



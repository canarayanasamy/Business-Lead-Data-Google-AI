import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { SearchParams } from '../types';
import { cn } from '../lib/utils';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [formData, setFormData] = useState<Omit<SearchParams, 'maxResults'>>({
    industry: '',
    location: '',
    keyword: '',
    details: '',
    area: '',
  });
  const [maxResults, setMaxResults] = useState(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.industry || !formData.location) return;
    onSearch({ ...formData, maxResults });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <aside className="bg-white border-r border-border p-5 flex flex-col gap-5 h-full overflow-y-auto">
      <div className="border-b border-border pb-3 mb-1">
        <h3 className="text-sm font-bold text-primary m-0">Search Parameters</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Industry - Mandatory */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-muted after:content-['_*'] after:text-red-500">
            Industry
          </label>
          <input
            required
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g. Textile Manufacturing"
            className="px-3 py-2 border border-border rounded-md text-[13px] bg-[#fcfcfd] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>

        {/* Location - Mandatory */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-muted after:content-['_*'] after:text-red-500">
            Geographic Location
          </label>
          <input
            required
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City/State/Country"
            className="px-3 py-2 border border-border rounded-md text-[13px] bg-[#fcfcfd] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>

        {/* Business Name / Keyword - Optional */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-muted">
            Name / Service Keyword
          </label>
          <input
            name="keyword"
            value={formData.keyword}
            onChange={handleChange}
            placeholder="e.g. Spinning Mills"
            className="px-3 py-2 border border-border rounded-md text-[13px] bg-[#fcfcfd] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>

        {/* Area of Location - Optional */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-muted">
            Area of Location
          </label>
          <input
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g. Pollachi Road"
            className="px-3 py-2 border border-border rounded-md text-[13px] bg-[#fcfcfd] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>

        {/* Further Details - Optional */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-muted">
            Further Details
          </label>
          <input
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Export oriented..."
            className="px-3 py-2 border border-border rounded-md text-[13px] bg-[#fcfcfd] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
        </div>

        {/* Maximum Results */}
        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-semibold text-muted">
            Maximum Results
          </label>
          <select
            value={maxResults}
            onChange={(e) => setMaxResults(Number(e.target.value))}
            className="px-3 py-2 border border-border rounded-md text-[13px] bg-[#fcfcfd] outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          >
            <option value={25}>25 Results</option>
            <option value={50}>50 Results</option>
            <option value={100}>100 Results</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-accent text-white border-none py-2.5 rounded-md font-semibold cursor-pointer mt-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
          {isLoading ? 'Searching...' : 'Supercharge Search'}
        </button>
      </form>

      <div className="mt-auto text-[11px] text-muted bg-[#f1f5f9] p-3 rounded-md leading-relaxed">
        <strong>Note:</strong> Data is grounded in Google Search. Fields marked with * are mandatory for processing.
      </div>
    </aside>
  );
}

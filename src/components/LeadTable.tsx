import React from 'react';
import { FileText, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { Lead } from '../types';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LeadTableProps {
  leads: Lead[];
}

export default function LeadTable({ leads }: LeadTableProps) {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      leads.map((l) => ({
        'SN': l.serialNumber,
        'Business Name': l.name,
        'Complete Address': l.address,
        'Email ID': l.email || 'N/A',
        'Phone Number': l.phone || 'N/A',
        'Website': l.website || 'N/A',
        'Other Details': l.otherDetails,
        'Sources': l.sourceUrls.join(', ')
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Business Leads');
    XLSX.writeFile(wb, `Business_Leads_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text('Business Lead Manager - Results', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['SN', 'Name of Business', 'Complete Address', 'Email', 'Phone', 'Website', 'Other Details']],
      body: leads.map((l) => [
        l.serialNumber,
        l.name,
        l.address,
        l.email || 'N/A',
        l.phone || 'N/A',
        l.website || 'N/A',
        l.otherDetails
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 23, 42] },
    });
    doc.save(`Business_Leads_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (leads.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end">
        <div className="results-title">
          <h2 className="text-xl font-bold text-primary m-0">Lead Generation Results</h2>
          <p className="text-[13px] text-muted m-0 mt-1">Showing {leads.length} verified business listings</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 border border-border bg-white rounded-md text-[12px] font-semibold text-heading flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet size={14} />
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 border border-border bg-white rounded-md text-[12px] font-semibold text-heading flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <FileText size={14} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f1f5f9] border-b border-border">
              <th className="p-3 text-[11px] uppercase tracking-wider text-muted font-bold text-left w-12">S#</th>
              <th className="p-3 text-[11px] uppercase tracking-wider text-muted font-bold text-left w-48">Business Name</th>
              <th className="p-3 text-[11px] uppercase tracking-wider text-muted font-bold text-left">Complete Address</th>
              <th className="p-3 text-[11px] uppercase tracking-wider text-muted font-bold text-left w-32">Contact</th>
              <th className="p-3 text-[11px] uppercase tracking-wider text-muted font-bold text-left w-40">Website</th>
              <th className="p-3 text-[11px] uppercase tracking-wider text-muted font-bold text-left w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.serialNumber} className="border-b border-border last:border-b-0 hover:bg-slate-50 transition-colors">
                <td className="p-3 text-[12px] text-muted align-top py-4">
                  {lead.serialNumber.toString().padStart(2, '0')}
                </td>
                <td className="p-3 text-[12px] font-bold text-heading align-top py-4">
                  {lead.name}
                </td>
                <td className="p-3 text-[12px] text-heading align-top py-4 leading-relaxed">
                  {lead.address}
                </td>
                <td className="p-3 text-[12px] text-heading align-top py-4">
                  <div className="flex flex-col gap-1">
                    {lead.phone && <span className="truncate">{lead.phone}</span>}
                    {lead.email && <span className="truncate text-muted italic">{lead.email}</span>}
                    {!lead.phone && !lead.email && <span className="text-muted italic">---</span>}
                  </div>
                </td>
                <td className="p-3 text-[12px] align-top py-4">
                  {lead.website ? (
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1 truncate">
                      {new URL(lead.website).hostname.replace('www.', '')}
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-muted">---</span>
                  )}
                </td>
                <td className="p-3 align-top py-4">
                  <span className="bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                    Verified
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 text-[11px] text-muted bg-white border-t border-border flex justify-between items-center">
          <div className="flex gap-4">
            <span>Sources: Web Search, Directories</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#fff7ed] text-[#9a3412] border border-[#fed7aa] px-2 py-0.5 rounded font-bold">
              Grounding Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

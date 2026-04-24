import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, FileText, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useToastContext } from '@/App';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Reports = () => {
  const toast = useToastContext();
  const [generating, setGenerating] = useState<string | null>(null);

  const { data: stats } = useQuery({
    queryKey: ['report-stats'],
    queryFn: async () => {
      const [bookings, payments, rooms] = await Promise.all([
        api.get('/bookings'),
        api.get('/payments'),
        api.get('/rooms'),
      ]);
      return {
        totalBookings: bookings.data.length,
        totalRevenue: payments.data.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0),
        totalRooms: rooms.data.length,
        occupiedRooms: rooms.data.filter((r: any) => r.status === 'occupied').length,
      };
    },
  });

  const generateReport = async (reportType: string) => {
    setGenerating(reportType);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportData = await getReportData(reportType);
      generatePDF(reportData, reportType);
      
      toast.success(`${reportType} generated successfully!`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  const getReportData = async (reportType: string) => {
    switch (reportType) {
      case 'Revenue Report':
        const payments = await api.get('/payments');
        return {
          title: 'Revenue Report',
          headers: ['Date', 'Transaction ID', 'Guest', 'Amount', 'Method'],
          rows: payments.data.map((p: any) => [
            new Date(p.payment_date).toLocaleDateString(),
            p.transaction_id,
            p.guest_name || 'N/A',
            `$${parseFloat(p.amount).toFixed(2)}`,
            p.payment_method,
          ]),
          summary: `Total Revenue: $${payments.data.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0).toFixed(2)}`,
        };
      case 'Occupancy Report':
        const rooms = await api.get('/rooms');
        const occupied = rooms.data.filter((r: any) => r.status === 'occupied').length;
        return {
          title: 'Occupancy Report',
          headers: ['Room Number', 'Floor', 'Status', 'Type'],
          rows: rooms.data.map((r: any) => [
            r.room_number,
            r.floor.toString(),
            r.status,
            r.type_name || 'N/A',
          ]),
          summary: `Occupancy Rate: ${Math.round((occupied / rooms.data.length) * 100)}% (${occupied}/${rooms.data.length} rooms)`,
        };
      case 'Guest Report':
        const bookings = await api.get('/bookings');
        return {
          title: 'Guest Report',
          headers: ['Guest Name', 'Room', 'Check-in', 'Check-out', 'Status'],
          rows: bookings.data.map((b: any) => [
            b.guest_name,
            b.room_number,
            new Date(b.check_in_date).toLocaleDateString(),
            new Date(b.check_out_date).toLocaleDateString(),
            b.status,
          ]),
          summary: `Total Bookings: ${bookings.data.length}`,
        };
      default:
        return { title: '', headers: [], rows: [], summary: '' };
    }
  };

  const generatePDF = (data: { title: string; headers: string[]; rows: any[][]; summary: string }, reportType: string) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40, 116, 166);
    doc.text('Grand Seafoam Hotel', 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(data.title, 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38);
    
    // Add table
    autoTable(doc, {
      head: [data.headers],
      body: data.rows,
      startY: 45,
      theme: 'grid',
      headStyles: {
        fillColor: [40, 116, 166],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 45 },
    });
    
    // Add summary
    const finalY = (doc as any).lastAutoTable.finalY || 45;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(data.summary, 14, finalY + 10);
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save PDF
    const filename = `${reportType.replace(/ /g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  const reportTypes = [
    { 
      id: 1, 
      name: 'Revenue Report', 
      icon: DollarSign, 
      description: 'All payment transactions and revenue', 
      color: 'bg-green-500',
      stat: stats ? `$${stats.totalRevenue.toFixed(2)}` : '...',
    },
    { 
      id: 2, 
      name: 'Occupancy Report', 
      icon: Calendar, 
      description: 'Room occupancy and availability', 
      color: 'bg-blue-500',
      stat: stats ? `${stats.occupiedRooms}/${stats.totalRooms} occupied` : '...',
    },
    { 
      id: 3, 
      name: 'Guest Report', 
      icon: FileText, 
      description: 'Guest bookings and history', 
      color: 'bg-purple-500',
      stat: stats ? `${stats.totalBookings} bookings` : '...',
    },
    { 
      id: 4, 
      name: 'Financial Summary', 
      icon: TrendingUp, 
      description: 'Complete financial overview', 
      color: 'bg-gold-500',
      stat: 'Coming soon',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports</h1>
          <p className="text-gray-500 dark:text-slate-300">Generate and download business reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isGenerating = generating === report.name;
          return (
            <Card key={report.id} hover>
              <div className="space-y-4">
                <div className={`${report.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{report.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-300 mt-1">{report.description}</p>
                  <p className="text-lg font-bold text-seafoam-600 dark:text-gold-400 mt-2">{report.stat}</p>
                </div>
                <Button 
                  onClick={() => generateReport(report.name)}
                  disabled={isGenerating || report.name === 'Financial Summary'}
                  className="w-full bg-seafoam-500 hover:bg-seafoam-600 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate PDF
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-slate-300">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${stats?.totalRevenue.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-slate-300">Total Bookings</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats?.totalBookings || 0}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-slate-300">Occupancy Rate</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

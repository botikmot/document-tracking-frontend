'use client';

import { useReports } from './hooks/useReports';

import { ReportHeader } from './components/report-header';
import { ReportFilters } from './components/report-filters';
import { ReportCards } from './components/report-cards';
import { TrendChart } from './components/trend-chart';
import { StatusChart } from './components/status-chart';
import { PriorityChart } from './components/priority-chart';
import { TypeChart } from './components/type-chart';
//import { OfficeRankingChart } from './components/office-ranking-chart';
import { ReportsTable } from './components/reports-table';
import { ExportButtons } from './components/export-buttons';

export default function ReportsPage() {
  const {
    loading,
    filters,
    setFilters,
    report,
    generateReport,
  } = useReports();

  console.log('reports-->', report)

  return (
    <main className="relative flex-1 overflow-hidden bg-[#F5F7F2]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-green-500/5 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-[450px] w-[450px] rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">

        <ReportHeader />

        <div className="space-y-8 p-8">

          <ReportFilters
            filters={filters}
            setFilters={setFilters}
            loading={loading}
            onGenerate={generateReport}
          />

          <ReportCards
            summary={report.summary}
          />

          <div className="grid gap-6 xl:grid-cols-2">

            <TrendChart
              data={report.monthlyTrend}
            />

            <StatusChart
              data={report.statusBreakdown.map(
                (item) => ({
                  name: item.statusName,
                  value: item.count,
                }),
              )}
            />

          </div>

          <div className="grid gap-6 xl:grid-cols-2">

            <PriorityChart
              data={report.byPriority.map((item) => ({
                name: item.priority ?? 'UNSPECIFIED',
                value: item._count.priority,
              }))}
            />

            <TypeChart
              data={report.documentTypeBreakdown.map(
                (item) => ({
                  name: item.documentTypeName,
                  total: item.count,
                }),
              )}
            />

          </div>

          <ReportsTable
            loading={loading}
            documents={report.documents}
          />

          <ExportButtons
            documents={report.documents}
            reportName="eDats_Report"
            reportType={filters.type}
            year={filters.year}
            month={filters.month}
            quarter={filters.quarter}
            incoming={report.summary.incomingDocuments.count}
            outgoing={report.summary.outgoingDocuments.count}
            pending={report.summary.pendingDocuments.count}
            completed={report.summary.completedDocuments.count}
            overdue={report.summary.overdueDocuments.count}
          />

        </div>

      </div>
    </main>
  );
}
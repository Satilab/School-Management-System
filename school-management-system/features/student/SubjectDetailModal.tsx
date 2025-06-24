import React from 'react';
import Modal from '../../components/ui/Modal';
import { SubjectInsight, ReportCard, SubjectGrade, ChartDataPoint } from '../../types';
import SimpleLineChart from '../../components/charts/SimpleLineChart';
import { Icons } from '../../constants';
import Button from '../../components/ui/Button';

interface SubjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: SubjectInsight | null;
  reportCards: ReportCard[]; // All report cards for the student
}

const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({ isOpen, onClose, insight, reportCards }) => {
  if (!isOpen || !insight) return null;

  const subjectPerformanceHistory: ChartDataPoint[] = reportCards
    .map(rc => {
      const subjectGrade = rc.subjects.find(s => s.subjectName === insight.subjectName);
      return subjectGrade ? { name: rc.termName, value: subjectGrade.marksObtained } : null;
    })
    .filter(Boolean as any as (x: any) => x is ChartDataPoint)
    .sort((a, b) => new Date(reportCards.find(rc=>rc.termName === a.name)!.issueDate).getTime() - new Date(reportCards.find(rc=>rc.termName === b.name)!.issueDate).getTime()); // Sort by term date

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Deep Dive: ${insight.subjectName}`} size="lg">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Performance Overview</h3>
          <p className="text-sm"><strong>Current Standing:</strong> <span className="text-academic-blue">{insight.currentPerformance || 'N/A'}</span></p>
          <p className="text-sm"><strong>Trend:</strong> <span className="text-academic-blue">{insight.trend || 'N/A'}</span></p>
        </div>

        {subjectPerformanceHistory.length > 1 && (
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">Marks Trend</h3>
            <SimpleLineChart data={subjectPerformanceHistory} dataKey="value" xAxisKey="name" lineColor="#10B981" />
          </div>
        )}
         {subjectPerformanceHistory.length > 0 && subjectPerformanceHistory.length <=1 && (
             <p className="text-sm text-gray-500">Not enough data for a trend graph (need at least two terms).</p>
         )}


        <div>
          <h3 className="text-md font-semibold text-gray-700">AI Suggestions</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-1 pl-4">
            {insight.aiSuggestions.map((sug, i) => (
              <li key={i}>{sug.text}</li>
            ))}
          </ul>
        </div>

        {insight.suggestedResources.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-gray-700">Recommended Resources</h3>
            <ul className="list-none space-y-1 mt-1">
              {insight.suggestedResources.map((res, i) => (
                <li key={i} className="flex items-center text-sm">
                  <Icons.Lightbulb className="w-4 h-4 mr-2 text-accent-yellow flex-shrink-0" />
                  {res.url ? (
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-academic-blue hover:underline">
                      {res.name} <span className="text-xs text-gray-400">({res.type})</span>
                    </a>
                  ) : (
                    <span>{res.name} <span className="text-xs text-gray-400">({res.type})</span></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="primary">Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SubjectDetailModal;

'use client';

interface CriteriaScore {
  criterion: string;
  score: number;
  weight: number;
  weightedScore?: number;
  justification?: string;
}

interface CriteriaScoresProps {
  scores: CriteriaScore[];
  showJustification?: boolean;
}

export default function CriteriaScores({
  scores,
  showJustification = false,
}: CriteriaScoresProps) {
  if (!scores || scores.length === 0) {
    return <p className="text-sm text-gray-500 italic">No criteria scores available</p>;
  }
  
  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Function to determine width of progress bar
  const getProgressWidth = (score: number) => {
    return `${score}%`;
  };
  
  return (
    <div className="space-y-4">
      {scores.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{item.criterion}</h4>
              <p className="text-xs text-gray-500">Weight: {item.weight}%</p>
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${getScoreColor(item.score)}`}>
                {item.score}/100
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className={`h-2.5 rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: getProgressWidth(item.score) }}
            ></div>
          </div>
          
          {showJustification && item.justification && (
            <p className="text-xs text-gray-600 mt-1">{item.justification}</p>
          )}
        </div>
      ))}
    </div>
  );
}

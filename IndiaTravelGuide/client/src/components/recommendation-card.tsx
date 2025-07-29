interface Recommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'historical': return 'text-orange-500';
      case 'nature': return 'text-green-500';
      case 'spiritual': return 'text-purple-500';
      case 'cultural': return 'text-blue-500';
      case 'adventure': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg border border-gray-100">
      {recommendation.imageUrl && (
        <img 
          src={recommendation.imageUrl}
          alt={recommendation.name}
          className="w-12 h-9 sm:w-16 sm:h-12 rounded-lg object-cover flex-shrink-0"
          onError={(e) => {
            // Fallback to a gradient background if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      )}
      <div className={`w-12 h-9 sm:w-16 sm:h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0 flex items-center justify-center ${recommendation.imageUrl ? 'hidden' : ''}`}>
        <span className="text-orange-600 font-semibold text-xs">{index}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold text-[hsl(210,29%,24%)] text-xs sm:text-sm">
          {index}. {recommendation.name}
        </h4>
        <p className="text-gray-600 text-xs mt-1 line-clamp-2">{recommendation.description}</p>
        <span className={`inline-block mt-1 text-xs font-medium capitalize ${getCategoryColor(recommendation.category)}`}>
          {recommendation.category}
        </span>
      </div>
    </div>
  );
}

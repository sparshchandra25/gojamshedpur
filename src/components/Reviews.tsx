import { Star } from 'lucide-react';
import { REVIEWS } from '../data';

export default function Reviews() {
  return (
    <section className="bg-white py-20 border-b border-gray-100" id="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-12" id="reviews-header">
          <span className="text-[11px] font-bold text-[#102050] tracking-widest uppercase block mb-2 leading-none">
            REVIEWS
          </span>
          <h2 className="font-display font-extrabold text-[#102050] text-3xl sm:text-4xl tracking-tight">
            What Jamshedpur Families Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="testimonials-grid">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className={`rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between hover:shadow-md ${
                review.isHighlighted
                  ? 'bg-[#102050] border-[#102050] text-white shadow-lg md:-translate-y-2'
                  : 'bg-white border-gray-100 text-gray-700'
              }`}
              id={`review-card-${review.id}`}
            >
              <div id={`review-body-wrap-${review.id}`}>
                {/* 5-Star Rating */}
                <div className="flex text-[#f1b42f] gap-1 mb-5" id={`review-stars-${review.id}`}>
                  {[...Array(review.stars)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#f1b42f] stroke-none" />
                  ))}
                </div>

                {/* Review Text */}
                <p 
                  className={`text-sm leading-relaxed font-normal mb-8 italic ${
                    review.isHighlighted ? 'text-gray-200' : 'text-gray-600'
                  }`}
                  id={`review-text-${review.id}`}
                >
                  {review.text}
                </p>
              </div>

              {/* Author Info block */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100/10" id={`review-author-${review.id}`}>
                <img
                  src={review.avatarUrl}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  referrerPolicy="no-referrer"
                  id={`review-avatar-${review.id}`}
                />
                <div>
                  <h4 
                    className={`text-xs font-bold ${
                      review.isHighlighted ? 'text-white' : 'text-[#102050]'
                    }`}
                    id={`review-author-name-${review.id}`}
                  >
                    {review.author}
                  </h4>
                  <p 
                    className={`text-[11px] font-medium mt-0.5 ${
                      review.isHighlighted ? 'text-gray-400' : 'text-gray-400'
                    }`}
                    id={`review-author-area-${review.id}`}
                  >
                    {review.neighborhood}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

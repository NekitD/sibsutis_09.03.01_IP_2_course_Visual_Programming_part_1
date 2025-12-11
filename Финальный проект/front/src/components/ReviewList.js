import React from 'react';

const ReviewList = ({ reviews = [] }) => {
  const handleViewReview = () => {
    alert('View Full Review');
  };

  return (
    <div className="review-list-container">
      {reviews.length > 0 ? (
        reviews.map(({ id, title, authors, decision }) => (
          <div key={id} className="review-card">
            <h3 className="review-title">{title}</h3>
            <div className="review-meta">
              <p className="review-authors">
                <strong>Authors:</strong> {authors.join(', ')}
              </p>
              <p className="review-decision">
                <strong>Decision:</strong> {decision}
              </p>
            </div>
            <button 
              onClick={handleViewReview}
              className="review-action-button"
            >
              View Full Review
            </button>
          </div>
        ))
      ) : (
        <p className="no-reviews-message">No reviews available</p>
      )}
    </div>
  );
};

export default ReviewList;
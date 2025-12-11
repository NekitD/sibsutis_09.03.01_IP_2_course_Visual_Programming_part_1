import React from 'react';

const ArticleList = ({ articles }) => {
  const hasArticles = articles.length > 0;

  return (
    <div>
      {hasArticles ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {articles.map(({ id, title, content, category, tags }) => (
            <li key={id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #eee' }}>
              <h3 style={{ marginTop: 0 }}>{title}</h3>
              <p>{content.substring(0, 100)}...</p>
              <p><strong>Category:</strong> {category}</p>
              <p><strong>Tags:</strong> {tags.join(', ')}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontStyle: 'italic', color: '#666' }}>No articles found.</p>
      )}
    </div>
  );
};

export default ArticleList;
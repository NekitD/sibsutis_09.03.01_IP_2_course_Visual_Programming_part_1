import React, { useState } from 'react';
import axios from 'axios';

const ArticleSubmissionForm = () => {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const authToken = localStorage.getItem('token');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setArticle(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const processFormSubmission = async (event) => {
    event.preventDefault();

    const { title, content, category, tags } = article;
    if (!title || !content || !category || !tags) {
      alert('Please complete all required fields.');
      return;
    }

    try {
      const formattedTags = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const articleData = {
        title,
        content,
        category,
        tags: formattedTags
      };

      console.log('Submitting article:', articleData);
      
      await axios.post('http://localhost:5186/api/articles', articleData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      alert('Article successfully submitted!');
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      alert('Article submission failed. Please verify your information.');
    }
  };

  return (
    <form onSubmit={processFormSubmission}>
      <h2>Submit Article for Review</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          name="title"
          value={article.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={article.category}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Environment">Environment</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={article.content}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags:</label>
        <input
          id="tags"
          type="text"
          name="tags"
          value={article.tags}
          onChange={handleInputChange}
          placeholder="tag1, tag2, tag3"
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Submit for Review
      </button>
    </form>
  );
};

export default ArticleSubmissionForm;
import React, { useState } from 'react';
import axios from 'axios';

const ArticleForm = () => {
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  });
  const [submitError, setSubmitError] = useState('');

  const updateFormField = (event) => {
    const { name, value } = event.target;
    setArticleData(prev => ({ ...prev, [name]: value }));
  };

  const sendArticleData = async (event) => {
    event.preventDefault();
    
    try {
      const processedTags = articleData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const requestData = {
        Title: articleData.title,
        Content: articleData.content,
        Category: articleData.category,
        Tags: processedTags,
      };

      const authToken = localStorage.getItem('token');
      
      await axios.post('http://localhost:5186/api/articles', requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Article submitted successfully!');
    } catch (err) {
      setSubmitError('Failed to submit article. Please check your input.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={sendArticleData}>
      <h2>Submit Article for Review</h2>
      
      <div>
        <label>Article Title:</label>
        <input
          type="text"
          name="title"
          value={articleData.title}
          onChange={updateFormField}
          required
        />
      </div>
      
      <div>
        <label>Category:</label>
        <select
          name="category"
          value={articleData.category}
          onChange={updateFormField}
          required
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Environment">Environment</option>
        </select>
      </div>
      
      <div>
        <label>Article Content:</label>
        <textarea
          name="content"
          value={articleData.content}
          onChange={updateFormField}
          required
        />
      </div>
      
      <div>
        <label>Tags:</label>
        <input
          type="text"
          name="tags"
          value={articleData.tags}
          onChange={updateFormField}
          placeholder="Enter tags separated by commas"
          required
        />
      </div>
      
      <button type="submit">Submit for Review</button>
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
    </form>
  );
};

export default ArticleForm;
import React, { useState } from 'react';
import axios from 'axios';

import './searchbar.css'; 

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/summary/research-list?q=${encodeURIComponent(query)}`);
      setPapers(res.data);
    } catch (error) {
      console.error("Error fetching research papers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
  <form onSubmit={handleSearch}>
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for research papers..."
    />
    <button type="submit">Search</button>
  </form>

  {loading ? (
    <p>Loading...</p>
  ) : (
    <ul>
      {papers.map((paper, index) => (
        <li key={index}>
          <h3>{paper.title}</h3>
          <p>Published: {new Date(paper.published).toLocaleDateString()}</p>
          <p>{paper.summary}</p>
          <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default SearchBar;

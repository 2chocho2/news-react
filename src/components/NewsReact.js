import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './NewsReact.css';
import './Megaphone.png';

function NewsReact() {
  const [category, setCategory] = useState('경제'); // 초기값으로 경제 설정
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  const handleChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1); // 카테고리 변경 시 현재 페이지 번호를 1로 초기화
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/news/${category}?page=${currentPage}`)
        const response = await axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/api/news/${category}?page=${currentPage}`);
        setNews(response.data.items);
        setTotalPages(Math.min(Math.ceil(response.data.total / 10), 50)); // 전체 페이지 수를 50페이지로 제한
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [category, currentPage]);

  const getPageButtons = () => {
    let pageButtons = [];
    const startPage = Math.max(1, currentPage - 2); // 현재 페이지 기준으로 2 페이지 전부터 시작
    const endPage = Math.min(totalPages, currentPage + 2); // 현재 페이지 기준으로 2 페이지 이후까지 끝
    if (startPage > 1) {
      pageButtons.push(
        <button key={1} onClick={() => setCurrentPage(1)}>1</button>
      );
      if (startPage > 2) {
        pageButtons.push(<span key="dots1">...</span>);
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={i === currentPage ? 'current' : ''}>{i}</button>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key="dots2">...</span>);
      }
      pageButtons.push(
        <button key={totalPages} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
      );
    }
    return (
      <div className="page-buttons">
        {pageButtons}
      </div>
    );
  };

  return (
    <div className="all">
      <div className="top">
        <div className="circle"></div>
        <h2 className="comonews">COM:ONEWS</h2>
        <div className="line"></div>
        <div className="category">
          <label>
            <input type="radio" value="경제" checked={category === '경제'} onChange={handleChange} />
            <span>경제</span>
          </label>
          <label>
            <input type="radio" value="세계" checked={category === '세계'} onChange={handleChange} />
            <span>세계</span>
          </label>
          <label>
            <input type="radio" value="사회" checked={category === '사회'} onChange={handleChange} />
            <span>사회</span>
          </label>
          <label>
            <input type="radio" value="정치" checked={category === '정치'} onChange={handleChange} />
            <span>정치</span>
          </label>
          <p></p>
          <label>
            <input type="radio" value="IT" checked={category === 'IT'} onChange={handleChange} />
            <span>IT</span>
          </label>
          <label>
            <input type="radio" value="문화" checked={category === '문화'} onChange={handleChange} />
            <span>문화</span>
          </label>
          <label>
            <input type="radio" value="연예" checked={category === '연예'} onChange={handleChange} />
            <span>연예</span>
          </label>
          <label>
            <input type="radio" value="스포츠" checked={category === '스포츠'} onChange={handleChange} />
            <span>스포츠</span>
          </label>
        </div>
      </div>
      <div className="container">
        <table width="80%" className='news_list'>
          <colgroup>
            <col width="10%" />
            <col width="*" />
            <col width="10%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">카테고리</th>
              <th scope="col">제목</th>
              <th scope="col">작성일</th>
            </tr>
          </thead>
          <tbody>
            {news.map((article) => (
              <tr key={article.link}>
                <td>{category}</td>
                <td><a href={article.link} target="_blank" rel="noreferrer">
                  <p dangerouslySetInnerHTML={{ __html: article.title }}></p>
                </a></td>
                <td>{moment(article.pubDate).format('YYYY-MM-DD')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {getPageButtons()}
        </div>
      </div>
    </div>
  );
}

export default NewsReact;


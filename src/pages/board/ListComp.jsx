import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useBoard } from '../../context/BoardContext';

function ListComp() {
  const { posts, totalCount, getPostsWithPagenation } = useBoard();

  console.log('전체자료' + totalCount);

  //페이지네이션 변수
  const [page, setPage] = useState(1);
  const size = 10;
  const pagerCnt = 10;

  //페이지네이션 계산
  const totalPage = Math.ceil(totalCount / size);
  const startPage = Math.floor((page - 1) / pagerCnt) * pagerCnt + 1;
  const endPage = Math.min(startPage + pagerCnt - 1, totalPage);

  //페이지네이션 번호를 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    getPostsWithPagenation(page, size);
  }, [page]);

  if (!posts.length) {
    return <p>게시물이 없습니다.</p>;
  }

  return (
    <div>
      <h3>리스트</h3>

      <table className="table">
        <thead>
          <tr>
            <th scope="col" style={{ width: '30px' }}>
              no
            </th>
            <th scope="col" style={{ width: '60%' }}>
              subject
            </th>
            <th scope="col">name</th>
            <th scope="col">date</th>
          </tr>
        </thead>
        <tbody>
          {posts?.map((item, i) => {
            return (
              <tr key={i}>
                <th scope="row">{posts.length - i}</th>
                <td>
                  <Link to={`/board/view/${item.id}`} className="nav-link">
                    {item.title}
                  </Link>
                </td>
                <td>{item.name}</td>
                <td>{dayjs(item.created_at).format('YY.MM.DD')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* <ul>
        {posts.map((item, i) => (
          <li key={i}>
            {post.title} / {post.name} / {post.content} /
            {dayjs(post.created_at).format('YYYY-MM-DD')}
          </li>
        ))}
      </ul> */}

      {/* 페이지네이션 */}
      <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
        <div className="mb-3">
          총{totalCount}개 / 현재 {page} 페이지 / 총 {totalPage}페이지
        </div>
        <div>
          <ul className="pagination">
            <li className={`page-item  ${page === 1 ? 'disabled' : ''}}`}>
              <button
                className="page-link"
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                  // setPage(page-1)
                }}
              >
                이전
              </button>
            </li>

            {/* 페이지네이션 bootstrap 디자인 */}
            {pageNumbers.map((item, i) => {
              return (
                <li
                  key={i}
                  className={`page-item ${item == page ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => {
                      setPage(item);
                    }}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
            <li
              className={`page-item  ${page === totalPage ? 'disabled' : ''}}`}
            >
              <button
                className="page-link"
                onClick={() => {
                  // setPage(page+1)
                  setPage((prev) => Math.min(prev + 1, totalPage));
                }}
              >
                다음
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="d-flex justify-content-end">
        <div className="d-flex gap-2">
          <Link to="/board/write" className="btn btn-primary">
            글작성
          </Link>
        </div>
      </div>
      <div>{JSON.stringify(posts)}</div>
    </div>
  );
}
export default ListComp;

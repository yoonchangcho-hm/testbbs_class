import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import supabase from '../../utils/supabase';
import dayjs from 'dayjs';

function ViewComp() {
  const { id } = useParams();
  const [view, setView] = useState({});

  useEffect(() => {
    const viewData = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', Number(id))
        .single();

      console.log(data);
      setView(data);
    };
    viewData();
  }, [id]); //id가 변경될 때마다 다시 불러오도록 의존성 추가

  return (
    <div>
      <h3>글보기</h3>
      <hr />
      <div>
        <div className="d-flex flex-column flex-md-row justify-content-between">
          <h4>{view.title}</h4>
          <div>
            {view.name} / {dayjs(view.created_at).format('YY.MM.DD hh:mm')}
          </div>
        </div>
        <hr />
        <p style={{ 'min-height': '200px' }}>{view.content}</p>
      </div>
      <div className="d-flex justify-content-end">
        <div className="d-flex gap-2">
          <Link to="/board/list" className="btn btn-primary">
            리스트
          </Link>

          {/* 수정: id를 포함한 경로로 정확하게 이동 */}
          <Link to={`/board/modify/${id}`} className="btn btn-info">
            수정
          </Link>
          <Link to="" className="btn btn-danger">
            삭제
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewComp;

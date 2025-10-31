import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import supabase from '../../utils/supabase';

function ModiComp({ getPosts }) {
  const { id } = useParams(); // URL에서 게시글 ID 추출
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    content: '',
  });

  // 기존 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setFormData({
          title: data.title,
          name: data.name,
          content: data.content,
        });
      } else {
        alert('게시글을 불러오지 못했습니다.');
        navigate('/board/list');
      }
    };

    fetchPost();
  }, [id, navigate]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정 버튼 클릭 시
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from('posts')
      .update({
        title: formData.title,
        name: formData.name,
        content: formData.content,
      })
      .eq('id', id);

    if (!error) {
      alert('수정 완료!');
      getPosts();
      navigate('/board/list');
    } else {
      alert('수정 실패!');
    }
  };

  return (
    <div>
      <h3>글 수정</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            className="form-control"
            rows="5"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <Link to="/board/list" className="btn btn-danger">
            취소
          </Link>
          <button className="btn btn-primary">수정하기</button>
        </div>
      </form>
    </div>
  );
}

export default ModiComp;

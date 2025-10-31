import React, { useState } from 'react';
import supabase from '../../utils/supabase';
import { Link, useNavigate } from 'react-router-dom';

function WriteComp({ getPosts }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    content: '',
  });

  // const [name, setTitle] = useState
  // const [content, setCount] = useState

  // 입력값 변경 시 상태 업데이트
  const eventHandler = (e) => {
    // console.log(e.target);
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        // ...prev,[e.target.title]:e.target.value
        ...prev,
        [name]: value,
      };
    });
    // setFormData(()=>({}))
  };

  const clickHandler = (e) => {
    e.preventDefault();
    // alert('전송');

    // validata();
    const createWrite = async () => {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: formData.title,
            name: formData.name,
            content: formData.content,
          },
        ])
        .select();

      if (!error) {
        alert('글작성성공');
        getPosts(); // navigate보다 먼저 호출하는 것이 안전
        navigate('/board/list');
      }
    };
    createWrite();
  };
  return (
    <div>
      <h3>글작성</h3>
      <div>
        <form onSubmit={clickHandler}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="글제목을 입력하세요"
              required
              onChange={eventHandler}
            />
          </div>
          <div>{formData.title}</div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="이름을 입력하세요"
              required
              // onChange={(e)=>{setName(e.target.value)}}

              onChange={eventHandler}
            />
          </div>
          <div>{formData.name}</div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              내용
            </label>
            <input
              type="text"
              id="content"
              name="content"
              className="form-control"
              placeholder="내용을 입력하세요"
              rows="5" // 🔧 input에 row 속성 사용은 잘못된 방식 → textarea로 변경
              // style={{ height: '200px' }}
              required
              // onChange={(e)=>{setCount(e.target.value)}}

              onChange={eventHandler}
            />
          </div>
          <div>{formData.content}</div>

          <div className="d-flex justify-content-end gap-2">
            <Link to="/board/list" className="btn btn-danger">
              취소
            </Link>
            <button className="btn btn-primary">글작성</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WriteComp;

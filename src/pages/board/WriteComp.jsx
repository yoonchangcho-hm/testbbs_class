import React from 'react';

function WriteComp() {
  const clickHandler = (e) => {
    e.preventDefault();
    alert('전송');
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
            />
          </div>
          <div>
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
            />
          </div>
          <div>
            <label htmlFor="content" className="form-label">
              내용
            </label>
            <input
              type="text"
              id="content"
              name="content"
              className="form-control"
              placeholder="내용을 입력하세요"
              row="5"
              // style={{ height: '200px' }}
              required
            />
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex gap-2">
              <button className="btn btn-danger">취소</button>
              <button className="btn btn-primary">글작성</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WriteComp;

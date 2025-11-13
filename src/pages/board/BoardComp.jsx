import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import ListComp from '../board/ListComp';
import WriteComp from '../board/WriteComp';
import ViewComp from '../board/ViewComp';
import ModifyComp from '../board/ModiComp';

import ImageListComp from '../imageboard/ImageListComp';
import ImageUploadComp from '../imageboard/ImageUploadComp';
import ImageViewComp from '../imageboard/ImageViewComp';
import ImageModifyComp from '../imageboard/ImageModifyComp';

import { BoardProvider } from '../../context/BoardContext';
import { ImageBoardProvider } from '../../context/ImageBoardContext';

function BoardComp() {
  return (
    <BoardProvider>
      <div className="container">
        {/* 상단 배너 */}
        <div
          style={{ width: '100%', height: '200px' }}
          className="d-flex justify-content-center align-items-center bg-info rounded mb-3"
        >
          Board
        </div>

        {/* 메뉴 링크 */}
        <div className="d-flex justify-content-center gap-5 mb-4">
          <Link to="/board/list" className="nav-link">
            -글 리스트-
          </Link>
          <Link to="/board/write" className="nav-link">
            -글 작성-
          </Link>
          <Link to="/board/imageboard/list" className="nav-link">
            -이미지 리스트-
          </Link>
          <Link to="/board/imageboard/upload" className="nav-link">
            -이미지 업로드-
          </Link>
        </div>

        {/* 라우팅 */}
        <Routes>
          {/* 글 게시판 */}
          <Route index element={<ListComp />} />
          <Route path="list" element={<ListComp />} />
          <Route path="write" element={<WriteComp />} />
          <Route path="view/:id" element={<ViewComp />} />
          <Route path="modify/:id" element={<ModifyComp />} />

          {/* 이미지 게시판 */}
          <Route
            path="imageboard/*"
            element={
              <ImageBoardProvider>
                <Routes>
                  <Route path="list" element={<ImageListComp />} />
                  <Route path="upload" element={<ImageUploadComp />} />
                  <Route path="view/:id" element={<ImageViewComp />} />
                  <Route path="modify/:id" element={<ImageModifyComp />} />
                </Routes>
              </ImageBoardProvider>
            }
          />
        </Routes>
      </div>
    </BoardProvider>
  );
}

export default BoardComp;

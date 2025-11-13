import { Routes, Route } from 'react-router-dom';
import ImageListComp from './ImageListComp';
import ImageUploadComp from './ImageUploadComp';
import ImageViewComp from './ImageViewComp';
import ImageModifyComp from './ImageModifyComp';

function ImageBoardRouter() {
  return (
    <Routes>
      <Route path="list" element={<ImageListComp />} />
      <Route path="upload" element={<ImageUploadComp />} />
      <Route path="view/:id" element={<ImageViewComp />} />
      <Route path="modify/:id" element={<ImageModifyComp />} />
    </Routes>
  );
}

export default ImageBoardRouter;

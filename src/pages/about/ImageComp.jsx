import React, { useState } from 'react';
import { toast } from 'react-toastify';
import supabase from '../../utils/supabase';

// function ImageComp() {
//   const submitHandler = (e) => {
//     e.preventDefault();
//     alert('테스트');
//   };
//   return (
//     <div>
//       <h3>이미지업로드</h3>
//       <div>
//         <form onSubmit={submitHandler}>
//           <div>
//             <input type="text" />
//           </div>
//             <button>test</button>
//         </form>
//       </div>
//     </div>
//   );
// }
function ImageComp() {
  const [selectFile, setSelectFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [fileName, setFileName] = useState('+');

  const fileChangeHandler = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setSelectFile(file ?? null);
    setMessage('');
    setFileName(file.name);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectFile) {
      setMessage('전송할 이미지를 선택하세요');
      return;
    }

    const bucket = 'images';
    const filepath = `${Date.now()}_${selectFile.name}`;

    //파일이름을 uuid + "_" + selectfile.name -> 1757035671640..._han.png
    //파일이름을 날짜 + "_"  + selectfile.name -> 202511121212_han.png
    //파일이름을 난수 + "_" + selectfile.name

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filepath, selectFile);

    if (error) {
      setMessage('업로드실패 : ' + error.message);
      return;
    } else {
      toast('업로드 완료되었습니다.');

      //파일경로전달받음
      const { data } = supabase.storage.from(bucket).getPublicUrl(filepath);
      console.log(data.publicUrl);
      setUploadUrl(data.publicUrl);
      setFileName('+');
    }
  };
  return (
    <div>
      <h3>이미지업로드</h3>
      <div>
        <form onSubmit={submitHandler}>
          <div style={{ position: 'relative' }}>
            <label
              htmlFor="photo"
              className="d-flex justify-content-center align-items-center bg-info rounded text-white mb-3"
              style={{ width: '100%', height: '50px' }}
            >
              {fileName}
            </label>
            <input
              type="file"
              accept="image/*"
              id="photo"
              onChange={fileChangeHandler}
              style={{
                position: 'absolute',
                width: '100%',
                opacity: 0,
                top: 0,
              }}
            />
          </div>
          <button className="btn btn-primary">파일업로드</button>
          <div>{message && <p className="text-danger mt-2">{message}</p>}</div>
          <div>{uploadUrl && <p className=" mt-2">{uploadUrl}</p>}</div>
        </form>
      </div>
    </div>
  );
}
export default ImageComp;

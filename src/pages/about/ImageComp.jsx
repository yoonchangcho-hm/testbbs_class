import React, { useRef, useState } from 'react';
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

  //미리보고 state
  const [preview, setPreview] = useState('');

  //미리보기 삭제리르 위한 ref 꼭 import
  const fileInputRef = useRef(null);

  const fileChangeHandler = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setSelectFile(file ?? null);
    setMessage('');
    setFileName(file.name);

    //미리보기
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectFile) {
      setMessage('전송할 이미지를 선택하세요');
      return;
    }

    const bucket = 'images';
    const tabel = 'image_upload';
    const filepath = `${Date.now()}_${selectFile.name}`;

    //파일이름을 uuid + "_" + selectfile.name -> 1757035671640..._han.png
    //파일이름을 날짜 + "_"  + selectfile.name -> 202511121212_han.png
    //파일이름을 난수 + "_" + selectfile.name

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filepath, selectFile);
    // console.log(data.publicUrl);

    if (error) {
      setMessage('업로드실패 : ' + error.message);
      return;
    } else {
      //
      //

      //파일경로전달받음
      const { data, error: urlErr } = await supabase.storage
        .from(bucket)
        .getPublicUrl(filepath);
      // console.log(data.publicUrl);
      setUploadUrl(data.publicUrl);

      if (!urlErr) {
        const { error: insertErr } = await supabase.from(tabel).insert({
          fileName: fileName,
          fileurl: uploadUrl,
        });

        if (!insertErr) {
          toast('업로드 완료되었습니다.');
          setFileName('+');
        }
      }
      //
      //
      //
      //
      //
    }
  };

  const clearPreview = () => {
    setPreview('');
    setSelectFile(null);
    setFileName('+');
    fileInputRef.current.value = '';
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
              ref={fileInputRef}
            />
          </div>
          {preview && (
            <>
              <div
                className="mb-3 position-relative bg-info"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="bg-white btn-sm position-absolute"
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '10px',
                    lineHeight: '10px',
                    right: '5px',
                    top: '5px',
                  }}
                  onClick={clearPreview}
                >
                  X
                </div>
                <img
                  src={preview}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </>
          )}

          <button className="btn btn-primary">파일업로드</button>
          <div>{message && <p className="text-danger mt-2">{message}</p>}</div>
          <div>{uploadUrl && <p className=" mt-2">{uploadUrl}</p>}</div>
        </form>
      </div>
    </div>
  );
}
export default ImageComp;

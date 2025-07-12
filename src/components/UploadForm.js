import React from 'react';

function UploadForm({ fileInputRef, onFileChange, onUpload }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input ref={fileInputRef} type="file" accept="video/*" onChange={onFileChange} />
      <button onClick={onUpload}>Upload Video</button>
    </div>
  );
}

export default UploadForm
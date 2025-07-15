import React from 'react';
import styled from 'styled-components';

function UploadForm({ fileInputRef, onFileChange, onUpload }) {
  return (
    <FormWrap>
      <Label htmlFor="video-upload">
        <span>Choose or drag a video file</span>
        <HiddenInput
          id="video-upload"
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={onFileChange}
        />
      </Label>
      <UploadBtn type="button" onClick={onUpload}>
        Upload Video
      </UploadBtn>
    </FormWrap>
  );
}

const FormWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
  justify-content: center;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  background: rgba(44,44,44,0.96);
  border: 2px dashed #ff7700;
  border-radius: 12px;
  padding: 16px 24px;
  color: #ff7700;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
  transition: border 0.18s, background 0.18s;
  &:hover {
    border: 2px solid #ff8800;
    background: rgba(255,119,0,0.07);
    color: #fff;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadBtn = styled.button`
  background: #ff7700;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.18s, transform 0.12s;
  &:hover {
    background: #ff8800;
    transform: translateY(-2px) scale(1.04);
  }
`;

export default UploadForm;
import React from 'react';
import styled from 'styled-components';

function VideoCard({
  video,
  videoRef,
  comments,
  floatingComment,
  onTimeUpdate,
  onAddComment,
  onCommentChange,
  commentInputValue,
  formatTime
}) {
  return (
    <Card>
      <VideoWrap>
        <StyledVideo
          ref={videoRef}
          controls
          onTimeUpdate={onTimeUpdate}
        >
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </StyledVideo>
        {floatingComment && (
          <FloatingComment>{floatingComment}</FloatingComment>
        )}
      </VideoWrap>
      <CommentsSection>
        <CommentsTitle>Comments</CommentsTitle>
        <CommentList>
          {comments?.map((comment, idx) => (
            <CommentItem key={idx}>
              <CommentUser>{comment.user}</CommentUser>
              <TimestampBtn
                onClick={() => {
                  const el = videoRef.current;
                  if (el) {
                    el.currentTime = comment.timestamp;
                    el.play();
                  }
                }}
              >
                [{formatTime(comment.timestamp)}]
              </TimestampBtn>
              <CommentText>{comment.text}</CommentText>
            </CommentItem>
          ))}
        </CommentList>
        <CommentInputRow>
          <CommentInput
            type="text"
            placeholder="Add a comment"
            value={commentInputValue}
            onChange={(e) => onCommentChange(video.id, e.target.value)}
          />
          <CommentButton onClick={() => onAddComment(video.id)}>
            Comment
          </CommentButton>
        </CommentInputRow>
      </CommentsSection>
    </Card>
  );
}

// --- styled-components ---

const Card = styled.div`
  background: rgba(34, 34, 34, 0.97);
  border-radius: 20px;
  padding: 24px 18px 18px 18px;
  margin-bottom: 28px;
  color: #fff;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.22);
  border: 4px solid #ff7700;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VideoWrap = styled.div`
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  margin-bottom: 18px;
`;

const StyledVideo = styled.video`
  width: 100%;
  border-radius: 16px;
  background: #222;
`;

const FloatingComment = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.82);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1rem;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
`;

const CommentsSection = styled.div`
  width: 100%;
  background: rgba(44, 44, 44, 0.94);
  border-radius: 14px;
  padding: 16px 12px 10px 12px;
  margin-top: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.09);
`;

const CommentsTitle = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #ff7700;
  margin-bottom: 8px;
`;

const CommentList = styled.div`
  max-height: 120px;
  overflow-y: auto;
  margin-bottom: 8px;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 0.98rem;
  margin-bottom: 7px;
  gap: 7px;
`;

const CommentUser = styled.span`
  color: #fff;
  font-weight: 600;
  margin-right: 2px;
`;

const TimestampBtn = styled.button`
  background: none;
  color: #ff7700;
  border: none;
  font-size: 0.93rem;
  margin: 0 4px;
  cursor: pointer;
  padding: 0;
  transition: color 0.16s;
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const CommentText = styled.span`
  color: #eee;
  word-break: break-word;
`;

const CommentInputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1.5px solid #ff7700;
  background: #232323;
  color: #fff;
  outline: none;
  transition: border 0.18s;
  &:focus {
    border: 1.5px solid #ff8800;
  }
`;

const CommentButton = styled.button`
  background: #ff7700;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, transform 0.12s;
  &:hover {
    background: #ff8800;
    transform: translateY(-2px) scale(1.05);
  }
`;

export default VideoCard;

import React from 'react';
import './VideoCard.css';

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
    <div className="video-card">
      <video
        ref={videoRef}
        width="100%"
        controls
        onTimeUpdate={onTimeUpdate}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {floatingComment && (
        <div className="floating-comment">{floatingComment}</div>
      )}

      <div className="comment-list">
        {comments?.map((comment, idx) => (
          <p key={idx}>
            <strong>{comment.user}</strong>{' '}
            <button
              onClick={() => {
                const el = videoRef.current;
                if (el) {
                  el.currentTime = comment.timestamp;
                  el.play();
                }
              }}
              style={{ fontSize: '12px', marginLeft: '6px' }}
            >
              [{formatTime(comment.timestamp)}]
            </button>{' '}
            {comment.text}
          </p>
        ))}
      </div>

      <input
        type="text"
        className="comment-input"
        placeholder="Add a comment"
        value={commentInputValue}
        onChange={(e) => onCommentChange(video.id, e.target.value)}
      />
      <button className="comment-button" onClick={() => onAddComment(video.id)}>
        Add Comment
      </button>
    </div>
  );
}

export default VideoCard;
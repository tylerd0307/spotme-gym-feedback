import './App.css';
import React from 'react';
import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import { auth, db } from './firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from 'firebase/auth';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import UploadForm from './components/UploadForm';
import VideoCard from './components/VideoCard';
import NavBar from './components/NavBar';

function App() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [videoComments, setVideoComments] = useState({});
  const [floatingComments, setFloatingComments] = useState({});
  const videoRefs = useRef({});
  const fileInputRef = useRef(null);

  // Auth handlers
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => console.error('Sign-in error:', error));
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error('Sign-out error:', error));
  };

  // File upload
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = () => {
    if (!file) return;

    const storage = getStorage();
    const storageRef = ref(storage, 'videos/' + file.name);

    uploadBytes(storageRef, file)
      .then(() => getDownloadURL(storageRef))
      .then(async (url) => {
        setFile(null);
        fileInputRef.current.value = null;

        const newDoc = await addDoc(collection(db, 'videos'), {
          url,
          user: user.displayName,
          createdAt: serverTimestamp()
        });

        setUploadedVideos((prev) => [...prev, { id: newDoc.id, url }]);
      })
      .catch((err) => console.error('Upload error:', err));
  };

  // Comment system
  const fetchComments = useCallback(async () => {
    const commentsMap = {};
    for (const video of uploadedVideos) {
      const commentsRef = collection(db, 'videos', video.id, 'comments');
      const commentsQuery = query(commentsRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(commentsQuery);
      commentsMap[video.id] = snapshot.docs.map((doc) => doc.data());
    }
    setVideoComments(commentsMap);
  }, [uploadedVideos]);

  const fetchVideos = useCallback(async () => {
    const snapshot = await getDocs(collection(db, 'videos'));
    const videos = snapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url
    }));
    setUploadedVideos(videos);
    await fetchComments();
  }, [fetchComments]);

  const handleCommentInputChange = (videoID, text) => {
    setCommentInputs((prev) => ({ ...prev, [videoID]: text }));
  };

  const handleAddComment = async (videoID) => {
    const videoEl = videoRefs.current[videoID];
    const commentText = commentInputs[videoID];
    if (!videoEl || !commentText) return;

    // Defensive: ensure currentTime is a valid number
    const currentTime = (videoEl && typeof videoEl.currentTime === 'number' && !isNaN(videoEl.currentTime)) ? videoEl.currentTime : 0;

    await addDoc(collection(db, 'videos', videoID, 'comments'), {
      text: commentText,
      timestamp: currentTime,
      user: user.displayName,
      createdAt: serverTimestamp()
    });

    setCommentInputs((prev) => ({ ...prev, [videoID]: '' }));
  };

  const handleTimeUpdate = (videoID) => {
    const currentTime = videoRefs.current[videoID]?.currentTime;
    const comments = videoComments[videoID] || [];

    const commentToShow = comments.find(
      (c) => Math.abs(c.timestamp - currentTime) < 1
    );

    if (commentToShow && floatingComments[videoID] !== commentToShow.text) {
      setFloatingComments((prev) => ({ ...prev, [videoID]: commentToShow.text }));
      setTimeout(() => {
        setFloatingComments((prev) => ({ ...prev, [videoID]: null }));
      }, 3000);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) fetchVideos();
    });
    return () => unsubscribe();
  }, [fetchVideos]);

  return (
    <AppBg>
      <NavBar user={user} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} />
      <MainCard>
        <Tabs>
          <Tab active>Friends</Tab>
          <Tab>Explore</Tab>
        </Tabs>
        <ContentArea>
          {!user ? (
            <Welcome>
              <h1>Welcome to SpotMe</h1>
            </Welcome>
          ) : (
            <>
              <UploadForm
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
                onUpload={handleUpload}
              />
              {uploadedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  videoRef={(videoRefs.current[video.id] ||= React.createRef())}
                  comments={videoComments[video.id]}
                  floatingComment={floatingComments[video.id]}
                  onTimeUpdate={() => handleTimeUpdate(video.id)}
                  onAddComment={handleAddComment}
                  onCommentChange={handleCommentInputChange}
                  commentInputValue={commentInputs[video.id] || ''}
                  formatTime={formatTime}
                />
              ))}
            </>
          )}
        </ContentArea>
      </MainCard>
    </AppBg>
  );

}

// --- styled-components ---

const AppBg = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 80px;
`;

const MainCard = styled.div`
  background: rgba(40, 40, 40, 0.92);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.22);
  border-radius: 32px;
  padding: 32px 32px 18px 32px;
  max-width: 640px;
  width: 100%;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.09);
`;

const Tabs = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 24px;
  gap: 32px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ active }) => (active ? '#fff' : '#bbb')};
  border-bottom: 4px solid ${({ active }) => (active ? '#ff7700' : 'transparent')};
  padding: 8px 24px 10px 24px;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  transition: color 0.18s, border-bottom 0.22s, background 0.18s;
  outline: none;
  &:hover {
    color: #ff7700;
    background: rgba(255,119,0,0.07);
  }
`;

const ContentArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 250px;
  h1 {
    color: #fff;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 1px;
  }
`;

export default App;

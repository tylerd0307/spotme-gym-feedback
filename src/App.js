import './App.css';
import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { auth, db } from './firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from 'firebase/auth';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import AuthSection from './components/AuthSection';
import UploadForm from './components/UploadForm';
import VideoCard from './components/VideoCard';

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

    const currentTime = videoEl.currentTime;

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
    <div className="App">
      <h1>Welcome to SpotMe</h1>
      <AuthSection user={user} onSignOut={handleSignOut} onSignIn={handleGoogleSignIn} />
      {user && (
        <>
          <UploadForm fileInputRef={fileInputRef} onFileChange={handleFileChange} onUpload={handleUpload} />
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
    </div>
  );
}

export default App;

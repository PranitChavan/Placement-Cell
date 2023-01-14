import React, { useContext, useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { app, db, storage } from '../Config/firebaseCfg';
import { collection, getDocs, setDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AuthContext = React.createContext();
const googleProvider = new GoogleAuthProvider();
const auth = getAuth(app);
const collectionRef = collection(db, 'Students');
const teacherAccountIds = ['rEaGhT5f0dWAjFQN7Poe19PujUP2', 'FUXXDJw8neTBKGdOWGkkd8CtIOA3'];

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((currUser) => {
      setCurrentUser(currUser);
      setLoading(false);
    });

    return unSub;
  }, []);

  async function signInWithGoogleAndSaveData() {
    try {
      let isTeacherAccount = false;

      const res = await signInWithPopup(auth, googleProvider);

      const studentAlreadyExists = await checkIfUserAlreadyExists(res.user.uid, 'Students');
      const teacherAlreadyExists = await checkIfUserAlreadyExists(res.user.uid, 'Teachers');
      const isCurrentAccountTeachers = accountType(res.user);

      if (studentAlreadyExists || teacherAlreadyExists) return;

      if (isCurrentAccountTeachers === 'Teacher') {
        await setDoc(doc(db, 'Teachers', res.user.uid), {
          posts: [],
        });
      }

      if (accountType(res.user) === 'Teacher') {
        isTeacherAccount = true;
      }

      await setDoc(doc(db, 'Students', res.user.uid), {
        name: res.user.displayName,
        email: res.user.email,
        accountType: isTeacherAccount ? 'Teacher' : 'Student',
        isFormFilled: isTeacherAccount ? 'NA' : false,
      });

      isTeacherAccount = false;
    } catch (err) {
      console.log(err);
    }
  }

  async function getAllStudentsData() {
    try {
      const response = await getDocs(collectionRef);

      return response.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function logoutHandler() {
    try {
      return await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  }

  async function saveStudentsFormData(formData) {
    try {
      const userDoc = doc(db, 'Students', currentUser.uid);
      await updateDoc(userDoc, { ...formData, isFormFilled: true });
    } catch (err) {
      console.log(err);
    }
  }

  async function uploadResume(file) {
    const fileName = currentUser.displayName.toLowerCase().split(' ')[0] + 'Resume' + currentUser.uid;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            console.log('We dont know whats going on');
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          saveStudentsFormData({ resumeUrl: downloadURL });
        });
      }
    );
  }

  async function getSpecificUserDataById(user) {
    const docRef = doc(db, 'Students', user.uid);
    const docSnap = await getDoc(docRef);

    try {
      if (!docSnap.exists()) return;
      return docSnap.data();
    } catch (err) {}
  }

  async function checkIfUserAlreadyExists(userid, collection) {
    const docRef = doc(db, collection, userid);
    const docSnap = await getDoc(docRef);

    try {
      return docSnap.exists();
    } catch (err) {
      console.log(err);
    }
  }

  function accountType(currentUser) {
    const currentUserId = currentUser.uid;
    const teacherAccount = teacherAccountIds.some((id) => id === currentUserId);
    return teacherAccount ? 'Teacher' : 'Student';
  }

  const value = {
    currentUser,
    signInWithGoogleAndSaveData,
    logoutHandler,
    loading,
    saveStudentsFormData,
    uploadResume,
    getSpecificUserDataById,
    accountType,
    getAllStudentsData,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

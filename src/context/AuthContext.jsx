import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, provider, signInWithPopup, signOut } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const email = user.email.toLowerCase();
        const userDocRef = doc(db, 'users', user.uid);
        let uData = null;

        if (email === 'jkag.montoya@gmail.com') {
          setIsAdmin(true);
          setCurrentUser(user);
          
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            uData = docSnap.data();
            setUserData(uData);
          } else {
            // Create admin doc if doesn't exist
            uData = { email: user.email, approved: true, createdAt: new Date().toISOString() };
            await setDoc(userDocRef, uData);
            setUserData(uData);
          }

          // Auto approve check
          const pendingUid = sessionStorage.getItem('pendingApproveUid');
          if (pendingUid) {
            try {
              await updateDoc(doc(db, 'users', pendingUid), { approved: true });
              alert('¡Usuario aprobado automáticamente!');
              sessionStorage.removeItem('pendingApproveUid');
            } catch(e) {
              console.error(e);
            }
          }
        } else {
          setIsAdmin(false);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().approved === true) {
            setCurrentUser(user);
            setUserData(userDoc.data());
          } else {
            setCurrentUser(null);
            setUserData(null);
            await signOut(auth);
          }
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (user.email.toLowerCase() === 'jkag.montoya@gmail.com') return;
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, { email: user.email, approved: false, createdAt: new Date().toISOString() });
      await fetch('https://formsubmit.co/ajax/jkag.montoya@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            subject: 'Aprobación de usuario - Portal J3K',
            message: `El usuario ${user.email} solicita acceso.`,
            link: `https://portal-j3-k.vercel.app/?approveUser=${user.uid}`
        })
      });
      await signOut(auth);
      throw new Error('new_user_pending');
    } else if (userDoc.data().approved !== true) {
      await signOut(auth);
      throw new Error('pending_approval');
    }
  };

  const updateProfile = async (alias, photoBase64) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const updates = {};
    if (alias !== undefined) updates.alias = alias;
    if (photoBase64 !== undefined) updates.photoBase64 = photoBase64;
    
    await updateDoc(userDocRef, updates);
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, userData, isAdmin, loginGoogle, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
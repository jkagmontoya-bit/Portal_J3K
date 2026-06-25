import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, provider, signInWithPopup, signOut, signInWithEmailAndPassword } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const email = user.email.toLowerCase();
        if (email === 'jkag.montoya@gmail.com') {
          setIsAdmin(true);
          setCurrentUser(user);
          // Auto approve check
          const pendingUid = sessionStorage.getItem('pendingApproveUid');
          if (pendingUid) {
            try {
              await updateDoc(doc(db, 'users', pendingUid), { approved: true });
              alert('Â¡Usuario aprobado automÃ¡ticamente!');
              sessionStorage.removeItem('pendingApproveUid');
            } catch(e) {
              console.error(e);
            }
          }
        } else {
          setIsAdmin(false);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().approved === true) {
            setCurrentUser(user);
          } else {
            setCurrentUser(null);
            await signOut(auth);
          }
        }
      } else {
        setCurrentUser(null);
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

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loginGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import React, {useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDB4C3fM8FqhFkv7X6VB3ygh6EVzn79p3I",
  authDomain: "newchatapp-32046.firebaseapp.com",
  projectId: "newchatapp-32046",
  storageBucket: "newchatapp-32046.appspot.com",
  messagingSenderId: "96160239910",
  appId: "1:96160239910:web:a7585bd139c6908d5931e7",
  measurementId: "G-MJ8KBKXXGV"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <SignOut/>
      </header>

      <section>
        { user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}> Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}> Sign out</button>
  )
}

function ChatRoom(){
  const scrollref = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
    })
    setFormValue('');

    scrollref.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
    <main>
      { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={scrollref}></div>
    </main>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit"> GO </button>
    </form>
    </>
  )
}
//child component
function ChatMessage(props){
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
    )
}


export default App;

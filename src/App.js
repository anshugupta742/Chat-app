import {Box, Button, Container, HStack, Input, VStack} from "@chakra-ui/react";
import Message from "./Components/Message";
import { onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {app} from "./firebase";
import { useEffect, useRef, useState } from "react";
import {getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth,provider)
}

const logouthandler= () => {
  signOut(auth);
}



function App() {
  
  const [user,setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages,setMessages] = useState([]);

  const divForScroll = useRef(null);

  const submitHandler = async(e) => {
    e.preventDefault();
  
    try {
      setMessage("");
      
      await addDoc(collection(db,"Message"),{
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      
      divForScroll.current.scrollIntoView({behavior: "smooth"});

  
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() =>{
    const q = query(collection(db, "Message"),orderBy("createdAt","asc"))

    const unsubscribe = onAuthStateChanged(auth, (data)=>{
      setUser(data);
    });

    const unsubscribeforeMessage = onSnapshot(q,(snap)=>{
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return {id, ...item.data()};
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeforeMessage();
    };
  },[]);

  return (
    <Box bg={"red.50"}>
      {
        user?(
          <Container h={"100vh"} bg={"white"}>
        <VStack h="full" paddingY={"4"}>
          <Button onClick={logouthandler} colorScheme={"red"} w={"full"}>Logout</Button>
          <VStack h="full" w="full" overflow={"auto"} css={{"&::-webkit-scrollbar":{
            display:"none"
           }}}>
            {
              messages.map((item) => (
                <Message key={item.id} user={item.uid===user.uid ? "me" : "other"} text={item.text} uri={item.uri}/>
              ))
            }
            <div ref={divForScroll}></div>
          </VStack>

            

          <form  onSubmit={submitHandler} style={{width:"100%"}}>
            <HStack>
            <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Message"/>
            <Button colorScheme="purple" type="submit">Send</Button>
            </HStack>
          </form>
        </VStack>
      </Container>
        ) : <VStack bg="white" justifyContent={"center"} h="100vh">
              <Button onClick={loginHandler} colorScheme="purple">Sign In With Google</Button>
        </VStack>
      }
    </Box>
  );
}
  
export default App;

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import Filter from 'bad-words'
import {
    ref,
    onUnmounted,
    computed
} from 'vue'

firebase.initializeApp({
    apiKey: "AIzaSyDLGX6krj-BuZ9eN6M2dny-Rwo4pEn6_DA",
    authDomain: "vue-chat-app-93a67.firebaseapp.com",
    projectId: "vue-chat-app-93a67",
    storageBucket: "vue-chat-app-93a67.appspot.com",
    messagingSenderId: "615535303530",
    appId: "1:615535303530:web:06d1aa6f1e446d30782313",
    measurementId: "G-9W8DHG7H8Q"
})

const auth = firebase.auth()

export function useAuth() {
    const user = ref(null)
    const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
    onUnmounted(unsubscribe)
    const isLogin = computed(() => user.value !== null)

    const signIn = async () => {
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        await auth.signInWithPopup(googleProvider)
    }
    const signOut = () => auth.signOut()

    return {
        user,
        isLogin,
        signIn,
        signOut
    }
}

const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)
const filter = new Filter()

export function useChat() {
    const messages = ref([])
    const unsubscribe = messagesQuery.onSnapshot(snapshot => {
        messages.value = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .reverse()
    })
    onUnmounted(unsubscribe)

    const {
        user,
        isLogin
    } = useAuth()
    const sendMessage = text => {
        if (!isLogin.value) return
        const {
            photoURL,
            uid,
            displayName
        } = user.value
        messagesCollection.add({
            userName: displayName,
            userId: uid,
            userPhotoURL: photoURL,
            text: filter.clean(text),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return {
        messages,
        sendMessage
    }
}
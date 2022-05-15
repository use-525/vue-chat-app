/* eslint-disable vue/multi-word-component-names */
<template>
  <header>
    <h1><strong>Vue</strong>Chat App</h1>
    <div>
      <div class="login" v-if="isLogin">
       <img class="avatar" :src="user.photoURL" />
        <button>Sign Out</button>
      </div>
      <button @click="signIn" v-else>Sign In</button>
    </div>
  </header>
</template>

<script>
import { useAuth } from "@/firebase.js";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Nav",
  setup() {
    const { user, isLogin, signOut, signIn } = useAuth();
    return { user, isLogin, signOut, signIn };
  },
};
</script>

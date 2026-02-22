<template>
  <div style="padding: 40px">
    <h2>Login</h2>

    <div>
      <input
        placeholder="username"
        v-model="username"
      />
    </div>

    <div style="margin-top: 10px">
      <input
        type="password"
        placeholder="password"
        v-model="password"
      />
    </div>

    <div style="margin-top: 20px">
      <button @click="login">Login</button>
      <button @click="register">Register</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

async function login() {
  try {
    const res = await axios.post(
      '/api/login',
      {
        username: username.value,
        password: password.value
      },
      {
        // 让浏览器携带 JSESSIONID（session 登录必须）
        withCredentials: true
      }
    )

    console.log('登录返回：', res.data)

    // ❗️把后端返回的 userId 存起来（后面“我的微博”要用）
    sessionStorage.setItem('userId', res.data.userId)
    sessionStorage.setItem('username', res.data.username)

    // 登录成功 → 跳转到时间线
    router.push('/timeline')
  } catch (e) {
    alert('登录失败')
  // 登录失败 → 当游客
  sessionStorage.setItem('username', '游客')
  sessionStorage.removeItem('userId')

  router.push('/timeline')
  }
}
async function register() {
  try {
    const res = await axios.post(
      '/api/register',
      {
        username: username.value,
        password: password.value
      },
      {
        withCredentials: true
      }
    )

    alert('登録に成功しました。ログインしてください。')

  } catch (e) {
    alert('登録に失敗しました（ユーザー名はすでに存在する可能性があります）')
  }
}

</script>

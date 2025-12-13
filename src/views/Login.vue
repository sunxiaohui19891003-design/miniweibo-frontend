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
      'https://miniweibo-backend.onrender.com/login',
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

    sessionStorage.setItem('userId', res.data.userId)
    sessionStorage.setItem('username', res.data.username)

    router.push('/timeline')
  } catch (e) {
    alert('登录失败')
    console.error(e)
  }
}
</script>

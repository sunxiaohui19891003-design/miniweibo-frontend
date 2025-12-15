<template>
  <div style="padding: 40px; max-width: 600px; margin: auto">
    <h2>用户列表</h2>

    <ul>
      <li
        v-for="u in users"
        :key="u.id"
        style="margin-bottom: 10px; display: flex; justify-content: space-between"
      >
        <span>
          👤 {{ u.username }}（ID: {{ u.id }}）
        </span>

        <button @click="followUser(u.id)">
          关注 / 取关
        </button>
      </li>
    </ul>

    <button style="margin-top: 20px" @click="goBack">
      返回微博
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

axios.defaults.withCredentials = true

const router = useRouter()
const users = ref([])

/** 加载所有用户（除了自己） */
async function loadUsers() {
  const res = await axios.get(
    'https://miniweibo-backend.onrender.com/users',
    { withCredentials: true }
  )
    console.log('users res.data =', res.data)
  users.value = res.data
}

/** 关注 / 取关 */
async function followUser(targetUserId) {
  await axios.post(
    'https://miniweibo-backend.onrender.com/follow',
    null,
    {
      params: {
        following_id: targetUserId
      },
        withCredentials: true
    }
  )

  // 可选：点完刷新一次列表
  loadUsers()
}

/** 返回微博页 */
function goBack() {
  router.push('/')
}

onMounted(() => {
  loadUsers()
})
</script>

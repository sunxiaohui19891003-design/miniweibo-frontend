<template>
  <div style="padding: 40px; max-width: 600px; margin: auto">
    <h2>用户列表</h2>

    <!-- 我关注的人 -->
    <h3>我关注的人</h3>
    <ul>
      <li v-for="u in followingList" :key="u.id">
        👤 {{ u.username }}（ID: {{ u.id }}）
        <button @click="followUser(u.id)">取消关注</button>
      </li>
    </ul>

    <!-- 其他用户 -->
    <h3>其他用户</h3>
    <ul>
      <li v-for="u in otherUsers" :key="u.id">
        👤 {{ u.username }}（ID: {{ u.id }}）
        <button @click="followUser(u.id)">关注</button>
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

const followingList = ref([])
async function refreshAll() {
  // ① 我关注的人
  const followingRes = await axios.get(
    'https://miniweibo-backend.onrender.com/followings',
    { withCredentials: true }
  )

  // ② 所有用户
  const usersRes = await axios.get(
    'https://miniweibo-backend.onrender.com/users',
    { withCredentials: true }
  )

  followingList.value = followingRes.data

  const followingIds = new Set(followingRes.data.map(u => u.id))
  otherUsers.value = usersRes.data.filter(u => !followingIds.has(u.id))
}

const otherUsers = ref([])

/** 加载数据 */
async function loadData() {
  // 1️⃣ 我关注的人
  const followingRes = await axios.get(
    'https://miniweibo-backend.onrender.com/followings',
    { withCredentials: true }
  )

  // 2️⃣ 所有用户
  const usersRes = await axios.get(
    'https://miniweibo-backend.onrender.com/users',
    { withCredentials: true }
  )

  followingList.value = followingRes.data

  // 3️⃣ 其他用户 = 所有人 - 我关注的人
  const followingIds = new Set(followingRes.data.map(u => u.id))
  otherUsers.value = usersRes.data.filter(u => !followingIds.has(u.id))
}

/** 关注 / 取关 */
async function followUser(targetUserId) {
  await axios.post(
    'https://miniweibo-backend.onrender.com/follow',
    null,
    {
      params: { following_id: targetUserId },
      withCredentials: true
    }
  )

  // 重新加载
  loadData()
}

/** 返回微博（⚠️ 关键修正） */
function goBack() {
  router.push('/timeline')
}

onMounted(() => {
  loadData()
})
</script>

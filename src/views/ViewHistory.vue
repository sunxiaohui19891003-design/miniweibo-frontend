<template>
  <div style="padding: 40px; max-width: 600px; margin: auto">
    <h2>浏览记录</h2>

    <!-- 返回按钮（不是退出） -->
    <button @click="goBack" style="margin-bottom: 20px">
      返回ブログ
    </button>

    <div v-if="weiboList.length === 0" style="color: #888">
      まだ閲覧履歴はありません
    </div>

    <ul>
      <li
        v-for="w in weiboList"
        :key="w.id"
        style="margin-bottom: 12px"
      >
        {{ w.content }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

axios.defaults.withCredentials = true

const router = useRouter()
const weiboList = ref([])

/** 加载浏览记录 */
async function loadViewHistory() {
  try {
    const res = await axios.get(
      'https://miniweibo-backend.onrender.com/view-history'
    )
    weiboList.value = res.data
  } catch (e) {
    // 登录失效，回登录页
    router.push('/login')
  }
}


/** 返回微博首页（不是 logout） */
function goBack() {
  router.push('/timeline')
}


onMounted(() => {
  loadViewHistory()
})
</script>

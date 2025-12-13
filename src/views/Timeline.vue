<template>
  <div style="padding: 40px; max-width: 600px; margin: auto">
    <div
  style="
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  "
>
  <div style="font-size: 14px; color: #555">
    👤 {{ displayName }}
  </div>
  <h2 style="margin: 0">微博</h2>
</div>

    <!-- 操作区 -->
    <div style="margin-bottom: 20px">
      <textarea
        v-model="newContent"
        placeholder="写点什么吧..."
        style="width: 100%; height: 80px"
      />
      <br />
      <button @click="postWeibo">发布</button>
      <button @click="loadAll" style="margin-left: 10px">全部微博</button>
      <button @click="loadMine" style="margin-left: 10px">我的微博</button>
      <button @click="logout" style="margin-left: 10px">退出</button>
    </div>

    <hr />

    <!-- 微博列表 -->
    <ul>
      <li v-for="w in weiboList" :key="w.id" style="margin-bottom: 10px">
        <div v-if="editId !== w.id">
          {{ w.content }}
          <button @click="startEdit(w)">编辑</button>
          <button @click="deleteWeibo(w.id)">删除</button>
        </div>

        <div v-else>
          <input v-model="editContent" />
          <button @click="updateWeibo(w.id)">保存</button>
          <button @click="cancelEdit">取消</button>
        </div>
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
const displayName = ref('Guest')
const weiboList = ref([])
const newContent = ref('')
const editId = ref(null)
const editContent = ref('')
const userId = ref(null)

/** 全部微博 */
async function loadAll() {
  const res = await axios.post('https://miniweibo-backend.onrender.com/weibo/list')
  weiboList.value = res.data
}

/** 我的微博 */
async function loadMine() {
  if (!userId.value) return
  const res = await axios.post(`https://miniweibo-backend.onrender.com/user/${userId.value}`)
  weiboList.value = res.data
}

/** 发微博 */
async function postWeibo() {
  if (!newContent.value.trim()) return
  await axios.post('https://miniweibo-backend.onrender.com/post', {
    content: newContent.value
  })
  newContent.value = ''
  loadAll()
}

/** 删除 */
async function deleteWeibo(id) {
  await axios.delete(`https://miniweibo-backend.onrender.com/${id}`)
  loadAll()
}

/** 编辑 */
function startEdit(w) {
  editId.value = w.id
  editContent.value = w.content
}
function cancelEdit() {
  editId.value = null
}

/** 更新 */
async function updateWeibo(id) {
  await axios.put(`https://miniweibo-backend.onrender.com/weibo/${id}`, {
    content: editContent.value
  })
  editId.value = null
  loadAll()
}

/** 退出 */
async function logout() {
  await axios.post('https://miniweibo-backend.onrender.com/logout')
  router.push('/login')
}
onMounted(() => {
  const name = sessionStorage.getItem('username')
  if (name) {
    displayName.value = name
  }
})
onMounted(() => {
  const saved = sessionStorage.getItem('userId')
  if (!saved) {
    router.push('/login')
    return
  }
  userId.value = saved
  loadAll()
})
</script>

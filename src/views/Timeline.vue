<template>
  <div style="padding: 40px; max-width: 600px; margin: auto">
    <h2>微博</h2>

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

const weiboList = ref([])
const newContent = ref('')
const editId = ref(null)
const editContent = ref('')
const userId = ref(null)

/** 全部微博 */
async function loadAll() {
  const res = await axios.post('http://localhost:8080/weibo/list')
  weiboList.value = res.data
}

/** 我的微博 */
async function loadMine() {
  if (!userId.value) return
  const res = await axios.post(`http://localhost:8080/user/${userId.value}`)
  weiboList.value = res.data
}

/** 发微博 */
async function postWeibo() {
  if (!newContent.value.trim()) return
  await axios.post('http://localhost:8080/post', {
    content: newContent.value
  })
  newContent.value = ''
  loadAll()
}

/** 删除 */
async function deleteWeibo(id) {
  await axios.delete(`http://localhost:8080/${id}`)
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
  await axios.put(`http://localhost:8080/weibo/${id}`, {
    content: editContent.value
  })
  editId.value = null
  loadAll()
}

/** 退出 */
async function logout() {
  await axios.post('http://localhost:8080/logout')
  router.push('/login')
}

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

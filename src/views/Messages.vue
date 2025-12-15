<template>
  <div style="padding: 40px; max-width: 600px; margin: auto">
    <h2>私信</h2>

    <!-- 发送私信 -->
    <div style="margin-bottom: 20px">
      <input
        v-model="newReceiverId"
        placeholder="接收者用户ID"
        style="width: 30%; margin-right: 5px"
      />
      <input
        v-model="newContent"
        placeholder="私信内容"
        style="width: 50%; margin-right: 5px"
      />
      <button @click="sendMessage">发送</button>
    </div>

    <hr />

    <!-- 私信列表 -->
    <ul>
      <li v-for="m in messages" :key="m.id" style="margin-bottom: 15px">
        <div style="font-size: 13px; color: #555">
          来自：{{ m.sender.username }}（ID: {{ m.sender.id }}）
        </div>

        <!-- 查看 / 编辑 -->
        <div v-if="editId !== m.id">
          {{ m.content }}
          <button @click="startEdit(m)">编辑</button>
          <button @click="deleteMessage(m.id)">删除</button>
        </div>

        <div v-else>
          <input v-model="editContent" style="width: 70%" />
          <button @click="updateMessage(m.id)">保存</button>
          <button @click="cancelEdit">取消</button>
        </div>
      </li>
    </ul>

    <p v-if="messages.length === 0">暂无私信</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

axios.defaults.withCredentials = true

const router = useRouter()
const messages = ref([])

const newReceiverId = ref('')
const newContent = ref('')

const editId = ref(null)
const editContent = ref('')

const backend = 'https://miniweibo-backend.onrender.com'

/** 查私信 */
async function loadMessages() {
  const userId = sessionStorage.getItem('userId')
  if (!userId) {
    router.push('/login')
    return
  }

  const res = await axios.post(
    `${backend}/messages`,
    null,
    {
      params: { receiverId: userId }
    }
  )
  messages.value = res.data
}

/** 发私信 */
async function sendMessage() {
  if (!newReceiverId.value || !newContent.value.trim()) return

  await axios.post(
    `${backend}/addMessage`,
    null,
    {
      params: {
        receiverId: newReceiverId.value,
        content: newContent.value
      }
    }
  )

  newContent.value = ''
  loadMessages()
}

/** 删私信 */
async function deleteMessage(id) {
  await axios.post(
    `${backend}/deleteMessage`,
    null,
    {
      params: { id }
    }
  )
  loadMessages()
}

/** 编辑 */
function startEdit(m) {
  editId.value = m.id
  editContent.value = m.content
}

function cancelEdit() {
  editId.value = null
  editContent.value = ''
}

/** 更新私信 */
async function updateMessage(id) {
  await axios.post(
    `${backend}/updateMessage`,
    null,
    {
      params: {
        id,
        content: editContent.value
      }
    }
  )

  cancelEdit()
  loadMessages()
}

onMounted(loadMessages)
</script>

<template>
  <div style="padding: 40px; max-width: 600px; margin: auto">
    <div style="
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  ">
      <div style="font-size: 14px; color: #555">
        👤 {{ displayName }}
      </div>
      <h2 style="margin: 0">微博</h2>
    </div>

    <!-- 操作区 -->
    <div style="margin-bottom: 20px">
      <textarea v-model="newContent" placeholder="写点什么吧..." style="width: 100%; height: 80px" />
      <br />
      <button @click="postWeibo">发布</button>
      <input v-model="searchKeyword" placeholder="搜索微博内容..." style="width: 60%; margin-left: 10px" />
      <button @click="searchWeibo">搜索</button>
      <button @click="logout" style="margin-left: 10px">退出</button>
      <button @click="goMessages" style="margin-left: 10px">私信</button>
      <button @click="loadAll" style="margin-left: 10px">全部微博</button>
      <button @click="loadMine" style="margin-left: 10px">我的微博</button>
      <button @click="goUsers" style="margin-left: 10px">用户列表</button>
    </div>

    <hr />
    <ul>
      <li v-for="w in weiboList" :key="w.id" style="margin-bottom: 10px">
      <!-- 评论区 -->
        <div style="margin-top: 10px; padding-left: 20px">
          <div v-for="c in commentMap[w.id]" :key="c.id" style="font-size: 14px">
            <span v-if="editingCommentId !== c.id">
              💬 {{ c.content }}
              <button @click="startEditComment(c)">编辑</button>
              <button @click="deleteComment(w.id, c.id)">删除</button>
            </span>

            <span v-else>
              <input v-model="editingCommentContent" style="width: 60%" />
              <button @click="saveEditComment(w.id, c.id)">保存</button>
              <button @click="cancelEditComment">取消</button>
            </span>
          </div>
          <input v-model="commentInput[w.id]" placeholder="写评论..." style="width: 80%; margin-top: 5px" />
          <button @click="addComment(w.id)">评论</button>
        </div>
        <!-- 微博本体 -->
        <div v-if="editId !== w.id">
          {{ w.content }}
          <button @click="startEdit(w)">编辑</button> <!-- 微博列表 -->
          <button @click="deleteWeibo(w.id)">删除</button>
          <button @click="likeWeibo(w.id)">👍 {{ w.likeCount }}</button>
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
const commentMap = ref({})
const commentInput = ref({})
const newContent = ref('')
const searchKeyword = ref('')
const editId = ref(null)
const editContent = ref('')
const userId = ref(null)

/** 全部微博 */
async function loadAll() {
  const res = await axios.post('https://miniweibo-backend.onrender.com/weibo/list')
  weiboList.value = res.data
  res.data.forEach(w => loadComments(w.id))
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
async function searchWeibo() {
  if (!searchKeyword.value.trim()) {
    loadAll()
    return
  }
  const res = await axios.get(
    `https://miniweibo-backend.onrender.com/weibo/search?keyword=${searchKeyword.value}`
  )
  weiboList.value = res.data
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
async function likeWeibo(id) {
  await axios.post(`https://miniweibo-backend.onrender.com/weibo/${id}/like`)
  loadAll()
}
async function addComment(weiboId) {
  const content = commentInput.value[weiboId]
  if (!content || !content.trim()) return

  await axios.post(
    'https://miniweibo-backend.onrender.com/addComment',
    {
      weiboId: weiboId,
      content: content
    }
  )

  commentInput.value[weiboId] = ''
  loadComments(weiboId)
}
async function deleteComment(weiboId, commentId) {
  await axios.post(
    'https://miniweibo-backend.onrender.com/deleteComment',
    null,
    {
      params: {
        commentId: commentId
      }
    }
  )

  loadComments(weiboId)
}
const editingCommentId = ref(null)
const editingCommentContent = ref('')

function startEditComment(c) {
  editingCommentId.value = c.id
  editingCommentContent.value = c.content
}

function cancelEditComment() {
  editingCommentId.value = null
  editingCommentContent.value = ''
}

async function saveEditComment(weiboId, commentId) {
  await axios.post(
    'https://miniweibo-backend.onrender.com/updateComment',
    {
      content: editingCommentContent.value
    },
    {
      params: {
        commentId: commentId
      }
    }
  )

  cancelEditComment()
  loadComments(weiboId)
}

async function loadComments(weiboId) {
  const res = await axios.get(
    'https://miniweibo-backend.onrender.com/getCommentsByWeibo',
    {
      params: {
        weiboId: weiboId
      }
    }
  )
  commentMap.value[weiboId] = res.data
}
function goMessages() {
  router.push('/messages')
}
function goUsers() {
  router.push('/users')
}
async function followUser(targetUserId) {
  await axios.post(
    'https://miniweibo-backend.onrender.com/follow',
    null,
    {
      params: {
        following_id: targetUserId
      }
    }
  )

  // 操作完直接刷新列表
  loadAll()
}




</script>

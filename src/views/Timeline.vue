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
      <h2 style="margin: 0">ブログ</h2>
    </div>

    <!-- 操作区 -->
    <div style="margin-bottom: 20px">
      <textarea
  v-model="newContent"
  placeholder="何か書いてみよう…"
  style="width: 100%; height: 80px">
</textarea>
      <br />
      <button @click="postWeibo">投稿する</button>
      <input v-model="searchKeyword" placeholder="検索ブログ内容..." style="width: 60%; margin-left: 10px" />
      <button @click="searchWeibo">検索</button>
      <button @click="logout" style="margin-left: 10px">ログアウト</button>
      <button @click="goMessages" style="margin-left: 10px">ダイレクトメッセージ</button>
      <button @click="loadAll" style="margin-left: 10px">全てのブログ</button>
      <button @click="loadMine" style="margin-left: 10px">私の全てのブログ</button>
      <button @click="goUsers" style="margin-left: 10px">ユーザー一覧</button>
      <button @click="goNotifications" style="margin-left: 10px">通知</button>
      <button @click="goFavorites" style="margin-left: 10px">お気に入り</button>
      <button @click="goViewHistory" style="margin-left: 10px">閲覧履歴</button>

    </div>

    <hr />
    <ul>
      <li v-for="w in weiboList" :key="w.id" style="margin-bottom: 10px">
        <!-- 评论区 -->
        <!-- 评论区 -->
        <div style="margin-top: 10px; padding-left: 20px">
          <button @click="toggleComments(w.id)">
            {{ openedWeiboId === w.id ? 'コメントを閉じる' : 'コメントを見る' }}
          </button>
          <div v-if="openedWeiboId === w.id">
            <div v-for="c in commentMap[w.id]" :key="c.id" style="font-size: 14px">
              <template v-if="editingCommentId === c.id">
                <input v-model="editingCommentContent" />
                <button @click="saveEditComment(w.id, c.id)">保存</button>
                <button @click="cancelEditComment">キャンセル</button>
              </template>

              <template v-else>
                💬 {{ c.content }}
                <button @click="startEditComment(c)">編集</button>
                <button @click="deleteComment(w.id, c.id)">削除</button>
              </template>
            </div>

            <input v-model="commentInput[w.id]" placeholder="コメントを書く…" style="width: 80%; margin-top: 5px" />
            <button @click="addComment(w.id)">コメント</button>
          </div>

          <!-- 微博本体 -->
          <div v-if="editId !== w.id">
            {{ w.content }}
            <button @click="startEdit(w)">編集</button> <!-- 微博列表 -->
            <button @click="deleteWeibo(w.id)">削除</button>
            <button @click="likeWeibo(w.id)">👍 {{ w.likeCount }}</button>
            <button @click="toggleFavorite(w.id)">⭐ お気に入り</button>
            <button @click="goReport(w.id)">🚨 通報</button>

          </div>
          <div v-else>
            <input v-model="editContent" />
            <button @click="updateWeibo(w.id)">保存</button>
            <button @click="cancelEdit">キャンセル</button>
          </div>
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
const openedWeiboId = ref(null)
const commentInput = ref({})
const newContent = ref('')
const searchKeyword = ref('')
const editId = ref(null)
const editContent = ref('')
const userId = ref(null)


/** 全部微博 */
async function loadAll() {
  try {
    const res = await axios.post(
      '/api/weibo/list'
    )
    weiboList.value = res.data
  } catch (e) {
    alert(e.response.data)
  }
}

/** 搜索微博 */
async function searchWeibo() {
  try {
    const res = await axios.post(
      '/api/weibo/search',
      null,
      {
        params: { keyword: searchKeyword.value }
      }
    )
    weiboList.value = res.data
  } catch (e) {
    alert(e.response.data)
  }
}

/** 我的微博 */
async function loadMine() {
  const res = await axios.get(
    '/api/weibo/my'
  )
  weiboList.value = res.data
}
function goViewHistory() {
  router.push('/view-history')
}

/** 发微博 */
async function postWeibo() {
  try {
    console.log("发送内容:", newContent.value)
    await axios.post(
      '/api/post',
      { content: newContent.value }
    )
    newContent.value = ''
    loadAll()
  } catch (e) {
    alert(e.response.data)
  }
}
async function toggleFavorite(weiboId) {
  await axios.post(
    '/api/favorites',
    null,
    {
      params: { weiboId }
    }
  )
  loadAll()
}

/** 删除 微博*/
async function deleteWeibo(id) {
  try {
    await axios.delete(
      `/api/weibo/${id}`
    )
    loadAll()
  } catch (e) {
    alert(e.response.data)
  }
}

/** 编辑 */
function startEdit(w) {
  editId.value = w.id
  editContent.value = w.content
}
function cancelEdit() {
  editId.value = null
}

/** 更新 微博 */
async function updateWeibo(id) {
  try {
    await axios.put(
      `/api/weibo/${id}`,
      {
        content: editContent.value
      }
    )
    editId.value = null
    loadAll()
  } catch (e) {
    alert(e.response.data)
  }
}


/** 退出 */
async function logout() {
  await axios.post('/api/logout')
  router.push('/login')
}

/** 页面加载时 */
onMounted(() => {
  // 显示用户名（有就显示，没有就算了）
  const name = sessionStorage.getItem('username')
  if (name) {
    displayName.value = name
  }
  userId.value = sessionStorage.getItem('userId')
  loadAll()
})

async function likeWeibo(id) {
  console.log("🔥 like clicked", id)
  await axios.post(`/api/weibo/${id}/like`)
  loadAll()
}
async function addComment(weiboId) {
  try {
    await axios.post(
      '/api/addComment',
      {
        weiboId: weiboId,
        content: commentInput.value[weiboId]
      }
    )
    commentInput.value[weiboId] = ''
    loadComments(weiboId)
  } catch (e) {
    alert(e.response.data)
  }
}

async function deleteComment(weiboId, commentId) {
  try {
    await axios.post(
      '/api/deleteComment',
      null,
      {
        params: { commentId }
      }
    )
    loadComments(weiboId)
  } catch (e) {
    alert(e.response.data)
  }
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
  try {
    await axios.put(
      `/api/comment/${commentId}`,
      {
        content: editingCommentContent.value
      }
    )
    cancelEditComment()
    loadComments(weiboId)
  } catch (e) {
    alert(e.response.data)
  }
}


function toggleComments(weiboId) {
  if (openedWeiboId.value === weiboId) {
    openedWeiboId.value = null
    return
  }

  openedWeiboId.value = weiboId

  if (!commentMap.value[weiboId]) {
    loadComments(weiboId)
  }
}


async function loadComments(weiboId) {
  try {
    const res = await axios.get(
      '/api/getCommentsByWeibo',
      {
        params: { weiboId }
      }
    )
    commentMap.value[weiboId] = res.data
  } catch (e) {
    alert(e.response.data)
  }
}

function goNotifications() {
  router.push('/notifications')
}
function goFavorites() {
  router.push('/favorites')
}

function goMessages() {
  router.push('/messages')
}
function goReport(weiboId) {
  router.push({
    path: '/report',
    query: {
      targetType: 'WEIBO',
      targetId: weiboId
    }
  })
}
function goUsers() {
  router.push('/users')
}
async function followUser(targetUserId) {
  await axios.post(
    '/api/follow',
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

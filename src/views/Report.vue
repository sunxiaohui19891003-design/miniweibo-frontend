<template>
  <div style="padding: 40px; max-width: 500px; margin: auto">
    <h2>🚨 通報</h2>

    <div style="margin-bottom: 15px">
      <label>通報对象类型</label><br />
      <select v-model="targetType">
        <option value="WEIBO">ブログ</option>
        <option value="COMMENT">コメント</option>
      </select>
    </div>

    <div style="margin-bottom: 15px">
      <label>通報对象 ID</label><br />
      <input v-model="targetId" placeholder="请输入ID" />
    </div>

    <div style="margin-bottom: 15px">
      <label>通報原因</label><br />
      <select v-model="reasonType">
        <option value="SPAM">垃圾信息</option>
        <option value="ABUSE">辱骂攻击</option>
        <option value="ILLEGAL">违法内容</option>
        <option value="OTHER">其他</option>
      </select>
    </div>

    <div style="margin-bottom: 20px">
      <label>補足説明（任意）</label><br />
      <textarea
        v-model="description"
        style="width: 100%; height: 80px"
        placeholder="入力しなくても構いません"
      />
    </div>

    <button @click="submitReport">通報を送信</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true

const targetType = ref('WEIBO')
const targetId = ref('')
const reasonType = ref('SPAM')
const description = ref('')

async function submitReport() {
  if (!targetId.value) {
    alert('入力してください targetId')
    return
  }

  try {
    await axios.post(
      'https://miniweibo-backend.onrender.com/report',
      null,
      {
        params: {
          targetType: targetType.value,
          targetId: targetId.value,
          reasonType: reasonType.value,
          description: description.value
        }
      }
    )
    alert('举报成功')
  } catch (e) {
    alert('通報に失敗しました。ログインしていることを確認してください。')
  }
}
</script>

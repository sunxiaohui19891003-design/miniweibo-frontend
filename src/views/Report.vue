<template>
  <div style="padding: 40px; max-width: 500px; margin: auto">
    <h2>🚨 举报</h2>

    <div style="margin-bottom: 15px">
      <label>举报对象类型</label><br />
      <select v-model="targetType">
        <option value="WEIBO">微博</option>
        <option value="COMMENT">评论</option>
      </select>
    </div>

    <div style="margin-bottom: 15px">
      <label>举报对象 ID</label><br />
      <input v-model="targetId" placeholder="请输入ID" />
    </div>

    <div style="margin-bottom: 15px">
      <label>举报原因</label><br />
      <select v-model="reasonType">
        <option value="SPAM">垃圾信息</option>
        <option value="ABUSE">辱骂攻击</option>
        <option value="ILLEGAL">违法内容</option>
        <option value="OTHER">其他</option>
      </select>
    </div>

    <div style="margin-bottom: 20px">
      <label>补充说明（可选）</label><br />
      <textarea
        v-model="description"
        style="width: 100%; height: 80px"
        placeholder="可以不填"
      />
    </div>

    <button @click="submitReport">提交举报</button>
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
    alert('请输入 targetId')
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
    alert('举报失败，请确认已登录')
  }
}
</script>

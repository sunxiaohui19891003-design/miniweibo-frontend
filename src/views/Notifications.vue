<template>
  <div style="padding: 40px; max-width: 600px; margin: auto">
    <h2>通知</h2>

    <div v-if="notifications.length === 0" style="color: #888">
      まだ通知はありません
    </div>

    <ul>
      <li
        v-for="n in notifications"
        :key="n.id"
        style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px"
      >
        <div>
          <b>{{ n.type }}</b>
          ｜ユーザーから {{ n.fromUserId }}
        </div>

        <div style="font-size: 12px; color: #666">
          targetId: {{ n.targetId }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true

const notifications = ref([])

onMounted(async () => {
  try {
    const res = await axios.get(
      '/api/notifications'
    )
    notifications.value = res.data
  } catch (e) {
    console.error('通知の読み込みに失敗しました', e)
  }
})
</script>

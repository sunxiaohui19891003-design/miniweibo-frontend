<template>
    <div style="padding: 40px; max-width: 600px; margin: auto">
        <h2>自分の投稿</h2>
        <button @click="goBack" style="margin-bottom: 20px">
            返回
        </button>
        <div v-if="weiboList.length === 0" style="color: #888">
            まだお気に入りはありません
        </div>

        <ul>
            <li v-for="w in weiboList" :key="w.id" style="margin-bottom: 12px">
                {{ w.content }}
                <button @click="toggleFavorite(w.id)" style="margin-left: 10px">
                    お気に入りを解除
                </button>
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

async function loadFavorites() {
    const res = await axios.get(
        'https://miniweibo-backend.onrender.com/favorites'
    )
    weiboList.value = res.data
}

async function toggleFavorite(weiboId) {
    await axios.post(
        'https://miniweibo-backend.onrender.com/favorites',
        null,
        {
            params: { weiboId }
        }
    )
    loadFavorites()
}

function goBack() {
   router.push('/timeline')
}


onMounted(() => {
    loadFavorites()
})
</script>

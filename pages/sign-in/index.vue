<script setup>
import { ref } from "vue"

const name = ref('')
const email = ref('')

const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login(name.value, email.value)
    alert('Sent');
    navigateTo('/dashboard')
  } catch(error) {
    console.error(error)
  }
}

watch(name, (newVal) => {console.log(newVal)})
watch(email, (newVal) => {console.log(newVal)})

</script>

<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
        <form 
            @submit.prevent="handleLogin"
            class="flex flex-col bg-white p-6 shadow-lg rounded-xl w-96 space-y-4"
            >
            <h2 class="text-2xl font-semibold text-center text-gray-700">Sign In</h2>

            <label for="name" class="flex flex-col">
                <span class="text-gray-600 font-medium">Name</span>
                <input 
                    id="name" 
                    v-model="name"
                    class="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="Enter your name"
                />
            </label>

            <label for="email" class="flex flex-col">
                <span class="text-gray-600 font-medium">Email</span>
                <input 
                    id="email" 
                    v-model="email"
                    type="email"
                    class="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    placeholder="Enter your email"
                />
            </label>

            <button 
                type="submit" 
                class="bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 rounded-lg shadow-md"
                >
                Sign in
            </button>
        </form>
    </div>
</template>
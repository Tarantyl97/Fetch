<script setup>
const { logout } = useAuth();
const { fetchBreeds, fetchAllDogs, searchDogs, fetchNextPage, nextPage, dogs, loading, error, updateSort, sortOption, favoriteDogs, matchedDog, toggleFavorite, matchFavoriteDogs } = useDogs();
const { searchLocations, locations, fetchNextPageLocations, locationsLoading, locationsError, locationsNextPage} = useLocations()

const showDogsTable = ref(false);
const showMatches = ref(false);
const breed = ref('');
const zipCode = ref('');
const ageMin = ref(null);
const ageMax = ref(null);

const city = ref('');
const states = ref('');
const geoBoundingBox = ref(null);
const size = ref(25);

const fetchDogs = async () => {
    showDogsTable.value = false
    showMatches.value = false
    try {
        const result = await fetchBreeds();
    } catch (err) {
        console.error(err);
    }
};

const getAllDogs = async () => {
    showDogsTable.value = true
    try {
        const result = await fetchAllDogs()
    } catch(error) {
        console.error(error)
    }
}

const handleSearchDogs = async () => {
    showDogsTable.value = true
    await searchDogs({
        breed: breed.value || undefined,
        zipCode: zipCode.value || undefined,
        ageMin: ageMin.value || undefined,
        ageMax: ageMax.value || undefined,
    });
};

const handleSearchLocations = async () => {
    await searchLocations({
        city: city.value || undefined,
        states: states.value ? states.value.split(',').map(s => s.trim()) : undefined,
        geoBoundingBox: geoBoundingBox.value || undefined,
        size: size.value || 25,
    });
};

const handleNextPage = async () => {
    await fetchNextPageLocations({
        city: city.value || undefined,
        states: states.value ? states.value.split(',').map(s => s.trim()) : undefined,
        size: size.value || 25,
    });
};

const handleShowMatches = () => {
    showMatches.value = true
    getAllDogs()
}

onMounted(() => {
    // fetchAllDogs()
})

</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <div class="flex space-x-4 mb-6">
            <button 
                @click="fetchDogs"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                Watch Available Breeds
            </button>
            <button 
                @click="getAllDogs"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                >
                Fetch All Dogs
            </button>
        </div>

        <div class="flex justify-around gap-4">
            <form @submit.prevent="handleSearchDogs" class="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-6">
                <h2 class="text-xl font-semibold mb-4">Search by dogs</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700">Breed:</label>
                        <input v-model="breed" placeholder="e.g. Affenpinscher" class="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label class="block text-gray-700">ZIP Code:</label>
                        <input v-model="zipCode" placeholder="e.g. 10001" class="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label class="block text-gray-700">Age Min:</label>
                        <input v-model="ageMin" type="number" class="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label class="block text-gray-700">Age Max:</label>
                        <input v-model="ageMax" type="number" class="w-full p-2 border rounded-md" />
                    </div>
                </div>
                <button 
                    type="submit"
                    class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                    Search
                </button>
            </form>

            <form @submit.prevent="handleSearchLocations" class="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mb-6">
                <h2 class="text-xl font-semibold mb-4">Search by city</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700">City:</label>
                        <input v-model="city" placeholder="e.g. New York" class="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label class="block text-gray-700">States (comma-separated):</label>
                        <input v-model="states" placeholder="e.g. NY, CA" class="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label class="block text-gray-700">Results per page:</label>
                        <input v-model="size" type="number" class="w-full p-2 border rounded-md" />
                    </div>
                </div>
                <button 
                    type="submit"
                    class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                    Search
                </button>
            </form>
        </div>

        <p v-if="error" class="text-red-500">{{ error }}</p>

        <p v-if="loading" class="text-gray-600">Loading...2</p>

        <div v-if="locations.length > 0" class="overflow-x-auto w-full max-w-4xl">
            <table class="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-blue-600 text-white">
                    <tr>
                        <th class="py-2 px-4">№</th>
                        <th class="py-2 px-4">ZIP Code</th>
                        <th class="py-2 px-4">City</th>
                        <th class="py-2 px-4">State</th>
                        <th class="py-2 px-4">County</th>
                        <th class="py-2 px-4">Latitude</th>
                        <th class="py-2 px-4">Longitude</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(location, index) in locations" :key="location.zip_code" class="border-b hover:bg-gray-100 transition">
                        <td class="py-2 px-4">{{ index + 1 }}</td>
                        <td class="py-2 px-4">{{ location.zip_code }}</td>
                        <td class="py-2 px-4">{{ location.city }}</td>
                        <td class="py-2 px-4">{{ location.state }}</td>
                        <td class="py-2 px-4">{{ location.county }}</td>
                        <td class="py-2 px-4">{{ location.latitude }}</td>
                        <td class="py-2 px-4">{{ location.longitude }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else-if="!locationsLoading && !locationsError" class="text-gray-600">No locations found. Try different search criteria.</p>

        <button 
            v-if="locationsNextPage"
            @click="handleNextPage"
            class="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
            Next Page
        </button>

        <div v-if="dogs.length > 0 && showDogsTable" class="overflow-x-auto w-full max-w-4xl">
            <div class="mb-4">
                <label class="text-gray-700 font-medium mr-2">Sort by:</label>
                <select 
                    v-model="sortOption" 
                    @change="updateSort(sortOption)"
                    class="p-2 border rounded-lg shadow-sm bg-white"
                    >
                    <option value="breed:asc">Breed (A-Z)</option>
                    <option value="breed:desc">Breed (Z-A)</option>
                    <option value="name:asc">Name (A-Z)</option>
                    <option value="name:desc">Name (Z-A)</option>
                </select>
            </div>
            <table class="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-blue-600 text-white">
                    <tr>
                        <th>№</th>
                        <th class="py-2 px-4">Фото</th>
                        <th class="py-2 px-4">Имя</th>
                        <th class="py-2 px-4">Возраст</th>
                        <th class="py-2 px-4">Порода</th>
                        <th class="py-2 px-4">ZIP-код</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(dog, index) in dogs" :key="dog.id" class="border-b hover:bg-gray-100 transition">
                        <td class="py-2 px-4 text-center">{{ index + 1 }}</td>
                        <td class="py-2 px-4">
                            <img :src="dog.img" alt="dog" class="w-16 h-16 object-cover rounded-full">
                        </td>
                        <td class="py-2 px-4">{{ dog.name }}</td>
                        <td class="py-2 px-4">{{ dog.age }}</td>
                        <td class="py-2 px-4">{{ dog.breed }}</td>
                        <td class="py-2 px-4">{{ dog.zip_code }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button 
            v-if="nextPage && showDogsTable"
            @click="fetchNextPage"
            class="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
            Next Page
        </button>

        <button 
            @click="handleShowMatches"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition mt-4"
            >
            Watch Matching
        </button>

        <div
            v-if="showMatches"
            class="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 class="text-3xl font-semibold mb-6 text-gray-800">Favorite Dogs & Matching</h1>

            <p v-if="error" class="text-red-500">{{ error }}</p>

            <p v-if="loading" class="text-gray-600">Loading...</p>

            <div v-if="dogs.length > 0" class="overflow-x-auto w-full max-w-4xl">
                <table class="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead class="bg-blue-600 text-white">
                        <tr>
                            <th class="py-2 px-4">Select</th>
                            <th class="py-2 px-4">Photo</th>
                            <th class="py-2 px-4">Name</th>
                            <th class="py-2 px-4">Age</th>
                            <th class="py-2 px-4">Breed</th>
                            <th class="py-2 px-4">ZIP Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dog in dogs" :key="dog.id" class="border-b hover:bg-gray-100 transition">
                            <td class="py-2 px-4 text-center">
                                <input 
                                    type="checkbox" 
                                    :checked="favoriteDogs.includes(dog.id)" 
                                    @change="toggleFavorite(dog.id)"
                                />
                            </td>
                            <td class="py-2 px-4">
                                <img :src="dog.img" alt="dog" class="w-16 h-16 object-cover rounded-full">
                            </td>
                            <td class="py-2 px-4">{{ dog.name }}</td>
                            <td class="py-2 px-4">{{ dog.age }}</td>
                            <td class="py-2 px-4">{{ dog.breed }}</td>
                            <td class="py-2 px-4">{{ dog.zip_code }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex gap-4">
                <button 
                    v-if="nextPage && showDogsTable"
                    @click="fetchNextPage"
                    class="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                    Next Page
                </button>

                <button 
                    @click="matchFavoriteDogs"
                    class="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                    Find Match
                </button>

                <button 
                    @click="showMatches = false"
                    class="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                    Cancel
                </button>
            </div>

            <div v-if="matchedDog" class="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 class="text-xl font-semibold text-center mb-4">Your Match 🐶</h2>
                <div class="flex flex-col items-center">
                    <img :src="matchedDog.img" :alt="matchedDog.name" class="w-32 h-32 object-cover rounded-full">
                    <p class="text-lg font-medium mt-2">{{ matchedDog.name }}</p>
                    <p class="text-gray-600">{{ matchedDog.breed }} | Age: {{ matchedDog.age }}</p>
                    <p class="text-gray-600">ZIP Code: {{ matchedDog.zip_code }}</p>
                </div>
            </div>
        </div>

        <div v-if="dogs.length > 0 && !showDogsTable" class="overflow-x-auto w-full max-w-2xl mt-4">
            <table class="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-blue-600 text-white">
                    <tr>
                        <th class="py-2 px-4">№</th>
                        <th class="py-2 px-4">Breed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(breeds, index) in dogs" :key="index" class="border-b hover:bg-gray-100 transition">
                        <td class="py-2 px-4">{{ index + 1 }}</td>
                        <td class="py-2 px-4">{{ breeds }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button 
            @click="logout"
            class="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
            Logout
        </button>
    </div>
</template>
import { ref, watch } from 'vue';

export const useDogs = () => {

    const API_URL ='https://frontend-take-home-service.fetch.com';

    const dogs = ref<any[]>([]);
    const favoriteDogs = ref<string[]>([]);
    const matchedDog = ref<any | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const nextPage = ref<string | null>(null);
    const sortOption = ref<'breed:asc' | 'breed:desc' | 'name:asc' | 'name:desc'>('breed:asc');

    const toggleFavorite = (dogId: string) => {
        if (favoriteDogs.value.includes(dogId)) {
            favoriteDogs.value = favoriteDogs.value.filter(id => id !== dogId);
        } else {
            favoriteDogs.value.push(dogId);
        }
    };

    const matchFavoriteDogs = async () => {
        if (favoriteDogs.value.length === 0) {
            error.value = "Select at least one dog to match!";
            return;
        }
        loading.value = true;
        error.value = null;
        try {
            const response = await $fetch(`${API_URL}/dogs/match`, {
                method: 'POST',
                credentials: 'include',
                body: favoriteDogs.value,
            });

            console.log('Matched Dog ID:', response.match);

            const matchedDogData = await $fetch(`${API_URL}/dogs`, {
                method: 'POST',
                credentials: 'include',
                body: [response.match],
            });

            matchedDog.value = matchedDogData[0];
        } catch (error) {
            error.value = 'Error generating match';
            console.error('Match error:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchBreeds = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await $fetch(`${API_URL}/dogs/breeds`, {
                method: 'GET',
                credentials: 'include',
            });
            console.log('Breeds:', response);
            dogs.value = response;
        } catch (error) {
            error.value = 'Error fatching data';
            console.error('Fetch error:', error);

            if (error.response?.status === 401) { 
                alert('Unauthorized! Redirecting to login...');
                navigateTo('/sign-in');
            } else {
                error.value = 'Error fetching data';
            }
        } finally {
            loading.value = false;
        }
    };

    watch(dogs, (newVal) => {
        console.log('Dogs updated:', newVal);
    });

    const fetchAllDogs = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await $fetch(`${API_URL}/dogs/search`, {
                method: 'GET',
                credentials: 'include',
                query: { size: 25, sort: sortOption.value },
            });

            console.log('Dog IDs:', response.resultIds);
            nextPage.value = response.next;

            if (!response.resultIds || response.resultIds.length === 0) {
                throw new Error('No dogs found');
            }

            const fullDogs = await $fetch(`${API_URL}/dogs`, {
                method: 'POST',
                credentials: 'include',
                body: response.resultIds,
            });

            console.log('Full Dog Data:', fullDogs);
            dogs.value = fullDogs;
        } catch (error) {
            error.value = 'Error fetching dogs';
            console.error('Fetch error:', error);
        } finally {
            loading.value = false;
        }
    };

    const updateSort = (newSort: 'breed:asc' | 'breed:desc' | 'name:asc' | 'name:desc') => {
        sortOption.value = newSort;
        fetchAllDogs();
    };

    const searchDogs = async (filters: { breed?: string; zipCode?: string; ageMin?: number; ageMax?: number }) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await $fetch(`${API_URL}/dogs/search`, {
                method: 'GET',
                credentials: 'include',
                query: {
                    breeds: filters.breed ? [filters.breed] : undefined,
                    zipCodes: filters.zipCode ? [filters.zipCode] : undefined,
                    ageMin: filters.ageMin || undefined,
                    ageMax: filters.ageMax || undefined,
                    size: 25,
                    sort: 'breed:asc',
                },
            });

            console.log('Searched Dog IDs:', response.resultIds);

            if (!response.resultIds || response.resultIds.length === 0) {
                throw new Error('No dogs found');
            }

            const fullDogs = await $fetch(`${API_URL}/dogs`, {
                method: 'POST',
                credentials: 'include',
                body: response.resultIds,
            });

            console.log('Full Searched Dog Data:', fullDogs);
            dogs.value = fullDogs;
        } catch (error) {
            error.value = 'Error searching dogs';
            console.error('Search error:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchNextPage = async () => {
        if (!nextPage.value) return;
        loading.value = true;
        try {
            const response = await $fetch(`${API_URL}${nextPage.value}`, {
                method: 'GET',
                credentials: 'include',
            });

            console.log('Next Page Dog IDs:', response.resultIds);
            nextPage.value = response.next;

            if (response.resultIds.length === 0) return;

            const fullDogs = await $fetch(`${API_URL}/dogs`, {
                method: 'POST',
                credentials: 'include',
                body: response.resultIds,
            });

            dogs.value = [...dogs.value, ...fullDogs];
        } catch (error) {
            console.error('Pagination error:', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        dogs,
        loading,
        error,
        favoriteDogs,
        matchedDog,
        fetchBreeds,
        fetchAllDogs,
        searchDogs,
        fetchNextPage,
        nextPage,
        updateSort,
        sortOption,
        toggleFavorite,
        matchFavoriteDogs,
    };
};
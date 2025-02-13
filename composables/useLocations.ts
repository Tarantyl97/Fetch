import { ref } from 'vue';

export const useLocations = () => {
    const API_URL = 'https://frontend-take-home-service.fetch.com';

    const locations = ref<any[]>([]);
    const locationsLoading = ref(false);
    const locationsError = ref<string | null>(null);
    const locationsNextPage = ref<number | null>(null);
    const searchLocations = async (filters: { city?: string; states?: string[]; geoBoundingBox?: any; size?: number; from?: number }) => {
        locationsLoading.value = true;
        locationsError.value = null;
        try {
            const response = await $fetch(`${API_URL}/locations/search`, {
                method: 'POST',
                credentials: 'include',
                body: {
                    city: filters.city || undefined,
                    states: filters.states?.length ? filters.states : undefined,
                    geoBoundingBox: filters.geoBoundingBox || undefined,
                    size: filters.size || 25,
                    from: filters.from || 0,
                },
            });

            console.log('Locations:', response.results);
            locationsNextPage.value = response.total > (filters.from || 0) + (filters.size || 25) ? (filters.from || 0) + (filters.size || 25) : null;
            locations.value = response.results;
        } catch (error) {
            locationsError.value = 'Error searching locations';
            console.error('Search error:', error);
        } finally {
            locationsLoading.value = false;
        }
    };

    const fetchNextPageLocations = async (filters: { city?: string; states?: string[]; geoBoundingBox?: any; size?: number }) => {
        if (!locationsNextPage.value) return;
        locationsLoading.value = true;
        try {
            const response = await $fetch(`${API_URL}/locations/search`, {
                method: 'POST',
                credentials: 'include',
                body: {
                    city: filters.city || undefined,
                    states: filters.states?.length ? filters.states : undefined,
                    geoBoundingBox: filters.geoBoundingBox || undefined,
                    size: filters.size || 25,
                    from: locationsNextPage.value,
                },
            });

            console.log('Next Page Locations:', response.results);
            locationsNextPage.value = response.total > locationsNextPage.value + (filters.size || 25) ? locationsNextPage.value + (filters.size || 25) : null;
            locations.value = [...locations.value, ...response.results];
        } catch (error) {
            console.error('Pagination error:', error);
        } finally {
            locationsLoading.value = false;
        }
    };

    return {
        locations,
        locationsLoading,
        locationsError,
        locationsNextPage,
        searchLocations,
        fetchNextPageLocations,
    };
};

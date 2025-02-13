export const useAuth = () => {

    const API_URL ='https://frontend-take-home-service.fetch.com';

    const login = async (name, email) => {
      try {
        const response = await $fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: { name, email },
          credentials: 'include',
          responseType: 'json',
        });
        console.log(response)
        return response;
      } catch (error) {
          console.error('Login error:', error);
          throw error;
      }
    };

    const logout = async () => {
        try {
            await $fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            console.log('Logout successful');

        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return {
        login,
        logout,
    }
}
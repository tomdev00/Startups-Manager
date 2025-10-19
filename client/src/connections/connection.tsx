export const getCookie = (name: any) => {
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export const registerUser = async (values: any) => {
    try {
        const username = values.username;
        const password = values.password;

        const response = await fetch('http://[::1]:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'username': username,
                'password': password
            },
            body: JSON.stringify({}),
        });

        const data = await response.json();
        console.log(data);
        return data;

    } catch (err) {
        console.error('There was a problem with the fetch operation:', err);
    }
}

export const login = async (values: any) => {
    try {
        const username = values.username;
        const password = values.password;

        const response = await fetch('http://[::1]:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'username': username,
                'password': password
            },
            body: JSON.stringify({}),
        });

        const data = await response.json();

        if (data.token) {
            const expires = new Date(Date.now() + 86400000).toUTCString();
            document.cookie = `userToken=${data.token}; path=/; expires=${expires}; SameSite=None;`;
            console.log(document.cookie);
            getCookie('userToken');
            return data;
        } else {
            console.error('Token not received in the response');
        }
        return null;
    } catch (err) {
        console.error('There was a problem with the fetch operation:', err);
    }
}

export const profiles = async () => {
    try {
        const token = getCookie('userToken');

        const response = await fetch('http://[::1]:8080/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        });

        if (!response.ok) {
            console.log(response)
        }

        const data = await response.json();
        return (data);

    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }
};

export const showStartups = async () => {
    const token = getCookie('userToken');

    try {
        const response = await fetch('http://[::1]:8080/startups', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const startups = await response.json();
        return startups;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
};

export const addStartup = async (name: string) => {
    const token = getCookie('userToken');

    const response = await fetch(`http://localhost:8080/startups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'name': name
        },
        body: JSON.stringify({})
    });
    const data = await response.json();
    return data;
};

export const updateStartup = async (idStartup: string | number, name: string) => {
    const token = getCookie('userToken');

    const response = await fetch(`http://localhost:8080/startups/${idStartup}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'name': name
        },
        body: JSON.stringify({})
    });
    const data = await response.json();
    return data;
};

export const deleteStartup = async (startupId: number | string) => {
    const token = getCookie('userToken');
    const response = await fetch(`http://localhost:8080/startups/${startupId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
        body: JSON.stringify({})
    });
    const data = await response.json();
    return data
};

export const showStartupById = async (idStartup: string | number) => {
    const token = getCookie('userToken');

    try {
        const response = await fetch(`http://[::1]:8080/startups/${idStartup}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const startups = await response.json();
        return startups;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
};

export const favourites = async () => {
    const token = getCookie('userToken');
    const user: any = await profiles();
    const response = await fetch(`http://[::1]:8080/users/${user.id}/favourites`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
    });
    const data = await response.json();
    if (Array.isArray(data)) {
        const startups = await Promise.all(data.map(async (item) => {
            if (item.hasOwnProperty('id_startup')) {
                return await showStartupById(item.id_startup);
            }
        }));
        return startups.filter(Boolean);
    } else {
        console.error('Expected data to be an array, but received:', data);
        return [];
    }
};

export const addToFavourites = async (startupId: string | number) => {
    const token = getCookie('userToken');
    const user: any = await profiles();
    const response = await fetch(`http://[::1]:8080/users/${user.id}/favourites/${startupId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        throw new Error('Failed to add startup to favorites');
    }

    const data = await response.json();
    return data;
};

export const removeFromFavourites = async (startupId: string | number) => {
    const token = getCookie('userToken');
    const user: any = await profiles();
    const response = await fetch(`http://[::1]:8080/users/${user.id}/favourites/${startupId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        throw new Error('Failed to add startup to favorites');
    }

    const data = await response.json();
    return data;
};

export const isAdminFunc = async () => {
    const user = await profiles()
    if (user.role === "admin") { return true }
    else { return false };
}
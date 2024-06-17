export const login = () => {
    localStorage.setItem('isAdminLoggedIn', 'true');
};

export const logout = () => {
    localStorage.removeItem('isAdminLoggedIn');
};

export const isAdminLoggedIn = () => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
};

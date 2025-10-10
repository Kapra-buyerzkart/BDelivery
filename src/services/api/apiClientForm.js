import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs"; // to convert JSON → x-www-form-urlencoded

const apiClientForm = axios.create({
    baseURL: "http://dev.buyerzkart.com/api/api/v2",
    timeout: 10000,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    transformRequest: [(data) => qs.stringify(data)], // converts {a:1,b:2} → a=1&b=2
});

// ✅ Add access token to every request
apiClientForm.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ✅ Handle expired token (401) and auto-refresh
apiClientForm.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClientForm(originalRequest); // retry original request
                } else {
                    await AsyncStorage.multiRemove(["authToken", "refreshToken"]);
                }
            } catch (err) {
                console.error("Token refresh failed:", err);
                await AsyncStorage.multiRemove(["authToken", "refreshToken"]);
            }
        }
        return Promise.reject(error);
    }
);

// 🔄 Helper to refresh access token (JSON header)
const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) return null;

        const response = await axios.post(
            "http://dev.buyerzkart.com/api/api/v2/Auth/Refresh",
            { refreshTokenId: refreshToken }, // JSON body
            { headers: { "Content-Type": "application/json" } } // ✅ JSON header
        );

        if (response.data?.Token) {
            await AsyncStorage.setItem("authToken", response.data.Token);
            return response.data.Token;
        }
        return null;
    } catch (error) {
        console.error("Refresh token API error:", error);
        return null;
    }
};

export default apiClientForm;

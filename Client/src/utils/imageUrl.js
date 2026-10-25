import apiClient from "../service/apiclient.js";

export function resolveImageUrl(imageUrl) {
    if (!imageUrl || /^(?:https?:|data:|blob:)/i.test(imageUrl)) {
        return imageUrl;
    }

    return new URL(imageUrl, apiClient.defaults.baseURL).href;
}

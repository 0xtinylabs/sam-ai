import apiService from ".";

const api = {
  sendMessage: async (message: string, wallet_address: string) => {
    const response = await apiService.post("/ai/send", {
      message,
      xmtp_id: wallet_address,
    });
    return response.data.message;
  },
};

export default api;

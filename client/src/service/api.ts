import axios from "axios";

const api = {
  sendMessage: async (message: string, wallet_address: string) => {
    const response = await axios.post("/api/ai", {
      message,
      xmtp_id: wallet_address,
    });
    return response.data.message;
  },
};

export default api;

import axios from "axios";

export async function sendFriendRequest(senderId: number | null, receiverEmail: string | null) {
  return axios.post("/api/friends/send-request", { senderId, receiverEmail });
}

export async function acceptFriendRequest(recieverId: number | null, senderId: number | null) {
    console.log("recieverId on friends.ts: ", recieverId)
    return Promise.all([
        axios.post("/api/friends/accept-request", {recieverId, senderId}), 
        axios.patch("/api/friends/accept-request", {recieverId, senderId}),
    ])
  
}

export async function rejectFriendRequest(recieverId: number | null, senderId: number | null) {
    return axios.patch("/api/friends/reject-request", {recieverId, senderId});
}
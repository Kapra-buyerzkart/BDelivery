import apiClient from "./apiClient";

export const login = (phoneNo, password) => {
    return apiClient.post("/Auth/Login", {
        PhoneNo: phoneNo,
        Password: password,
    });
};

export const changePwd = (agentId, oldPassword, confirmPassword, newPassword) => {
    return apiClient.post("/Auth/ChangePassword", {
        AgentId: agentId,
        OldPassword: oldPassword,
        ConfirmPassword: confirmPassword,
        NewPassword: newPassword
    });
};

export const fetchProfileDetails = (agentId) => {
    return apiClient.get(`/Auth/Profile/${agentId}`);
};

export const logout = () => {
    return apiClient.post("/Auth/Logout");
};

export const forgotPwd = (mobileNumber) => {
    return apiClient.get(`/Auth/ForgotPassword?mobileNumber=${mobileNumber}`);
};

export const verifyOtp = (phoneNo, otp) => {
    return apiClient.post("/Auth/VerifyOtp", {
        PhoneNo: phoneNo,
        Otp: otp
    });
};

export const resetPwd = (agentId, newPassword, confirmPassword) => {
    return apiClient.post("/Auth/ResetPassword", {
        AgentId: agentId,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword
    });
};

export const resendOtp = (phoneno) => {
    return apiClient.post("/Auth/ReSendOTP", {
        phoneno: phoneno
    });
}

export const assignedOrders = (agentId) => {
    return apiClient.get(`/DeliveryAgent/by-agentorder?agentId=${agentId}`);
};

export const modifyOrderStatus = (orderId, agentId, status) => {
    return apiClient.post("Delivery/ModifyStatustAssignedOrders", {
        orderId: orderId,
        delAgentId: agentId,
        status: status
    });
};

export const getAllOrders = (agentId) => {
    return apiClient.get(`/DeliveryAgent/GetAllOrderSuperMarket?agentid=${agentId}`)
}

export const fetchOrderDetails = (orderId) => {
    return apiClient.get(`/Order/CustOrderItemList?orderId=${orderId}`);
};

export const completeOrderDelivery = (orderId, delAgentId, status, signImage, deliveryNote, deliveryFreebies) => {
    return apiClient.post("/Delivery/OrderDeliveryComplete", {
        orderId,
        delAgentId,
        status,
        signImage,
        deliveryNote,
        deliveryFreebies,
    });
};
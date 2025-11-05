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

export const logout = (refreshToken) => {
    return apiClient.post("/Auth/Logout", {
        refreshTokenId: refreshToken
    });
};

export const forgotPwd = (mobileNumber) => {
    return apiClient.get(`/Auth/ForgotPassword?mobileNumber=${mobileNumber}`);
};

export const verifyOtp = (phoneNo, otp, otpurlkey) => {
    return apiClient.post("/Auth/VerifyOtp", {
        PhoneNo: phoneNo,
        Otp: otp,
        OtpUrlKey: otpurlkey
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

export const getAllOrders = (agentId, status) => {
    return apiClient.get(`/DeliveryAgent/GetAllOrderSuperMarket?agentid=${agentId}&status=${status}`)
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

export const markAttendance = (DeliveryBoyId, Status, longitude, latitude) => {
    return apiClient.post("/DeliveryAgent/attendance", {
        DeliveryBoyId,
        Status,
        longitude,
        latitude
    });
};

export const fetchAttendance = (DeliveryBoyId, StartDate, EndDate) => {
    return apiClient.get(`/DeliveryAgent/attendanceDateRange?deliveryBoyId=${DeliveryBoyId}&startDate=${StartDate}&endDate=${EndDate}`);
}

export const fetchEarnings = (DeliveryBoyId, StartDate, EndDate) => {
    return apiClient.get(`/DeliveryAgent/earningsDateRange?delivery_boy_id=${DeliveryBoyId}&startDate=${StartDate}&endDate=${EndDate}`);
}

export const fetchDeliveryAgentAcceptedOrders = (agentId) => {
    // console.log("accepted")
    return apiClient.get(`/DeliveryAgent/GetAllOrderSuperMarketByStatus/?agentid=${agentId}&status=Delivery Agent Accepted`)
}

export const fetchDeliveredOrders = (agentId) => {
    // console.log("delivered")
    return apiClient.get(`/DeliveryAgent/GetAllOrderSuperMarketByStatus/?agentid=${agentId}&status=Order Delivered`)
}
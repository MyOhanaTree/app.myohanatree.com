import axios from "axios";

export const doLogin = async ({ email, password, rememberMe }:{ email: string, password: string, rememberMe: boolean}) => {
	const vals = {
		email: email,
		password: password,
		rememberMe
	};

	try {
		const res: any = await axios.post(`/auth/login`, vals);
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};

export const refreshToken = async ({ data }: any) => {
	const config = {
		headers: { Authorization: `Bearer ${data.refreshToken}` },
	};

	try {
		const res: any = await axios.post("/auth/refresh-tokens", data, config);
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};

export const sendForgotPassword = async ({ email } : {email: string}) =>{	
	try {
		const res: any = await axios.post("/auth/forgot-password", {email: email});
		return res?.data;
	} catch (e) {		
		return e?.response?.data ? e.response.data : e;
	}
}

export const resetPassword = async ({token, password, passwordConfirm} : { token: string, password: string, passwordConfirm: string }) =>{
	const vals = {
		token:token,
		password:password,    
		passwordConfirm:passwordConfirm,    
	}

	try {
		const res: any = await axios.post("/auth/reset-password", vals);
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
}

export const checkPasswordResetToken= async ({ token, userId } : { token: string, userId: string }) =>{
	const vals = {
		token:token,
		userId:userId,		
	}

	try {
		const res: any = await axios.post("/auth/reset-password-check", vals);
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
}

export const getProfile = async () =>{
	try {
		const res: any = await axios.get("/auth/profile");
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
}

export const profileUpdate = async ({ update }: any) =>{
	try {
		const res: any = await axios.put("/auth/profile", update);
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
}

export const completeRegistration = async ({ token, password, passwordConfirm, email } : { token: string, password: string, passwordConfirm: string, email: string }) =>{
	const vals = {
		token:token,
		password:password,    
		passwordConfirm:passwordConfirm,    
		email: email
	}

	try {
		const res: any = await axios.post("/auth/register",vals);
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
}
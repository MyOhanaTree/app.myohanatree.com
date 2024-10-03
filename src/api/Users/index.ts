import axios from "axios";

export const getUsers = async ({ query = {}, controller = null, excludeInterceptor = false}: any) => {		
	const params: any = {params : query, excludeInterceptor}
	if(controller?.signal){
		params.signal = controller.signal
	}

	try {
		const res: any = await axios.get("/users", params);
		return res?.data ? res.data : [];
	} catch (e) {
		return [];
	}
};

export const getUser = async ({ data, controller = null}: any) => {		
	try {
		const res: any = await axios.get(`/users/${data.id}`);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};

export const updateUser = async ({ data, update } : any) => {	
	try {
		const res: any = await axios.put(`/users/${data?.id}`, update);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};

export const checkUser = async ({ data }: any) => {	
	try {
		const res: any = await axios.get(`/users/?email=${data.email}`);	
		return res?.data ? res.data : [];
	} catch (e) {
		return {};
	}
};

export const inviteUser = async ({ invite }: any) => {
	try {
		const res: any = await axios.post("/users/invite", invite);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};

export const resendInvite = async ({ data }: any) => {
	try {
		const res: any = await axios.post(`/users/${data.id}/invite`);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};

export const deleteUser = async ({ data }: any) => {
	try {
		const res: any = await axios.delete(`/users/${data?.id}`);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	} 
};

export const restoreUser = async ({ data }: any) => {
	try {
		const res: any = await axios.post(`/users/${data?.id}/restore`);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	} 
};

export const allPermissions = async () => {	
	try {
		const res: any = await axios.get("/users/permissions");
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};
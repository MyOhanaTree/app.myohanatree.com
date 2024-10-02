import axios from "axios";

export const getRoles = async ({ query = {}, controller = null, excludeInterceptor = false }: any) => {	
	const params: any = {params : query, excludeInterceptor}
	if(controller?.signal){
		params.signal = controller.signal
	}

	try {
		const res: any = await axios.get("/roles", params);
		return res?.data ? res.data : [];
	} catch (e) {
		return [];
	}
};

export const getRole = async ({ data, controller = null}: any) => {	
	try {
		const res: any = await axios.get(`/roles/${data?.id}`);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};

export const allPermissions = async () => {	
	try {
		const res: any = await axios.get("/roles/permissions");
		return res?.data;
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};

export const createRole = async ({ data }: any) => {
	try {
		const res: any = await axios.post(`/roles`, data);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};


export const updateRole = async ({ data, update }: any) => {
	try {
		const res: any = await axios.put(`/roles/${data?.id}`, update);
		return res?.data ? res.data : {};
	} catch (e) {
		return e?.response?.data ? e.response.data : e;
	}
};
import axios from "axios";

export const getPresignedUrl = async ({ data }: any) => {		
	try {
		const res: any = await axios.post("/media/presigned-url", data);
		return res?.data ? res.data : {};
	} catch (e) {
		return {};
	}
};
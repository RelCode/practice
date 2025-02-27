import axios from "axios";

const localhost = 'http://localhost';

interface Payload {
    text: string
}

export enum SelectedEndpoint {
    DotNet = "Dot Net Core Web API",
    FastApi = "Fast API",
    Node = "NodeJS"
}

export interface Response {
    data: { summary: string },
    error: string
}

export const DotNetApi = async (payload: Payload): Promise<Response> => {
    try {
        const response = await axios.post("/api/summarize", payload);
        var res: Response = { data: { summary: '' }, error: '' };
        if(response?.data?.choices[0]?.message?.content){
            res.data.summary = response.data.choices[0].message.content;
        }else{
            res.error = response.data.error;
        }
        return res;
    }catch(error){
        console.log("Error",error);
        throw new Error("Error Occurred");
    }
}

export const FastApi = async (payload: Payload): Promise<Response> => {
    try {
        return await axios.post(`${localhost}:8000/summarize/`, payload);
    }
    catch (error) {
        console.log("Error",error);
        throw new Error("Error Occurred");
    }
}

export const NodeApi = async (payload: Payload) => {

}
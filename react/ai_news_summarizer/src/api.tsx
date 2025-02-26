import axios from "axios";
import { data } from "react-router-dom";

const localhost = 'http://localhost';

interface Payload {
    text: string
}

export enum SelectedEndpoint {
    DotNet = "Dot Net Core Web API",
    FastApi = "Fast API",
    Node = "NodeJS"
}

interface Response {
    data: { summary: string },
    error: string
}

export const DotNetApi = async (payload: Payload) => {

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
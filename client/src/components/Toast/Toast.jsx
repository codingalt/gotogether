import { toast } from "wc-toast";

export const toastSuccess = (data) =>{
    toast.success(data,{theme: { type: 'light' } });
}

export const toastError = (data) =>{
    toast.error(data,{theme: { type: 'light' }, duration: 5000 });
}
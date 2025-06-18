import {useContext} from "react";
import {ContentItemContext} from "../context/ContentItemContext.tsx";

export const UseContentItems=()=>{
    return useContext(ContentItemContext);
}
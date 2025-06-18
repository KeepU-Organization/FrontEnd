import {CoursesContext} from "../context/CoursesContext.tsx";
import {useContext} from "react";

export const useCourses = () => {
    return useContext(CoursesContext);
}
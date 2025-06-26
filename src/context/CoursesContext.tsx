import {CourseResponse} from "../types/Courses.tsx";
import {createContext, useEffect, useState} from "react";
import {coursesService} from "../services/CoursesService.tsx";

export interface CoursesContext {
    courses: CourseResponse[];
    isLoading: boolean;
    error: string | null;
    fetchCourses: () => Promise<void>;
}
const defaultCoursesContext: CoursesContext = {
    courses: [],
    isLoading: true,
    error: null,
    fetchCourses: async () => {},
}
interface CoursesContextProviderProps {
    children: React.ReactNode;
}
export const CoursesContext = createContext<CoursesContext>(defaultCoursesContext);

export const CoursesContextProvider: React.FC<CoursesContextProviderProps> = ({ children }) => {
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await coursesService.getAllCourses();
            setCourses(response);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los cursos');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCourses()
    }, []);
    return (
        <CoursesContext.Provider value={{ courses, isLoading, error, fetchCourses }}>
            {children}
        </CoursesContext.Provider>
    );
}
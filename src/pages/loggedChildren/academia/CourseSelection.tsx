import React, { useState, useEffect } from 'react';
import { useCourses } from "../../../hooks/UseCourses.tsx";
import { useAuth } from "../../../hooks/UseAuth.tsx";
import './CourseSelection.css';
import { useNavigate} from "react-router-dom";

interface Course {
    id: number;
    title: string;
    description: string;
    difficultyLevel: number;
    isPremium: boolean;
    imageUrl: string;
    code:string;
    // Añade otras propiedades que pueda tener un curso
}

const CourseSelection: React.FC = () => {
    const { courses,fetchCourses } = useCourses();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);// Usar tipo correcto en lugar de any

    const navigate = useNavigate();
// Modifica el efecto de carga
    useEffect(() => {

        const loadCourses = async () => {
            setLoading(true);
            if (courses.length==0){
                await fetchCourses();
            }
        };

        loadCourses();

        return () => {
        };
    }, [fetchCourses]); // Quita fetchCourses de las dependencias

// Modifica el segundo useEffect
    useEffect(() => {
        setLoading(true);
        try{
            if (courses && courses.length > 0) {
                const filtered = courses.filter(course =>
                    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    course.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredCourses(filtered);
                setCurrentIndex(0);
            }
        }catch (error){
            console.error("Error al filtrar los cursos:", error);
        }
        finally{
            setLoading(false);
        }
    }, [searchTerm, courses]);

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando cursos...</span>
                </div>
                <p className="mt-2">Cargando cursos...</p>
            </div>
        );
    }


    const handleNextCourses = () => {
        if (currentIndex + 3 < filteredCourses.length) {
            setCurrentIndex(currentIndex + 3);
        }
    };

    const handlePrevCourses = () => {
        if (currentIndex - 3 >= 0) {
            setCurrentIndex(currentIndex - 3);
        }
    };


    const handleNavigateToCourse = (courseCode: string) => {
        navigate(`/course/${courseCode}`);
    };

    const visibleCourses = filteredCourses.slice(currentIndex, currentIndex + 3);

    return (
        <div className="container py-4">
            {/* Buscador de cursos */}
            <div className="row mb-4">
                <div className="col-md-6 mx-auto">
                    <div className="input-group shadow-sm">
                        <span className="input-group-text border-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-0"
                            placeholder="Buscar cursos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Banner de bienvenida */}
            <div className="card mb-4 border-0 bg-primary text-white shadow">
                <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                        <div className="me-3">
                            {
                                user?.profilePicture ? (
                                    <img
                                        src={`http://localhost:8080/api/v1/${user.profilePicture}`}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '64px', height: '64px' }}
                                    />
                                ) : (
                                    <img
                                        src="https://via.placeholder.com/64"
                                        alt="Default Profile"
                                        className="rounded-circle"
                                        style={{ width: '64px', height: '64px' }}
                                    />
                                )
                            }
                        </div>
                        <h2 className="mb-0">Bienvenido/a, {user?.name || 'Estudiante'}</h2>
                    </div>
                </div>
            </div>

            {/* Selector de cursos */}
            <div className="row mb-3">
                <div className="col d-flex justify-content-between align-items-center">
                    <h3>Cursos Disponibles</h3>
                    <div>
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={handlePrevCourses}
                            disabled={currentIndex === 0}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <button
                            className="btn btn-outline-primary"
                            onClick={handleNextCourses}
                            disabled={currentIndex + 3 >= filteredCourses.length}
                        >
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="alert alert-info">
                    No se encontraron cursos que coincidan con tu búsqueda.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {visibleCourses.map((course, index) => (
                        <div className="col" key={course.id || index}>
                            <div className="card h-100 border border-primary shadow-sm course-card">
                                <img
                                    src={`http://localhost:8080/api/v1/${course.imageUrl}`}
                                    className="card-img-top"
                                    alt={course.title}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text">{course.description}</p>
                                </div>
                                <div className="card-footer border-0">
                                    <button className="btn btn-primary w-100" onClick={()=>handleNavigateToCourse(course.code)}>
                                        Ver curso
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseSelection;
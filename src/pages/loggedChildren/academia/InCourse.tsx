import {useModules} from "../../../hooks/UseModules.tsx";
import {useParams} from "react-router-dom";
import React, {useEffect, useState, useCallback} from "react";
import {UseContentItems} from "../../../hooks/UseContentItems.tsx";
import {Offcanvas, Button} from "react-bootstrap";
import {ContentItemResponse} from "../../../types/ContentItem.tsx";
import {QuizQuestionService} from "../../../services/QuizQuestion.tsx";
import {QuizOptionsService} from "../../../services/QuestionCodeService.ts";
import {QuizQuestionResponse} from "../../../types/QuizQuestion.tsx";
import {QuizOptionsResponse} from "../../../types/QuizOptions.tsx";

const CourseDetail: React.FC = () => {
    const { modules, fetchModules } = useModules();
    const { courseCode } = useParams<{ courseCode: string }>();
    const [isLoadingModules, setIsLoadingModules] = useState(false);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [selectedContentItem, setSelectedContentItem] = useState<ContentItemResponse | null>(null);
    const [currentView, setCurrentView] = useState<'module' | 'content'>('module'); // Nueva state para controlar la vista

    const {contentItems, fetchContentItems} = UseContentItems();

    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestionResponse | null>(null);
    const [currentOptions, setCurrentOptions] = useState<QuizOptionsResponse[] | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // Cargar módulos cuando cambia el courseCode
    useEffect(() => {
        const loadModules = async () => {
            if (!courseCode) return;

            setIsLoadingModules(true);
            setSelectedModule(null);
            setSelectedContentItem(null);
            setCurrentView('module');

            try {
                await fetchModules(courseCode);
            } catch (error) {
                console.error("Error al cargar los módulos:", error);
            } finally {
                setIsLoadingModules(false);
            }
        };

        loadModules();
    }, [courseCode, fetchModules]);

    useEffect(() => {
        if (modules && modules.length > 0 && !selectedModule) {
            // Buscar el módulo con orderIndex igual a 1
            const moduleWithOrderIndexOne = modules.find(module => module.orderIndex === 1);

            if (moduleWithOrderIndexOne) {
                // Si existe un módulo con orderIndex 1, seleccionarlo
                setSelectedModule(moduleWithOrderIndexOne.code);
            } else {
                // Si no existe, usar el primer módulo como respaldo
                setSelectedModule(modules[0].code);
            }
        }
    }, [modules, selectedModule]);

    // Cargar elementos de contenido cuando cambia el módulo seleccionado
    useEffect(() => {
        const loadContentItems = async () => {
            if (!selectedModule) return;

            setIsLoadingContent(true);
            setSelectedContentItem(null);

            try {
                await fetchContentItems(selectedModule);
            } catch (error) {
                console.error("Error al cargar los elementos de contenido:", error);
            } finally {
                setIsLoadingContent(false);
            }
        };

        loadContentItems();
    }, [selectedModule, fetchContentItems]);

    const handleModuleSelect = useCallback((moduleCode: string) => {
        if (moduleCode !== selectedModule) {
            setSelectedModule(moduleCode);
            setSelectedContentItem(null);
            setCurrentView('module'); // Mostrar vista de módulo
            setShowOffcanvas(false);
        }
    }, [selectedModule]);

    const handleContentItemSelect = useCallback((contentItem: ContentItemResponse) => {
        setSelectedContentItem(contentItem);
        setCurrentView('content'); // Cambiar a vista de contenido
        setShowOffcanvas(false);
    }, []);

    // Filtrar contenidos por módulo seleccionado
    const currentModuleContent = contentItems.filter(item =>
        item.moduleCode === selectedModule
    );

    const handleQuestionInfo = async () => {
        try {
            if (selectedContentItem) {
                const question = await QuizQuestionService.getQuizQuestionByContentItemCode(selectedContentItem.code);
                setCurrentQuestion(question);

                if (question) {
                    const options = await QuizOptionsService.getQuizOptions(question.code);
                    setCurrentOptions(options);
                }
            }
        } catch (error) {
            console.error("Error al obtener las preguntas del cuestionario:", error);
        }
    };


    const renderQuiz = () => {
        if (!currentQuestion || !currentOptions) return null;

        const handleOptionSelect = (optionId: string) => {
            setSelectedOption(optionId);
        };

        //const isCorrectOption = (option: any) => {
        //    return selectedOption === option.id && option.isCorrect;
        //};

        return (
            <div className="mt-4">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h4 className="mb-4">{currentQuestion.questionText}</h4>

                        <div className="list-group">
                            {currentOptions.map(option => (
                                <button
                                    key={option.id}
                                    className={`list-group-item list-group-item-action mb-2 ${
                                        selectedOption === option.text
                                            ? option.isCorrect
                                                ? 'bg-success text-white'
                                                : 'bg-danger text-white'
                                            : ''
                                    }`}
                                    onClick={() => handleOptionSelect(option.text)}
                                >
                                    {option.text}
                                    {selectedOption === option.text && option.isCorrect && (
                                        <i className="bi bi-check-circle-fill ms-2"></i>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    // Renderizar la vista del módulo
    const renderModuleView = () => {
        const currentModule = modules.find(m => m.code === selectedModule);
        if (!currentModule) return null;

        return (
            <div className="p-4">
                <h1 className="mb-4">{currentModule.title}</h1>

                {/* Imagen del módulo */}
                {currentModule.imageUrl && (
                    <div className="mb-4">
                        <img
                            src={`http://localhost:8080/api/v1/${currentModule.imageUrl}`}
                            alt={currentModule.title}
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Descripción del módulo */}
                {currentModule.description && (
                    <div className="mb-4">
                        <p className="lead">{currentModule.description}</p>
                    </div>
                )}

                {/* Lista de contenidos del módulo */}
                <div className="mt-4">
                    <h4 className="mb-3">Contenido del módulo</h4>
                    {isLoadingContent ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Cargando contenido...</p>
                        </div>
                    ) : currentModuleContent.length > 0 ? (
                        <div className="row g-3">
                            {currentModuleContent.map((item) => (
                                <div key={item.id} className="col-md-6 col-lg-4">
                                    <div
                                        className="card h-100 cursor-pointer shadow-sm hover-shadow"
                                        onClick={() => handleContentItemSelect(item)}
                                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="card-title mb-0">{item.title}</h6>
                                                <span className={`badge rounded-pill ${
                                                    item.contentType === 'ARTICLE' ? 'bg-info' :
                                                        item.contentType === 'VIDEO' ? 'bg-success' :
                                                            item.contentType === 'QUIZ' ? 'bg-warning text-dark' : 'bg-secondary'
                                                }`}>
                                                    {item.contentType === 'ARTICLE' ? 'Artículo' :
                                                        item.contentType === 'VIDEO' ? 'Video' :
                                                            item.contentType === 'QUIZ' ? 'Quiz' : 'Contenido'}
                                                </span>
                                            </div>
                                            {item.description && (
                                                <p className="card-text text-muted small flex-grow-1">
                                                    {item.description.length > 100
                                                        ? `${item.description.substring(0, 100)}...`
                                                        : item.description}
                                                </p>
                                            )}
                                            <div className="mt-auto">
                                                <small className="text-muted">
                                                    <i className={`bi ${
                                                        item.contentType === 'ARTICLE' ? 'bi-file-text' :
                                                            item.contentType === 'VIDEO' ? 'bi-play-circle' :
                                                                item.contentType === 'QUIZ' ? 'bi-question-circle' : 'bi-file'
                                                    } me-1`}></i>
                                                    {item.contentType === 'ARTICLE' ? 'Leer artículo' :
                                                        item.contentType === 'VIDEO' ? 'Ver video' :
                                                            item.contentType === 'QUIZ' ? 'Hacer quiz' : 'Ver contenido'}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            No hay contenido disponible en este módulo.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Renderizar el contenido según el tipo
    const renderContentItem = (contentItem: ContentItemResponse | null) => {
        if (!contentItem) return null;

        const currentModule = modules.find(m => m.code === selectedModule);

        return (
            <div className="p-4">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <button
                                className="btn btn-link p-0 text-decoration-none"
                                onClick={() => setCurrentView('module')}
                            >
                                {currentModule?.title}
                            </button>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {contentItem.title}
                        </li>
                    </ol>
                </nav>

                {/* Contenido */}
                {(() => {
                    switch (contentItem.contentType) {
                        case 'ARTICLE':
                            return (
                                <>
                                    <h1 className="mb-3">{contentItem.title}</h1>
                                    <div
                                        className="content-article"
                                        dangerouslySetInnerHTML={{ __html: contentItem.contentData }}
                                    />
                                </>
                            );
                        case 'VIDEO':
                            return (
                                <>
                                    <h1 className="mb-3">{contentItem.title}</h1>
                                    {contentItem.description && (
                                        <p className="text-muted mb-4 lead">{contentItem.description}</p>
                                    )}
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            src={contentItem.url}
                                            title={contentItem.title}
                                            allowFullScreen
                                            className="rounded shadow"
                                        />
                                    </div>
                                </>
                            );
                        case 'QUIZ':
                            return (
                                <>
                                    <h1 className="mb-3">{contentItem.title}</h1>
                                    <p className="mb-4 lead">{contentItem.description}</p>
                                    {!currentQuestion ? (
                                        <Button variant="primary" size="lg" onClick={handleQuestionInfo}>
                                            <i className="bi bi-play-circle me-2"></i>
                                            Iniciar cuestionario
                                        </Button>
                                    ) : (
                                        renderQuiz()
                                    )}
                                </>
                            );
                        default:
                            return (
                                <>
                                    <h1 className="mb-3">{contentItem.title}</h1>
                                    <div className="alert alert-warning">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Tipo de contenido no soportado: {contentItem.contentType}
                                    </div>
                                </>
                            );
                    }
                })()}
            </div>
        );
    };

    // Mostrar loading de módulos
    if (isLoadingModules) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando módulos del curso...</p>
            </div>
        );
    }

    // Si no hay módulos disponibles
    if (!modules || modules.length === 0) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info text-center">
                    <h4>No hay módulos disponibles</h4>
                    <p>Este curso aún no tiene contenido disponible.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Contenido del Curso</h2>

                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowOffcanvas(true)}
                    className="d-flex align-items-center gap-2"
                >
                    <i className="bi bi-list"></i>
                    Navegación del curso
                </Button>
            </div>

            {/* Contenido principal */}
            <div className="main-content rounded shadow-sm">
                {currentView === 'module' ? renderModuleView() : renderContentItem(selectedContentItem)}
            </div>

            {/* Offcanvas moderno */}
            <Offcanvas
                show={showOffcanvas}
                onHide={() => setShowOffcanvas(false)}
                placement="start"
                className="offcanvas-modern"
                style={{
                    width: '420px',
                    backgroundColor: '#f8f9fa',
                    borderRight: '1px solid #dee2e6'
                }}
            >
                <Offcanvas.Header
                    closeButton
                    className="border-bottom px-4 py-3"
                    style={{ borderBottomColor: '#dee2e6 !important' }}
                >
                    <Offcanvas.Title className="fw-bold text-primary">
                        <i className="bi bi-book me-2"></i>
                        Navegación del Curso
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="p-3">
                        <h6 className="text-muted mb-3 text-uppercase small fw-bold">Módulos</h6>
                        <div className="list-group list-group-flush">
                            {modules
                                .slice() // Crea una copia para no mutar el array original
                                .sort((a, b) => a.orderIndex - b.orderIndex) // Ordena por orderIndex
                                .map((module) => (
                                    <button
                                        key={module.code}
                                        className={`list-group-item list-group-item-action border-0 rounded mb-2 ${
                                            selectedModule === module.code ? 'active' : 'bg-white'
                                        }`}
                                        onClick={() => handleModuleSelect(module.code)}
                                        style={{
                                            border: 'none',
                                            boxShadow: selectedModule === module.code
                                                ? '0 2px 8px rgba(0,123,255,0.25)'
                                                : '0 1px 3px rgba(0,0,0,0.1)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div className="d-flex align-items-start">
                                            <div className="flex-grow-1 text-start">
                                                <div className="fw-bold mb-1">{module.title}</div>
                                                {module.description && (
                                                    <small className={`d-block ${
                                                        selectedModule === module.code ? 'text-white-50' : 'text-muted'
                                                    }`}>
                                                        {module.description.length > 80
                                                            ? `${module.description.substring(0, 80)}...`
                                                            : module.description
                                                        }
                                                    </small>
                                                )}
                                            </div>
                                            {selectedModule === module.code && (
                                                <i className="bi bi-check-circle-fill text-white ms-2"></i>
                                            )}
                                        </div>
                                    </button>
                                ))}
                        </div>

                        {/* Contenidos del módulo seleccionado */}
                        {selectedModule && (
                            <div className="mt-4">
                                <h6 className="text-muted mb-3 text-uppercase small fw-bold">
                                    Contenido del módulo
                                </h6>
                                {isLoadingContent ? (
                                    <div className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-primary">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                ) : currentModuleContent.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {currentModuleContent.map((item) => (
                                            <button
                                                key={item.id}
                                                className={`list-group-item list-group-item-action border-0 rounded mb-2 bg-white ${
                                                    selectedContentItem?.id === item.id ? 'border-primary' : ''
                                                }`}
                                                onClick={() => handleContentItemSelect(item)}
                                                style={{
                                                    boxShadow: selectedContentItem?.id === item.id
                                                        ? '0 0 0 2px rgba(0,123,255,0.25)'
                                                        : '0 1px 3px rgba(0,0,0,0.1)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="text-start flex-grow-1">
                                                        <div className="fw-bold small">{item.title}</div>
                                                        <small className={`badge rounded-pill mt-1 ${
                                                            item.contentType === 'ARTICLE' ? 'bg-info' :
                                                                item.contentType === 'VIDEO' ? 'bg-success' :
                                                                    item.contentType === 'QUIZ' ? 'bg-warning text-dark' : 'bg-secondary'
                                                        }`}>
                                                            {item.contentType === 'ARTICLE' ? 'Artículo' :
                                                                item.contentType === 'VIDEO' ? 'Video' :
                                                                    item.contentType === 'QUIZ' ? 'Quiz' : 'Contenido'}
                                                        </small>
                                                    </div>
                                                    <i className={`bi ${
                                                        item.contentType === 'ARTICLE' ? 'bi-file-text' :
                                                            item.contentType === 'VIDEO' ? 'bi-play-circle' :
                                                                item.contentType === 'QUIZ' ? 'bi-question-circle' : 'bi-file'
                                                    } text-muted`}></i>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-info border-0" style={{ backgroundColor: '#e3f2fd' }}>
                                        <small>No hay contenido disponible en este módulo.</small>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
    );
};

export default CourseDetail;
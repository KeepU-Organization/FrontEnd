import adults from "../../assets/adult-icon.jpg";
import children from "../../assets/child-icon.png";
import {Link} from "react-router"
import "./Signup.css"
const Signup = () => {
    return (
        <div className="container my-5 ">
            <div className={"title-container "}  ><h2 className={"election_title "}>¿Qué eres?</h2></div>
            <div className="row justify-content-center">


                <div className="col-12 col-md-6 col-lg-4 mb-4">
                    <Link to="/childrenSignUp" className="text-decoration-none">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={children}
                                className="card-img-top rounded-top transition-hover w-50 mx-auto"
                                alt="Imagen de niños"
                            />
                            <div className="card-body text-center transition-hover">
                                <span className="election top">Niños</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="col-12 col-md-6 col-lg-4 mb-4">
                    <Link to="/adultSignUp" className="text-decoration-none">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={adults}
                                className="card-img-top rounded-top transition-hover w-75 mx-auto"
                                alt="Imagen de adultos"
                            />
                            <div className="card-body text-center transition-hover">
                                <span className="election top">Adultos</span>
                            </div>
                        </div>
                    </Link>
                </div>



            </div>
        </div>

    );
};

export default Signup;
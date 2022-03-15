import React from "react";
import Form from "./Form";
import { useState } from "react";
import { useAuth } from "../App";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validate, setValidate] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const { onLogin } = useAuth();

    const validateLogin = () => {
        let isValid = true;

        let validator = Form.validator({

            email: {
                value: email,
                isRequired: true,
                isEmail: true,
            },
            password: {
                value: password,
                isRequired: true,
                minLength: 6,
            },
        });

        if (validator !== null) {
            setValidate({
                validate: validator.errors,
            });

            isValid = false;
        }

        return isValid;
    };

    const authenticate = async(e) => {
        e.preventDefault();

        const validate = validateLogin();

        if (validate) {
            setValidate({});
            setEmail("");
            setPassword("");
            onLogin(email, password)
          
        }
        else
        {
        }
    };

    const togglePassword = (e) => {
        if (showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    };

    return (
        <div className="row g-0 auth-wrapper">
            <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
                <div className="d-flex flex-column align-content-end">
                    <div className="auth-body mx-auto">
                        <p>LOGIN</p>
                        <div className="auth-form-container text-start">
                            <form
                                className="auth-form"
                                method="POST"
                                onSubmit={authenticate}
                                autoComplete={"off"}
                            >
                                <div className="email mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${validate.validate && validate.validate.email
                                            ? "is-invalid "
                                            : ""
                                            }`}
                                        id="email"
                                        name="email"
                                        value={email}
                                        placeholder="Email"
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                    />

                                    <div
                                        className={`invalid-feedback text-start ${validate.validate && validate.validate.email
                                            ? "d-block"
                                            : "d-none"
                                            }`}
                                    >
                                        {validate.validate && validate.validate.email
                                            ? validate.validate.email[0]
                                            : ""}
                                    </div>
                                </div>

                                <div className="password mb-3">
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control ${validate && validate.password
                                                ? "is-invalid "
                                                : ""
                                                }`}
                                            name="password"
                                            id="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={(e) => togglePassword(e)}
                                        >
                                            <i
                                                className={
                                                   showPassword ? "far fa-eye" : "far fa-eye-slash"
                                                }
                                            ></i>{" "}
                                        </button>

                                        <div
                                            className={`invalid-feedback text-start ${validate.validate && validate.validate.password
                                                    ? "d-block"
                                                    : "d-none"
                                                }`}
                                        >
                                            {validate.validate && validate.validate.password
                                                ? validate.validate.password[0]
                                                : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 theme-btn mx-auto"
                                    >
                                        Log In
                                    </button>
                                </div>
                            </form>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
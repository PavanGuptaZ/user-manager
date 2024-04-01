import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import GoogleImg from "../../assets/images/google.svg";
import { UserContext } from '../../hooks/ContextProvider'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import RegisterAndLoginApi from '../../apis/auth/RegisterAndLoginApi';
import { toast } from "react-toastify";
import { emailPattern, passwordPattern } from "../../utils/regex";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";


const initialInputValues = { email: "", password: "", stayLogin: true }
const initialUiUpdatesValues = { checks: false, password: true }


function SignIn() {
    const [inputValues, setInputValues] = useState(initialInputValues)
    const [uiUpdates, setUichanges] = useState(initialUiUpdatesValues)

    const { dispatchData } = useContext(UserContext)
    const history = useHistory()
    const queryClient = useQueryClient()


    const RegisterAndLoginMutation = useMutation({
        mutationKey: [`signup`],
        mutationFn: () => RegisterAndLoginApi("login", inputValues),
        onSuccess: (data) => {

            if (data?.status === 'success') {
                queryClient.invalidateQueries({ queryKey: ['refresh'] })
                dispatchData({ type: 'addUser', payload: data.user })
                toast.info("Welcome " + data.user.firstname)
                history.push(`${process.env.PUBLIC_URL}/`)
            } else if (data?.message) {
                toast.warning(data.message)
            }
        }
    })
    const handleRegister = (e) => {
        e.preventDefault()

        if (EmailCheck01 && PasswordCheck) {
            RegisterAndLoginMutation.mutate()
        } else {
            toast.warning("Check all input values")
        }
        !uiUpdates.checks && setUichanges((prev) => ({ ...prev, checks: true }))
    }

    const EmailCheck01 = emailPattern.test(inputValues.email.trim());
    const PasswordCheck = passwordPattern.test(inputValues.password.trim())

    return (
        <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
            <div className="w-100 p-3 p-md-5 card border-0 bg-dark text-light" style={{ maxWidth: "32rem" }}>
                <form className="row g-1 p-3 p-md-4" onSubmit={handleRegister}>
                    <div className="col-12 text-center mb-1 mb-lg-5">
                        <h1>Sign in</h1>
                        <span>Free access to our dashboard.</span>
                    </div>
                    <div className="col-12 text-center mb-4">
                        <a className="btn btn-lg btn-outline-secondary btn-block" href="#!">
                            <span className="d-flex justify-content-center align-items-center">
                                <img className="avatar xs me-2" src={GoogleImg} alt="Imag Description" />
                                Sign in with Google
                            </span>
                        </a>
                        <span className="dividers text-muted mt-4">OR</span>
                    </div>
                    <div className="col-12">
                        <div className="mb-2">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control form-control-lg" placeholder="name@example.com"
                                value={inputValues.email} onChange={(e) => setInputValues((prev) => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        {uiUpdates.checks && !EmailCheck01 &&
                            <div style={{ color: "red" }}>3 to 40 characters before &apos;@&apos;, total 50 characters.</div>}
                    </div>
                    <div className="col-12">
                        <div className="mb-2" style={{ position: "relative" }}>
                            <div className="form-label">
                                <span className="d-flex justify-content-between align-items-center">
                                    Password
                                    <Link className="text-secondary" to="password-reset">Forgot Password?</Link>
                                </span>
                            </div>
                            <input type={uiUpdates.password ? "password" : "text"} className="form-control form-control-lg" placeholder="***************"
                                value={inputValues.password} onChange={(e) => setInputValues((prev) => ({ ...prev, password: e.target.value }))}
                            />
                            <div style={{ position: "absolute", right: "10px", top: "35px", color: "black", userSelect: "none", cursor: "pointer", fontSize: "24px" }}
                                onClick={() => setUichanges((prev) => ({ ...prev, password: !uiUpdates.password }))}>
                                {uiUpdates.password ? <IoMdEyeOff /> : <IoMdEye />}</div>
                        </div>
                        {uiUpdates.checks && !PasswordCheck &&
                            <div style={{ color: "red" }}>no Spacing, atleast contain one capital, small letter, number and one from @, &, *, #, $, !, ? and limit of 3 to 20.</div>}
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault"
                                value={inputValues.stayLogin} onChange={() => setInputValues((prev) => ({ ...prev, stayLogin: !inputValues.stayLogin }))} />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Remember me
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center mt-4">
                        <button to="/" className="btn btn-lg btn-block btn-light lift text-uppercase" atl="signin">SIGN IN</button>
                    </div>
                    <div className="col-12 text-center mt-4">
                        <span className="text-muted">Don't have an account yet? <Link to="sign-up" className="text-secondary">Sign up here</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default SignIn;
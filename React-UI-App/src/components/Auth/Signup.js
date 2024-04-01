import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../hooks/ContextProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import RegisterAndLoginApi from '../../apis/auth/RegisterAndLoginApi';
import { toast } from "react-toastify";
import { emailPattern, namePattern, passwordPattern } from "../../utils/regex";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";



const initialInputValues = { firstname: "", lastname: "", email: "", password: "", password2: "", terms: false, stayLogin: true }
const initialUiUpdatesValues = { checks: false, password: true, password2: true }


function Signup() {
    const [inputValues, setInputValues] = useState(initialInputValues)
    const [uiUpdates, setUichanges] = useState(initialUiUpdatesValues)

    const { dispatchData } = useContext(UserContext)
    const queryClient = useQueryClient()
    const history = useHistory()


    const RegisterAndLoginMutation = useMutation({
        mutationKey: [`signup`],
        mutationFn: () => RegisterAndLoginApi("register", inputValues),
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

        if (nameCheck01 && nameCheck02 && EmailCheck01 && PasswordCheck && PasswordCheck02 && inputValues.terms) {
            RegisterAndLoginMutation.mutate()
        } else {
            toast.warning("Check all input values")
        }
        !uiUpdates.checks && setUichanges((prev) => ({ ...prev, checks: true }))
    }
    const nameCheck01 = namePattern.test(inputValues.firstname.trim());
    const nameCheck02 = namePattern.test(inputValues.lastname.trim());
    const EmailCheck01 = emailPattern.test(inputValues.email.trim());
    const PasswordCheck = passwordPattern.test(inputValues.password.trim())
    const PasswordCheck02 = inputValues.password.trim() === inputValues.password2.trim() && inputValues.password2.trim().length > 3;

    return (
        <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
            <div className="w-100 p-3 p-md-5 card border-0 bg-dark text-light" style={{ maxWidth: "32rem" }}>
                <form className="row g-1 p-3 p-md-4" onSubmit={handleRegister}>
                    <div className="col-12 text-center mb-1 mb-lg-5">
                        <h1>Create your account</h1>
                        <span>Free access to our dashboard.</span>
                    </div>
                    <div className="col-6">
                        <div className="mb-2">
                            <label className="form-label">Full name</label>
                            <input type="text" className="form-control form-control-lg" placeholder="John"
                                value={inputValues.firstname} onChange={(e) => setInputValues((prev) => ({ ...prev, firstname: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="mb-2">
                            <label className="form-label">&nbsp;</label>
                            <input type="text" className="form-control form-control-lg" placeholder="Parker"
                                value={inputValues.lastname} onChange={(e) => setInputValues((prev) => ({ ...prev, lastname: e.target.value }))}
                            />
                        </div>
                    </div>
                    {uiUpdates.checks && (!nameCheck01 || !nameCheck02) &&
                        <div style={{ color: "red" }}>Both fields are required, one or two words, no extra spacing & between 5 to 30 characters.</div>}

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
                    <div className="col-12" style={{ position: "relative" }}>
                        <div className="mb-2">
                            <label className="form-label">Password</label>
                            <input type={uiUpdates.password ? "password" : "text"} className="form-control form-control-lg" placeholder="8+ characters required"
                                value={inputValues.password} onChange={(e) => setInputValues((prev) => ({ ...prev, password: e.target.value }))}
                            />
                            <div style={{ position: "absolute", right: "10px", top: "35px", color: "black", userSelect: "none", cursor: "pointer", fontSize: "24px" }}
                                onClick={() => setUichanges((prev) => ({ ...prev, password: !uiUpdates.password }))}>
                                {uiUpdates.password ? <IoMdEyeOff /> : <IoMdEye />}</div>

                        </div>
                        {uiUpdates.checks && !PasswordCheck &&
                            <div style={{ color: "red" }}>no Spacing, atleast contain one capital, small letter, number and one from @, &, *, #, $, !, ? and limit of 3 to 20.</div>}

                    </div>
                    <div className="col-12" style={{ position: "relative" }}>
                        <div className="mb-2">
                            <label className="form-label">Confirm password</label>
                            <input type={uiUpdates.password2 ? "password" : "text"} className="form-control form-control-lg" placeholder="8+ characters required"
                                value={inputValues.password2} onChange={(e) => setInputValues((prev) => ({ ...prev, password2: e.target.value }))}
                            />
                            <div style={{ position: "absolute", right: "10px", top: "35px", color: "black", userSelect: "none", cursor: "pointer", fontSize: "24px" }}
                                onClick={() => setUichanges((prev) => ({ ...prev, password2: !uiUpdates.password2 }))}>
                                {uiUpdates.password2 ? <IoMdEyeOff /> : <IoMdEye />}</div>
                        </div>
                        {uiUpdates.checks && !PasswordCheck02 &&
                            <div style={{ color: "red" }}>Both the Password should be same.</div>}

                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"
                                checked={inputValues.terms} onChange={(e) => setInputValues((prev) => ({ ...prev, terms: !inputValues.terms }))}
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                I accept the <a href="#!" title="Terms and Conditions" className="text-secondary">Terms and Conditions</a>
                            </label>
                        </div>
                    </div>
                    <div className="col-12 text-center mt-4">
                        <button to="sign-in" className="btn btn-lg btn-block btn-light lift text-uppercase" alt="SIGNUP">SIGN UP</button>
                    </div>
                    <div className="col-12 text-center mt-4">
                        <span className="text-muted">Already have an account? <Link to="sign-in" title="Sign in" className="text-secondary">Sign in here</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default Signup;
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation } from "react-router-dom";

import "./LoginPage.css";
import { getUser, login } from "../../services/userServices";

const schema = z.object({
    email: z
        .string()
        .email({ message: "Please Enter Valid Email Address." })
        .min(3),
    password: z
        .string()
        .min(8, { message: "Password Should be at Least 8 Character. " }),
});

const LoginPage = () => {
    const [formError, setFormError] = useState("");

    const location = useLocation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (formData) => {
        try {
            await login(formData);
            const { state } = location;
            window.location = state ? state.from : "/";
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setFormError(err.response.data.message);
            }
        }
    };

    if (getUser()) {
        return <Navigate to='/' />;
    }

    return (
        <section className='align_center form_page'>
            <form
                action=''
                className='authentication_form'
                onSubmit={handleSubmit(onSubmit)}>
                <h2>Login Form</h2>
                <div className='form_inputs'>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            id='email'
                            className='form_text_input'
                            placeholder='Enter Your Email Address'
                            {...register("email")}
                        />
                        {errors.email && (
                            <em className='form_error'>
                                {errors.email.message}
                            </em>
                        )}
                    </div>
                    <div>
                        <label htmlFor='password'>password</label>
                        <input
                            type='password'
                            id='password'
                            className='form_text_input'
                            placeholder='Enter Your Password'
                            {...register("password")}
                        />
                        {errors.password && (
                            <em className='form_error'>
                                {errors.password.message}
                            </em>
                        )}
                    </div>

                    {formError && <em className='form_error'>{formError}</em>}

                    <button type='submit' className='search_button form_submit'>
                        Submit
                    </button>
                </div>
            </form>
        </section>
    );
};

export default LoginPage;

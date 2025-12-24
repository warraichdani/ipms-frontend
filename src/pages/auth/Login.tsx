import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Label, TextInput } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../lib/apiClient";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short").required("Required"),
});

export default function Login() {
    const navigate = useNavigate();
    const { saveTokens } = useAuth();

    const loginMutation = useMutation({
        mutationFn: async (values: { email: string; password: string }) => {
            const { data } = await apiClient.post("/auth/login", values);
            return data;
        },
        onSuccess: (data) => {
            saveTokens(data.accessToken, data.refreshToken);
            toast.success("Login successful!");
            navigate("/");
        },
        onError: () => {
            toast.error("Invalid credentials");
        },
    });

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => {
                loginMutation.mutate(values, {
                    onSettled: () => {
                        setSubmitting(false);
                    },
                });
            }}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    <h1 className="text-2xl font-bold text-brand-700">Login</h1>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Field as={TextInput} id="email" name="email" type="email" placeholder="you@example.com" />
                        <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Field as={TextInput} id="password" name="password" type="password" placeholder="••••••••" />
                        <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700">
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>

                    <div className="flex justify-between text-sm mt-2">
                        <Link to="/register" className="text-brand-600 hover:underline">
                            Sign up
                        </Link>
                        <Link to="/forgot-password" className="text-brand-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
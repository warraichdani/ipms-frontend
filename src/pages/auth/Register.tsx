import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Label, TextInput } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../lib/apiClient";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short").required("Required"),
});

export default function Register() {
    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: async (values: { firstName: string; lastName: string; email: string; password: string }) => {
            const { data } = await apiClient.post("/users/register", values);
            return data;
        },
        onSuccess: (data, variables) => {
            toast.success("Registration successful! Please confirm your email.");
            navigate("/confirm-email", { state: { email: variables.email } });
        },
        onError: () => toast.error("Registration failed"),
    });

    return (
        <Formik
            initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
            validationSchema={RegisterSchema}
            onSubmit={(values, { setSubmitting }) => {
                registerMutation.mutate(values, {
                    onSettled: () => {
                        setSubmitting(false); // ✅ always reset after success or error
                    },
                });
            }}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    <h1 className="text-2xl font-bold text-brand-700">Register</h1>

                    {["firstName", "lastName", "email", "password"].map((field) => (
                        <div key={field}>
                            <Label htmlFor={field}>{field}</Label>
                            <Field
                                as={TextInput}
                                id={field}
                                name={field}
                                type={field === "password" ? "password" : "text"}
                                placeholder={field}
                            />
                            <ErrorMessage name={field} component="div" className="text-red-600 text-sm" />
                        </div>
                    ))}

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700">
                        {isSubmitting ? "Registering..." : "Register"}
                    </Button>

                    <div className="text-sm mt-2 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-brand-600 hover:underline">
                            Login
                        </Link>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
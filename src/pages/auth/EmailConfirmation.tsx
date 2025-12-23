// src/pages/auth/EmailConfirmation.tsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Label, TextInput } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../lib/apiClient";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";

const ConfirmSchema = Yup.object().shape({
    otp: Yup.string().length(6, "OTP must be 6 digits").required("Required"),
});

export default function EmailConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as { email?: string })?.email ?? "";

    const confirmMutation = useMutation({
        mutationFn: async (values: { email: string; otp: string }) => {
            const { data } = await apiClient.post("/auth/confirm-email", values);
            return data;
        },
        onSuccess: () => {
            toast.success("Email confirmed! You can now login.");
            navigate("/login");
        },
        onError: () => {
            toast.error("Invalid OTP or confirmation failed");
            // ✅ Formik will reset isSubmitting via onSettled below
        },
    });

    return (
        <Formik
            initialValues={{ otp: "" }}
            validationSchema={ConfirmSchema}
            onSubmit={(values, { setSubmitting }) => {
                confirmMutation.mutate(
                    { email, otp: values.otp },
                    {
                        onSettled: () => {
                            setSubmitting(false); // ✅ always reset after success or error
                        },
                    }
                );
            }}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    <h1 className="text-2xl font-bold text-brand-700">Confirm Email</h1>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <TextInput id="email" type="email" value={email} disabled />
                    </div>

                    <div>
                        <Label htmlFor="otp">OTP</Label>
                        <Field
                            as={TextInput}
                            id="otp"
                            name="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                        />
                        <ErrorMessage name="otp" component="div" className="text-red-600 text-sm" />
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-600 hover:bg-brand-700"
                    >
                        {isSubmitting ? "Confirming..." : "Confirm Email"}
                    </Button>

                    <div className="text-sm mt-2 text-center">
                        <Link to="/register" className="text-brand-600 hover:underline">
                            Back to Register
                        </Link>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
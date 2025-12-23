import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Label, TextInput } from "flowbite-react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../../lib/apiClient";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function ForgotPassword() {
  const forgotMutation = useMutation({
    mutationFn: async (values: { email: string }) => {
      const { data } = await apiClient.post("/auth/forgot-password", values);
      return data;
    },
    onSuccess: () => toast.success("Password reset link sent!"),
    onError: () => toast.error("Failed to send reset link"),
  });

  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={ForgotSchema}
      onSubmit={(values) => forgotMutation.mutate(values)}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <h1 className="text-2xl font-bold text-brand-700">Forgot Password</h1>

          <div>
            <Label htmlFor="email">Email</Label>
            <Field as={TextInput} id="email" name="email" type="email" placeholder="you@example.com" />
            <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700">
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className="text-sm mt-2 text-center">
            <Link to="/login" className="text-brand-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}
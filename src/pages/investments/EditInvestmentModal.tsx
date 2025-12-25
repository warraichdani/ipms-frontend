// src/pages/investments/EditInvestmentModal.tsx
import { Modal, ModalHeader, ModalBody,Button, Label, TextInput, Select } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useInvestmentTypeOptions, useInvestmentStatusOptions } from "../../hooks/useConfigurations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../lib/apiClient";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  investmentId: string | null;
};

const SchemaAdd = Yup.object({
  investmentName: Yup.string().required("Name is required"),
  investmentType: Yup.string().required("Type is required"),
  initialAmount: Yup.number().positive("Must be positive").required("Required"),
  purchaseDate: Yup.date().max(new Date(), "Cannot be future").required("Required"),
  broker: Yup.string().nullable(),
  notes: Yup.string().max(1000, "Max 1000 chars").nullable(),
  status: Yup.string().required("Required"),
});

const SchemaEdit = Yup.object({
  investmentName: Yup.string().required("Name is required"),
  investmentType: Yup.string().required("Type is required"),
  initialAmount: Yup.number().positive("Must be positive").required("Required"),
  purchaseDate: Yup.date().required("Required"),
  broker: Yup.string().nullable(),
  notes: Yup.string().max(1000, "Max 1000 chars").nullable(),
  status: Yup.string().required("Required"),
});

export function EditInvestmentModal({ isOpen, onClose, investmentId }: Props) {
  const qc = useQueryClient();
  const typeOptions = useInvestmentTypeOptions();
  const statusOptions = useInvestmentStatusOptions();

  const { data: existing, isFetching } = useQuery({
    queryKey: ["investment", investmentId],
    queryFn: async () => {
      if (!investmentId) return null;
      const { data } = await apiClient.get(`/investments/${investmentId}`);
      return data;
    },
    enabled: !!investmentId,
  });

  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      const { data } = await apiClient.post("/investments", values);
      return data;
    },
    onSuccess: () => {
      toast.success("Investment created");
      qc.invalidateQueries({ queryKey: ["investments"] });
      onClose();
    },
    onError: () => toast.error("Create failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.put(`/investments/${investmentId}`, { ...values, investmentId });
    },
    onSuccess: () => {
      toast.success("Investment updated");
      qc.invalidateQueries({ queryKey: ["investments"] });
      onClose();
    },
    onError: () => toast.error("Update failed"),
  });

  const isEdit = !!investmentId;

  const initialValues = isEdit && existing ? {
  investmentName: existing.investmentName,
  investmentType: existing.investmentType,
  initialAmount: existing.initialAmount,
  purchaseDate: existing.purchaseDate,
  broker: existing.broker ?? "",
  notes: existing.notes ?? "",
  status: existing.status,
} : {
  investmentName: "",
  investmentType: "",
  initialAmount: "",
  purchaseDate: "",
  broker: "",
  notes: "",
  status: "Active",
};

  return (
    <Modal show={isOpen} size="xl" onClose={onClose} dismissible>
      <ModalHeader>{isEdit ? "Edit Investment" : "Add Investment"}</ModalHeader>
      <ModalBody>
        {isEdit && isFetching ? (
          <div>Loading...</div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={isEdit ? SchemaEdit : SchemaAdd}
            onSubmit={(values, { setSubmitting }) => {
              if (isEdit) updateMutation.mutate(values, {
                onSettled: () => {
                  setSubmitting(false);
                },
              });
              else createMutation.mutate(values, {
                onSettled: () => {
                  setSubmitting(false);
                },
              });
            }}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="investmentName">Name</Label>
                  <Field as={TextInput} id="investmentName" name="investmentName" />
                  <ErrorMessage name="investmentName" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <Label htmlFor="investmentType">Type</Label>
                  <Field as={Select} id="investmentType" name="investmentType">
                    <option value="">Select type</option>
                    {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Field>
                  <ErrorMessage name="investmentType" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="initialAmount">Initial Amount</Label>
                    <Field
                      as={TextInput}
                      id="initialAmount"
                      name="initialAmount"
                      type="number"
                      disabled={isEdit} // per requirement
                    />
                    <ErrorMessage name="initialAmount" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Field
                      as={TextInput}
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      disabled={isEdit} // not editable on edit
                    />
                    <ErrorMessage name="purchaseDate" component="div" className="text-red-600 text-sm" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="broker">Broker/Platform</Label>
                  <Field as={TextInput} id="broker" name="broker" />
                  <ErrorMessage name="broker" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Field as={TextInput} id="notes" name="notes" />
                  <ErrorMessage name="notes" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Field as={Select} id="status" name="status">
                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="flex justify-end gap-3">
                  <Button color="gray" onClick={onClose} type="button">Cancel</Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                    {isSubmitting ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save" : "Create")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </ModalBody>
    </Modal>
  );
}
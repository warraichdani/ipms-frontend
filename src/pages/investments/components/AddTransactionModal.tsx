// src/pages/investments/components/AddTransactionModal.tsx
import { Modal, ModalHeader, ModalBody, Button, Select, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../lib/apiClient";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  investmentId: string;
  investmentName: string;
  currentUnits: number;
};

type Option = { label: string; value: string };

const transactionTypes: Option[] = [
  { label: "Buy", value: "Buy" },
  { label: "Sell", value: "Sell" },
  { label: "Update Price", value: "UpdatePrice" },
];

export default function AddTransactionModal({
  isOpen,
  onClose,
  investmentId,
  investmentName,
  currentUnits,
}: Props) {
  const qc = useQueryClient();

  const buyMutation = useMutation({
    mutationFn: async (payload: { amount: number; unitPrice: number; date: string }) => {
      const body = { investmentId, amount: payload.amount, unitPrice: payload.unitPrice, date: payload.date };
      const { data } = await apiClient.post("/investments/buy", body);
      return data;
    },
    onSuccess: () => {
      toast.success("Buy transaction saved");
      qc.invalidateQueries({ queryKey: ["investment-transactions", investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-detail", investmentId] });
      onClose();
    },
    onError: () => toast.error("Failed to save buy transaction"),
  });

  const sellMutation = useMutation({
    mutationFn: async (payload: { unitsToSell: number; unitPrice: number; date: string }) => {
      const body = { investmentId, unitsToSell: payload.unitsToSell, unitPrice: payload.unitPrice, date: payload.date };
      const { data } = await apiClient.post("/investments/sell", body);
      return data;
    },
    onSuccess: () => {
      toast.success("Sell transaction saved");
      qc.invalidateQueries({ queryKey: ["investment-transactions", investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-detail", investmentId] });
      onClose();
    },
    onError: () => toast.error("Failed to save sell transaction"),
  });

  const updatePriceMutation = useMutation({
    mutationFn: async (payload: { unitPrice: number; date: string }) => {
      const body = { investmentId, unitPrice: payload.unitPrice, date: payload.date };
      const { data } = await apiClient.post("/investments/update-price", body);
      return data;
    },
    onSuccess: () => {
      toast.success("Price update saved");
      qc.invalidateQueries({ queryKey: ["investment-transactions", investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-detail", investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-performance", investmentId] });
      onClose();
    },
    onError: () => toast.error("Failed to save price update"),
  });

  const Schema = Yup.object({
    transactionType: Yup.string().oneOf(["Buy", "Sell", "UpdatePrice"]).required("Required"),
    amount: Yup.number().positive("Must be positive").required("Required"),
    unitPrice: Yup.number().positive("Must be positive").required("Required"),
    date: Yup.date().max(new Date(), "Cannot be future").required("Required"),
  });

  return (
    <Modal show={isOpen} onClose={onClose} size="xl" dismissible>
      <ModalHeader>Add Transaction</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            transactionType: "",
            amount: "",
            unitPrice: "",
            date: "",
          }}
          validationSchema={Schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (values.transactionType === "Buy") {
                await buyMutation.mutateAsync({
                  amount: Number(values.amount),
                  unitPrice: Number(values.unitPrice),
                  date: values.date,
                });
              } else if (values.transactionType === "Sell") {
                const unitsToSell = Number(values.amount);
                if (unitsToSell > currentUnits) {
                  toast.error("Cannot sell more units than owned");
                  setSubmitting(false);
                  return;
                }
                await sellMutation.mutateAsync({
                  unitsToSell,
                  unitPrice: Number(values.unitPrice),
                  date: values.date,
                });
              } else if (values.transactionType === "UpdatePrice") {
                await updatePriceMutation.mutateAsync({
                  unitPrice: Number(values.unitPrice),
                  date: values.date,
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting }) => {
            const newTotalAfter =
              values.transactionType === "Buy"
                ? currentUnits + Number(values.amount || 0)
                : values.transactionType === "Sell"
                ? Math.max(0, currentUnits - Number(values.amount || 0))
                : currentUnits;

            return (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Investment</label>
                    <Select disabled value={investmentId}>
                      <option value={investmentId}>{investmentName}</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                    <Field as={Select} name="transactionType">
                      <option value="">Select type</option>
                      {transactionTypes.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="transactionType" component="div" className="text-red-600 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <Field as={TextInput} name="amount" type="number" min="0" />
                    <ErrorMessage name="amount" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                    <Field as={TextInput} name="unitPrice" type="number" min="0" />
                    <ErrorMessage name="unitPrice" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                    <Field as={TextInput} name="date" type="date" />
                    <ErrorMessage name="date" component="div" className="text-red-600 text-sm" />
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded border">
                  <span className="text-sm text-gray-600">New total units after transaction:</span>
                  <span className="ml-2 font-semibold">{newTotalAfter}</span>
                </div>

                <div className="flex justify-end gap-3">
                  <Button color="gray" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white">
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </ModalBody>
    </Modal>
  );
}
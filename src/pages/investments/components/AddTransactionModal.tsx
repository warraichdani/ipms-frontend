import { Modal, ModalHeader, ModalBody, Button, TextInput, Select } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import InvestmentDropdown from "../../../components/InvestmentDropdown";
import { toast } from "react-toastify";
import apiClient from "../../../lib/apiClient";
import type { UpdatePriceResponse } from "../../../models/transactions/UpdatePriceResponse";
import type { InvestmentDetailDto } from "../../../models/investment";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  investment?: InvestmentDetailDto;
};

export default function AddTransactionModal({ isOpen, onClose, investment }: Props) {
  const qc = useQueryClient();

  // ✅ Mutations (same as before, but will use selectedInvestmentId)
  const buyMutation = useMutation({
    mutationFn: async (payload: { investmentId: string; amount: number; date: string }) => {
      const body = {
        investmentId: payload.investmentId,
        amount: payload.amount,
        unitPrice: investment?.unitPrice ?? 0,
        date: payload.date,
      };
      const { data } = await apiClient.post("/investments/buy", body);
      return data;
    },
    onSuccess: (_, vars) => {
      toast.success("Buy transaction saved");
      qc.invalidateQueries({ queryKey: ["investment-transactions", vars.investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-detail", vars.investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-performance", vars.investmentId] });
      onClose();
    },
    onError: () => toast.error("Failed to save buy transaction"),
  });

  const sellMutation = useMutation({
    mutationFn: async (payload: { investmentId: string; amount: number; date: string }) => {
      const body = {
        investmentId: payload.investmentId,
        unitsToSell: payload.amount,
        unitPrice: investment?.unitPrice ?? 0,
        date: payload.date,
      };
      const { data } = await apiClient.post("/investments/sell", body);
      return data;
    },
    onSuccess: (_, vars) => {
      toast.success("Sell transaction saved");
      qc.invalidateQueries({ queryKey: ["investment-transactions", vars.investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-detail", vars.investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-performance", vars.investmentId] });
      onClose();
    },
    onError: () => toast.error("Failed to save sell transaction"),
  });

  const updatePriceMutation = useMutation({
    mutationFn: async (payload: { investmentId: string; amount: number; date: string }) => {
      const body = {
        investmentId: payload.investmentId,
        amount: payload.amount,
        date: payload.date,
      };
      const { data } = await apiClient.post<UpdatePriceResponse>("/investments/update-price", body);
      return data;
    },
    onSuccess: (_, vars) => {
      toast.success("Price update saved");
      qc.invalidateQueries({ queryKey: ["investment-transactions", vars.investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-detail", vars.investmentId] });
      qc.invalidateQueries({ queryKey: ["investment-performance", vars.investmentId] });
      onClose();
    },
    onError: () => toast.error("Failed to save price update"),
  });

  // ✅ Validation schema
  const Schema = Yup.object({
    investmentId: Yup.string().required("Investment is required"),
    transactionType: Yup.string().oneOf(["Buy", "Sell", "UpdatePrice"]).required("Required"),
    amount: Yup.number().positive("Must be positive").required("Required"),
    date: Yup.date().max(new Date(), "Cannot be future").required("Required"),
  });

  return (
    <Modal show={isOpen} onClose={onClose} size="xl" dismissible>
      <ModalHeader>Add Transaction</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            investmentId: investment?.investmentId ?? "",
            transactionType: "",
            amount: "",
            date: "",
          }}
          validationSchema={Schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (values.transactionType === "Buy") {
                await buyMutation.mutateAsync({
                  investmentId: values.investmentId,
                  amount: Number(values.amount),
                  date: values.date,
                });
              } else if (values.transactionType === "Sell") {
                const sellAmount = Number(values.amount);
                if (investment && sellAmount > investment.currentValue) {
                  toast.error("Cannot sell more than current value");
                  setSubmitting(false);
                  return;
                }
                await sellMutation.mutateAsync({
                  investmentId: values.investmentId,
                  amount: sellAmount,
                  date: values.date,
                });
              } else if (values.transactionType === "UpdatePrice") {
                await updatePriceMutation.mutateAsync({
                  investmentId: values.investmentId,
                  amount: Number(values.amount),
                  date: values.date,
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting, setFieldValue }) => {
            const newValue =
              values.transactionType === "Buy"
                ? (investment?.currentValue ?? 0) + Number(values.amount || 0)
                : values.transactionType === "Sell"
                ? Math.max(0, (investment?.currentValue ?? 0) - Number(values.amount || 0))
                : values.transactionType === "UpdatePrice"
                ? Number(values.amount || (investment?.currentValue ?? 0))
                : investment?.currentValue ?? 0;

            return (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Investment</label>
                    {investment ? (
                        // ✅ Disabled dropdown when opened from InvestmentDetailPage
                        <Select disabled value={investment.investmentId}>
                            <option value={investment.investmentId}>{investment.investmentName}</option>
                        </Select>
                        ) : (
                        // ✅ Enabled dropdown when opened from TransactionListPage
                        <InvestmentDropdown
                            selectedId={values.investmentId}
                            onChange={(id) => setFieldValue("investmentId", id)}
                            onSelectInvestment={(inv) => {
                            // ✅ update local investment object when user selects
                            if (inv) {
                                setFieldValue("investmentName", inv.name);
                                // You can also set other fields if needed
                                // e.g. unitPrice, currentValue
                            }
                            }}
                        />
                        )}
                    <ErrorMessage name="investmentId" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                    <Field as={Select} name="transactionType">
                      <option value="">Select type</option>
                      <option value="Buy">Buy</option>
                      <option value="Sell">Sell</option>
                      <option value="UpdatePrice">Update Price</option>
                    </Field>
                    <ErrorMessage name="transactionType" component="div" className="text-red-600 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <Field as={TextInput} name="amount" type="number" min="0" />
                    <ErrorMessage name="amount" component="div" className="text-red-600 text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                    <Field as={TextInput} name="date" type="date" />
                    <ErrorMessage name="date" component="div" className="text-red-600 text-sm" />
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded border">
                  <span className="text-sm text-gray-600">New Current Value after transaction:</span>
                  <span className="ml-2 font-semibold">{newValue}</span>
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
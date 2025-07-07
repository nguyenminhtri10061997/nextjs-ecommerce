"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import useFormRef from "@/hooks/useFormRef";
import { attributeKeys, getAttributeDetail, patchAttribute } from "@/lib/reactQuery/attribute";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { TForm } from "../_components/attributeForm/useIndex";

export type TPermissionState = Partial<Record<string, boolean>>
export const usePage = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { showAlert } = useAlertContext();
    const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();

    const query = useQuery({
        queryKey: attributeKeys.detail(id),
        queryFn: getAttributeDetail,
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: patchAttribute,
        onSuccess: async () => {
            showAlert("Update Attribute success");
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: attributeKeys.detail(id) }),
                queryClient.invalidateQueries({ queryKey: attributeKeys.lists() }),
            ]);
            router.push("/dashboard/attribute");
        },
        onError: (err: AxiosError<TAppResponseBody>) => {
            const message = err.response?.data.message || err.message;
            showAlert(message, "error");
        },
    });

    const handleFormSubmit: SubmitHandler<TForm> = async ({
        name,
        slug,
        attributeValues,
    }) => {
        mutation.mutate({
            id,
            body: {
                name,
                slug,
                attributeValues,
            }
        });
    };


    const {
        formRef,
        handleClickSubmitForm,
        handleSetForm,
    } = useFormRef<TForm>({
        handleFormSubmit
    })

    useEffect(() => {
        if (query.data?.id) {
            const { name, slug, attributeValues, } = query.data
            if (breadcrumbs.length === 3) {
                setBreadCrumbs(
                    breadcrumbs
                        .slice(0, breadcrumbs.length - 1)
                        .concat(query.data.name)
                );
            }
            formRef.current?.reset({
                name,
                slug,
                attributeValues,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.data?.id, breadcrumbs.length === 3]);

    return {
        formRef,
        mutation,
        handleSetForm,
        handleClickSubmitForm,
    };
};

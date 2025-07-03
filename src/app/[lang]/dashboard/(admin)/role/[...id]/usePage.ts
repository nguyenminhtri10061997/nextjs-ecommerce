"use client";

import { useAlertContext } from "@/hooks/useAlertContext";
import { getRoleDetail, putRole, roleKeys } from "@/lib/reactQuery/role";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Inputs as RoleInputs } from '../_components/RoleForm/useIndex';
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";

export type TPermissionState = Partial<Record<string, boolean>>
export const usePage = () => {
  const { id } = useParams<{ id: string }>();
  const [permissionSelected, setPermissionSelected] = useState<TPermissionState>({})
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAlert } = useAlertContext();
  const { setLoading } = useLoadingCtx();
  const formRef = useRef<UseFormReturn<RoleInputs>>(null);
  const { breadcrumbs, setBreadCrumbs } = useDashboardCtx();

  const query = useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: getRoleDetail,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: putRole,
    onSuccess: async () => {
      showAlert("Update Role success");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: roleKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: roleKeys.lists() }),
      ]);
      router.push("/dashboard/role");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      showAlert(message, "error");
    },
  });

  const handleFormSubmit: SubmitHandler<RoleInputs> = async ({
    description,
    name,
  }) => {
    mutation.mutate({
      id,
      body: {
        name,
        permissionIds: Object.keys(permissionSelected),
        description: description || "",
      }
    });
  };

  const handleClickSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current?.handleSubmit(handleFormSubmit)(e);
  };

  const handleSetForm = (form: UseFormReturn<RoleInputs>) => {
    formRef.current = form;
  };

  const handleChangeCheckbox = (id: string) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const clone = { ...permissionSelected }
    if (!checked) {
      delete clone[id]
    } else {
      clone[id] = true
    }
    setPermissionSelected({
      ...clone
    })
  }

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading]);

  useEffect(() => {
    if (query.data?.id) {
      const { name, description, permissions } = query.data
      if (breadcrumbs.length === 3) {
        setBreadCrumbs(
          breadcrumbs
            .slice(0, breadcrumbs.length - 1)
            .concat(query.data.name)
        );
      }
      formRef.current?.reset({
        name,
        description,
      });
      const permissionSelectedDb = Object.fromEntries(permissions.map(i => [i.id, true]))
      setPermissionSelected(permissionSelectedDb)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.id, breadcrumbs.length === 3]);

  return {
    formRef,
    mutation,
    permissionSelected,
    handleClickSubmit,
    handleSetForm,
    handleFormSubmit,
    handleChangeCheckbox,
  };
};

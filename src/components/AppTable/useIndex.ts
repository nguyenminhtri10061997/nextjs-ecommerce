import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { TFilterList } from ".";
import { TSelectedHash } from "../../hooks/useSelectTable";
import { debounce } from "lodash";
import { SelectChangeEvent } from "@mui/material";
import { SortOrder, TOrderQuery, TPaginationParams } from "@/types/api/common";

type TProps<T extends { id: string }> = {
  data: T[];
  defaultFilterList: TFilterList[];
  selectedHash?: TSelectedHash;
  orderQuery?: TOrderQuery;
  pagination: TPaginationParams;
  isLoading?: boolean
  setSelectedHash?: Dispatch<SetStateAction<TSelectedHash>>;
  setSearchStr?: Dispatch<SetStateAction<string>>;
  setSearchKey?: Dispatch<SetStateAction<Partial<keyof T>>>;
  setOrderQuery?: Dispatch<SetStateAction<TOrderQuery<keyof T>>>;
  setPagination: Dispatch<SetStateAction<TPaginationParams>>;
};

export default function UseIndex<T extends { id: string }>(props: TProps<T>) {
  const [filterListActive, setFilterListActive] = useState(
    props.defaultFilterList.filter((i) => i.defaultShow).map(i => i.label)
  );
  const [anchorElFilterList, setAnchorElFilterList] =
    useState<null | HTMLElement>(null);

  const handleToggleAllClick = () => {
    const numSelected = Object.values(props.selectedHash || {}).length;
    if (numSelected > 0) {
      props.setSelectedHash?.({});
      return;
    }
    const newSelected: { [key: string]: boolean } = {};
    props.data.forEach((n) => {
      newSelected[n.id] = true;
    });
    props.setSelectedHash?.(newSelected);
  };

  const handleClickSelectRow = (rowId: string) => () => {
    const selectedClone = props.selectedHash || {};

    if (selectedClone[rowId]) {
      delete selectedClone[rowId];
    } else {
      selectedClone[rowId] = true;
    }

    props.setSelectedHash?.({ ...selectedClone });
  };

  const handleChangePage = (_: unknown, page: number) => {
    props.setPagination({
      ...props.pagination,
      currentPage: page,
    });
  };

  const handleChangeRowPerPage = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    props.setPagination({
      ...props.pagination,
      pageSize: +e.target.value,
    });
  };

  const handleClickOrder = (rowId: keyof T) => {
    let orderType: SortOrder = "asc";
    if (props.orderQuery?.orderKey === rowId) {
      switch (props.orderQuery.orderType) {
        case "asc":
          orderType = "desc";
          break;
        case "desc":
          orderType = "asc";
          break;
      }
    }
    props?.setOrderQuery?.({
      orderKey: rowId,
      orderType,
    });
  };

  const handleChangeSearchKey = (event: SelectChangeEvent) => {
    props.setSearchKey?.(event.target.value as keyof T);
  };

  const handleChangeSearchStr: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = debounce((e) => {
    props.setSearchStr?.(e.target.value);
  }, 300);

  const handleClickFilterListBtn = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorElFilterList(event.currentTarget);
  };

  const isOpenMenuFilterList = useMemo(() => {
    return !!anchorElFilterList;
  }, [anchorElFilterList]);

  const handleCloseMenuFilterList = () => {
    setAnchorElFilterList(null);
  };

  const handleClickToggleFilterList =
    (key: TFilterList["label"]) =>
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        const item = props.defaultFilterList.find((i) => i.label === key);
        if (!item) return;
        setFilterListActive((prev) => [...prev, item.label]);
      } else {
        setFilterListActive((prev) => prev.filter((i) => i !== key));
      }
    };


  useEffect(() => {
    props.setSelectedHash?.({})
  }, [props.isLoading])

  return {
    filterListActive,
    anchorElFilterList,
    isOpenMenuFilterList,
    setFilterListActive,
    handleToggleAllClick,
    handleChangeSearchStr,
    handleChangeSearchKey,
    handleClickOrder,
    handleClickSelectRow,
    handleChangePage,
    handleChangeRowPerPage,
    handleClickFilterListBtn,
    handleCloseMenuFilterList,
    handleClickToggleFilterList,
  };
}

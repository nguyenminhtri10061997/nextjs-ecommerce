import { useState } from "react";

export default () => {
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    return {
        isOpenConfirm, setIsOpenConfirm
    }
}
import { authSelector } from "@store/authSlice";
import { companySelector } from "@store/companySlice";
import { useSelector } from "react-redux";


export const useCOIEnabled = () => {
    const { companies } = useSelector(companySelector)
    const { company } = useSelector(authSelector)

    const coi_enabled = companies.find((companySearch) => companySearch.identifier === company)?.data?.coi_enabled

    return {
        coi_enabled: coi_enabled ?? false,
    }
}



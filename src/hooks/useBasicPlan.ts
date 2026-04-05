// import { authSelector } from "@store/authSlice"
// import { companySelector } from "@store/companySlice"
// import { useSelector } from "react-redux"

export const useBasicPlan = () => {
  // const { companies } = useSelector(companySelector)
  // const { company } = useSelector(authSelector)

  // const isDownloadPlan =
  //   (companies.find((c) => c.identifier === company)?.workspace
  //     .license as unknown as { base_product_enable?: boolean })?.base_product_enable;

  return {
    // isDownloadPlan: isDownloadPlan ?? false
    isDownloadPlan: false
  }
}



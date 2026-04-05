import { authSelector } from "@store/authSlice";
import { userSelector } from "@store/userSlice";
import { useSelector } from "react-redux";

type OwnerDataType = {
  name: string | null;
  email: string | null;
  ownerWorkspace: string | null;
};

export default function useGetOwnerData() {
  const { userData, workspace, defaultWorkspace } = useSelector(authSelector);
  const { users } = useSelector(userSelector);
  let ownerID = 0;
  if (userData && workspace) {
    ownerID = userData.access[workspace].owner_id;
  } else if (userData && defaultWorkspace) {
    userData?.access[defaultWorkspace.id].owner_id;
  } else {
    ownerID = 0;
  }

  let ownerData: OwnerDataType = {
    name: "",
    email: "",
    ownerWorkspace: "",
  };

  if (users.length > 0) {
    users.map((user) => {
      if (user && user.id === ownerID) {
        ownerData = {
          ...ownerData,
          name: user.name,
          email: user.email,
          ownerWorkspace: defaultWorkspace?.id ?? null,
        };
      }
    });
  } else {
    ownerData = {
      ...ownerData,
      name: userData?.user.name ?? null,
      email: userData?.user.email ?? null,
      ownerWorkspace: defaultWorkspace?.id ?? null,
    };
  }

  return ownerData;
}

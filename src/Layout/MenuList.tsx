import { useTranslation } from 'react-i18next';
import { UserGroup } from 'lucide-react';


const useMenuData = () => {
  const { t } = useTranslation();

  return [

    {
      label: t("sideBar.menus.userManagement"),
      icon: <UserGroup />,
      path: '/user-management',
      //roles: ["Admin"]
    }
  ];
};

export default useMenuData;

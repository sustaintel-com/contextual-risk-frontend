import { useTranslation } from 'react-i18next';
import { Newspaper, UserGroup } from 'lucide-react';


const useMenuData = () => {
  const { t } = useTranslation();

  return [

    {
      label: t("sideBar.menus.userManagement"),
      icon: <UserGroup />,
      path: '/user-management',
      //roles: ["Admin"]
    },
    {
      label: t("sideBar.menus.newsManagement"),
      icon: <Newspaper />,
      path: '/news',
      //roles: ["Admin"]
    }
  ];
};

export default useMenuData;

"use client";

// MUI Imports
import { useTheme } from "@mui/material/styles";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";

import { Box } from "@mui/material";

// Type Imports
import { useQuery } from "@tanstack/react-query";

import type { VerticalMenuContextProps } from "@menu/components/vertical-menu/Menu";

// Component Imports
import { Menu } from "@menu/vertical-menu";

// Hook Imports
import { useSettings } from "@core/hooks/useSettings";
import useVerticalNav from "@menu/hooks/useVerticalNav";

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon";

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles";
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles";
import { GenerateVerticalMenu } from "@/components/GenerateMenu";

import axiosInstance from "@/client/axiosInstance";
import type { FeatureAccess } from "@/types/featureAccess";

type RenderExpandIconProps = {
  open?: boolean;
  transitionDuration?: VerticalMenuContextProps["transitionDuration"];
};

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void;
};

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
);

const VerticalMenu = ({ scrollMenu }: Props) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vertical-menus"],
    queryFn: async () => {
      console.log("Fetching vertical menu data...");

      try {
        const response = await axiosInstance.get("/api/access/sidebar");

        console.log("Menu API response:", response.data);
        const data: FeatureAccess[] = response.data.data;

        function convertToVerticalMenuDataType(menus: FeatureAccess[]) {
          const menuData: any[] = [];

          for (const menu of menus) {
            const children = convertToVerticalMenuDataType(menu.children ?? []);

            const append: any = {
              label: menu.label
            };

            if (menu.icon) {
              append["icon"] = menu.icon;
            }

            if (menu.isSection) {
              append["isSection"] = menu.isSection;
            }

            if (menu.href) {
              append["href"] = menu.href;
            }

            if (children.length > 0) {
              append["children"] = children;
            }

            menuData.push(append);
          }

          return menuData;
        }

        const output = convertToVerticalMenuDataType(data);

        return output;
      } catch (error) {
        console.error("Error fetching menu data:", error);
        throw error;
      }
    }
  });

  // Hooks
  const theme = useTheme();
  const verticalNavOptions = useVerticalNav();
  const { settings } = useSettings();
  const { isBreakpointReached } = useVerticalNav();

  // Vars
  const { transitionDuration } = verticalNavOptions;

  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar;

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {isLoading ? (
          <div className='text-center p-4'>Loading menu...</div>
        ) : error ? (
          <div className='text-center p-4 text-red-500'>Error loading menu: {error.message}</div>
        ) : !data || data.length === 0 ? (
          <div className='text-center p-4'>No menu items available</div>
        ) : (
          <GenerateVerticalMenu menuData={data} />
        )}
        <Box height={60}></Box>
      </Menu>
    </ScrollWrapper>
  );
};

export default VerticalMenu;

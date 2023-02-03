import React from 'react';
import {
  CompassOutlined,
  DashboardOutlined,
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
  TableOutlined,
  UserOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import { ReactComponent as NftIcon } from '@app/assets/icons/nft-icon.svg';
import { ReactComponent as Bones } from '@app/assets/icons/bones.svg';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: 'Home',
    key: 'home',
    url: '/',
    icon: <HomeOutlined />,
  },  
  {
    title: 'Stocks',
    key: 'stocks',
    url: '/stocks',
    icon: <FormOutlined />,
  },
  {
    title: 'Products',
    key: 'products',
    url: '/products',
    icon: <TableOutlined />,
  },
];

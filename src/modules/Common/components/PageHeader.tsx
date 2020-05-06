import { PageHeader as AntdPageHeader } from "antd";
import { BreadcrumbProps as AntdBreadcrumbProps } from "antd/es/breadcrumb";
import { PageHeaderProps as AntdPageHeaderProps } from "antd/es/page-header";
import { pickBy } from "lodash";
import React from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbProps extends AntdBreadcrumbProps {
    useBrowserHistory?: boolean
}

export interface PageHeaderProps extends AntdPageHeaderProps {
    breadcrumb?: BreadcrumbProps;
}

const PageHeader: React.FC<PageHeaderProps> = ({ breadcrumb, ...rest }) => {
    const useBrowserHistory = breadcrumb?.useBrowserHistory;

    breadcrumb = pickBy(breadcrumb, (value, key) => {
        return key !== "useBrowserHistory";
    });

    if (useBrowserHistory) {
        return <AntdPageHeader {...rest} breadcrumb={{
            itemRender: (route, _params, routes, _paths) => {
                const isLastRoute = routes.indexOf(route) === routes.length - 1;

                return isLastRoute ? (
                    <span>{route.breadcrumbName}</span>
                ) : (
                    <Link to={route.path}>{route.breadcrumbName}</Link>
                );
            },
            ...breadcrumb,
        }} />;
    }

    return <AntdPageHeader breadcrumb={breadcrumb} {...rest} />;
};

export default PageHeader;

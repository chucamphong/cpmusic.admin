import { PageHeader as AntdPageHeader } from "antd";
import { BreadcrumbProps as AntdBreadcrumbProps } from "antd/es/breadcrumb";
import { PageHeaderProps as AntdPageHeaderProps } from "antd/es/page-header";
import React from "react";
import { Link } from "react-router-dom";

export interface BreadcrumbProps extends AntdBreadcrumbProps {
    useBrowserHistory?: boolean
}

export interface PageHeaderProps extends AntdPageHeaderProps {
    breadcrumb?: BreadcrumbProps;
}

const PageHeader: React.FC<PageHeaderProps> = ({ ...rest }) => {
    const breadcrumb = rest.breadcrumb;

    if (breadcrumb?.useBrowserHistory) {
        return <AntdPageHeader {...rest} breadcrumb={{
            itemRender: (route, params, routes, paths) => {
                const isLastRoute = routes.indexOf(route) === routes.length - 1;

                return isLastRoute ? (
                    <span>{route.breadcrumbName}</span>
                ) : (
                    <Link to={paths.join("/")}>{route.breadcrumbName}</Link>
                );
            },
            ...breadcrumb,
        }} />;
    }

    return <AntdPageHeader {...rest} />;
};

export default PageHeader;

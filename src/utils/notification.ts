import { notification } from "antd";
import { ArgsProps, NotificationApi } from "antd/es/notification";

const Notification: NotificationApi = {} as NotificationApi;

const myArgs: Partial<ArgsProps> = {
    style: {
        right: -8,
    },
};

Notification.open = (args: ArgsProps) => {
    return notification.open({ ...args, ...myArgs });
};

Notification.success = (args: ArgsProps) => {
    return Notification.open({
        ...args,
        type: "success",
    });
};

Notification.error = (args: ArgsProps) => {
    return Notification.open({
        ...args,
        type: "error",
    });
};

Notification.info = (args: ArgsProps) => {
    return Notification.open({
        ...args,
        type: "info",
    });
};

Notification.destroy = notification.destroy;

export default Notification;

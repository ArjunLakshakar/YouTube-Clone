import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";

const ytToastStyles = {
    root:
        "flex items-center my-4 sm:gap-8 gap-4 h-15 sm:px-8 px-2 py-3 bg-white sm:text-lg xs:text-base text-sm text-black dark:text-white dark:bg-zinc-800 border border-l-8 border-l-red-500 border-gray-600  rounded-lg shadow-lg",
    title:
        "sm:text-lg xs:text-base text-base font-semibold text-black dark:text-white",
    message:
        "sm:text-base text-gray-700 dark:text-gray-400",
    closeButton:
        "w-8 h-8 xs:flex hidden text-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded flex items-center justify-center",
};


export const showSuccess = (title = "Success", message = "") => {
    notifications.show({
        title,
        message,
        icon: <IconCheck size={28} className="text-green-400 " />,
        position: "top-center",
        color: "dark",
        withCloseButton: true,
        autoClose: 3000,
        radius: "md",
        classNames: ytToastStyles,
    });
};

export const showError = (title = "Error", message = "") => {
    notifications.show({
        title,
        message,
        icon: <IconX size={28} className="text-red-400" />,
        position: "top-center",
        color: "dark",
        withCloseButton: true,
        autoClose: 3000,
        radius: "md",
        classNames: ytToastStyles,
    });
};

export const showInfo = (title = "Info", message = "") => {
    notifications.show({
        title,
        message,
        icon: <IconInfoCircle size={32} className="text-blue-400" />,
        position: "top-center",
        color: "dark",
        withCloseButton: true,
        autoClose: 3000,
        radius: "md",
        classNames: ytToastStyles,
    });
};

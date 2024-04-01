import { UserIcons01 } from "./UserIcons01.jsx";
import { UserIcons02 } from "./UserIcons02.jsx";
import { UserIcons03 } from "./UserIcons03.jsx";
import { UserIcons04 } from "./UserIcons04.jsx";
import { UserIcons05 } from "./UserIcons05.jsx";
import { UserIcons06 } from "./UserIcons06.jsx";
import { DefaultIcon } from "./DefaultIcon.jsx";

export const UserIconsIndex = ({ profileIcon }) => {

    switch (profileIcon) {
        case 1:
            return <UserIcons01 />
        case 2:
            return <UserIcons02 />
        case 3:
            return <UserIcons03 />
        case 4:
            return <UserIcons04 />
        case 5:
            return <UserIcons05 />
        case 6:
            return <UserIcons06 />
        default:
            return <DefaultIcon />
    }
}

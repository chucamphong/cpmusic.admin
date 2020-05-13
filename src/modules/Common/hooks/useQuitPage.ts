import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const useQuitPage = (goTo?: string): [boolean, Dispatch<SetStateAction<boolean>>] => {
    const history = useHistory();
    const [quit, quitPage] = useState(false);

    useEffect(() => {
        if (quit) {
            goTo ? history.push(goTo) : history.goBack();
        }
    }, [goTo, history, quit]);

    return [quit, quitPage];
};

export default useQuitPage;

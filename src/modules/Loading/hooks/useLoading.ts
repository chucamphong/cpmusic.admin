import useSelector from "store/hooks/useSelector";

const useLoading = () => {
    const status = useSelector(state => state.loading.status);

    function isLoading() {
        return status === "pending";
    }

    return {
        isLoading,
    };
};

export default useLoading;

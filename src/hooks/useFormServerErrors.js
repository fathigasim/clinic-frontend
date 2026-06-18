// hooks/useFormServerErrors.js
export const useFormServerErrors = (setError) => {
    return (error) => {
         console.log("Hook received error:", error); // add this
        if (!error) return;

        if (error.message && !error.errors) {
            console.log("Setting root error:", error.message); // add this
            setError("root", {
                type: "server",
                message: error.message
            });
            return;
        }
        if (error) {
            Object.entries(error).forEach(([field, messages]) => {
                const fieldName = field === "" ? "root" : 
                    field.charAt(0).toLowerCase() + field.slice(1);
                setError(fieldName, {
                    type: "server",
                    message: messages[0]
                });
            });
        } else if (error?.message) {
            setError("root", {
                type: "server",
                message: error.message
            });
        }
    };
};
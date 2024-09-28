export function getFormString(theValue: FormDataEntryValue | null): string {
    if (theValue === null) {
        return "";
    }
    if (typeof theValue === "string") {
        return theValue;
    }
    throw new Error("formToString: unexpected type: " + typeof theValue);
}

import type { AlertMessage } from "~/types/AlertMessage";


type AlertWidgetProps = {
    alert: AlertMessage | null;
};

export function AlertWidget({ alert }:AlertWidgetProps) {

    return (
        alert ? 
        <div className={`alert alert-${alert.type}`}>
            {alert.message}
        </div>
        : null
    );
}
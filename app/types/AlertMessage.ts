
export type AlertType = 'danger' | 'success' | 'info' | 'warning' | 'primary' | 'secondary' | 'dark' | 'light';

export type AlertMessage = {
    type: AlertType;
    message: string;
    is_markdown?: boolean;
}
export interface StateReport {
    type: string;
    details: any;
}

export class StateReporter {
    private listeners: ((report: StateReport) => void)[] = [];

    public subscribe(listener: (report: StateReport) => void): void {
        this.listeners.push(listener);
    }

    public report(report: StateReport): void {
        this.listeners.forEach(listener => listener(report));
    }
}

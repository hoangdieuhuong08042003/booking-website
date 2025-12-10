export const getDatesInRange = (startDate: Date | string, endDate: Date | string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Reset hours to avoid time discrepancies
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const date = new Date(start.getTime());
    const dates = [];

    while (date < end) {
        // Format as YYYYMMDD integer
        const dateInt = parseInt(date.toISOString().slice(0, 10).replace(/-/g, ""));
        dates.push(dateInt);
        date.setDate(date.getDate() + 1);
    }

    return dates;
};

interface Balance {
    userId: number;
    amount: number;
}

interface Settlement {
    payerId: number;
    payeeId: number;
    amount: number;
}

export default function minimizeDebts(balances: Balance[]): Settlement[] {
    const settlements: Settlement[] = [];


    // Sort balances: creditors (positive) and debtors (negative)
    const creditors = balances.filter(b => b.amount > 0).sort((a, b) => b.amount - a.amount);
    const debtors = balances.filter(b => b.amount < 0).sort((a, b) => a.amount - b.amount);
    
    // initializing for the algo jo ayegi
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
        //so basically until both arrays get exhausted, we match the largest creditor with the largest debitor
        //dono mai se min absolute nikalo aur utne paise udhar mai se dedo
        //bas yehi repeat karo jbtk sb zero nhi ho jaate
        const creditor = creditors[creditorIndex];
        const debtor = debtors[debtorIndex];

        const settlementAmount = Math.min(creditor.amount, -debtor.amount);

        settlements.push({
            payerId: debtor.userId,
            payeeId: creditor.userId,
            amount: settlementAmount,
        });

        // Adjust balances
        creditors[creditorIndex].amount -= settlementAmount;
        debtors[debtorIndex].amount += settlementAmount;

        // Move to the next creditor or debtor if their balance is settled
        if (creditors[creditorIndex].amount === 0) creditorIndex++;
        if (debtors[debtorIndex].amount === 0) debtorIndex++;
    }


    return settlements;
}
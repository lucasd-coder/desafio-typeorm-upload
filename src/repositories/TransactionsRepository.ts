import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transaction = await this.find();

    const { income, outcome } = transaction.reduce(
      (accamulator: Balance, transactions: Transaction) => {
        switch (transactions.type) {
          case 'income':
            accamulator.income += Number(transactions.value);
            break;
          case 'outcome':
            accamulator.outcome += Number(transactions.value);
            break;
          default:
            break;
        }
        return accamulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;

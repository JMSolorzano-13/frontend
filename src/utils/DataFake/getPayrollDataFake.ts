import { faker } from "@faker-js/faker";

export default function getPayrollDataFake() {
  return {
    filtered: {
      employeeQTY: faker.number.int(100),
      percepts: faker.number.float(7000),
      deductions: faker.number.float(2000),
      otherPayments: faker.number.float(7000),
      salary: faker.number.float(10000),
      otherPercepts: faker.number.float(2000),
      taxed: faker.number.float(4000),
      exempt: faker.number.float(1000),
      ISRHoldings: faker.number.float(1000),
      otherDeductions: faker.number.float(500),
      subsidyCaused: faker.number.float(4000),
      netTotal: faker.number.float(20000),
    },
    excercise: {
      employeeQTY: faker.number.int(100),
      percepts: faker.number.float(7000),
      deductions: faker.number.float(2000),
      otherPayments: faker.number.float(7000),
      salary: faker.number.float(10000),
      otherPercepts: faker.number.float(2000),
      taxed: faker.number.float(4000),
      exempt: faker.number.float(1000),
      ISRHoldings: faker.number.float(1000),
      otherDeductions: faker.number.float(500),
      subsidyCaused: faker.number.float(4000),
      netTotal: faker.number.float(20000),
    },
  };
}

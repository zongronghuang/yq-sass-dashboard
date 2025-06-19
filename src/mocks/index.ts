export function mockPause(milliseconds: number = 1500) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export const mockActiveUsers = [
  {
    timeBucket: "2025-01-01T00:00:00Z",
    value: 265,
  },
  {
    timeBucket: "2025-01-02T00:00:00Z",
    value: 324,
  },
  {
    timeBucket: "2025-01-03T00:00:00Z",
    value: 496,
  },
  {
    timeBucket: "2025-01-04T00:00:00Z",
    value: 410,
  },
  {
    timeBucket: "2025-01-05T00:00:00Z",
    value: 230,
  },
  {
    timeBucket: "2025-01-06T00:00:00Z",
    value: 546,
  },
  {
    timeBucket: "2025-01-07T00:00:00Z",
    value: 389,
  },
  {
    timeBucket: "2025-01-08T00:00:00Z",
    value: 265 - 1,
  },
  {
    timeBucket: "2025-01-09T00:00:00Z",
    value: 324 - 1,
  },
  {
    timeBucket: "2025-01-10T00:00:00Z",
    value: 496 - 1,
  },
  {
    timeBucket: "2025-01-11T00:00:00Z",
    value: 410 - 1,
  },
  {
    timeBucket: "2025-01-12T00:00:00Z",
    value: 230 - 1,
  },
  {
    timeBucket: "2025-01-13T00:00:00Z",
    value: 546 - 1,
  },
  {
    timeBucket: "2025-01-14T00:00:00Z",
    value: 389 - 1,
  },
  {
    timeBucket: "2025-01-15T00:00:00Z",
    value: 265 + 1,
  },
  {
    timeBucket: "2025-01-16T00:00:00Z",
    value: 324 + 1,
  },
  {
    timeBucket: "2025-01-17T00:00:00Z",
    value: 496 + 1,
  },
  {
    timeBucket: "2025-01-18T00:00:00Z",
    value: 410 + 1,
  },
  {
    timeBucket: "2025-01-19T00:00:00Z",
    value: 230 + 1,
  },
  {
    timeBucket: "2025-01-20T00:00:00Z",
    value: 546 + 1,
  },
  {
    timeBucket: "2025-01-21T00:00:00Z",
    value: 389 + 1,
  },
];

export const mockDailyStoreSectionData = [
  {
    locationName: "Entrance Section",
    metrics: {
      waitTimeSeconds: 14,
      workForceUtilization: {
        total: 40,
        persons: [
          {
            firstName: "Alice",
            lastName: "Alistair",
          },
          {
            firstName: "Bob",
            lastName: "Bastion",
          },
        ],
      },
    },
  },
  {
    locationName: "Checkout Section",
    metrics: {
      waitTimeSeconds: 178,
      workForceUtilization: {
        total: 20,
        persons: [
          {
            firstName: "Chair",
            lastName: "Colster",
          },
        ],
      },
    },
  },
  {
    locationName: "Support Desk",
    metrics: {
      waitTimeSeconds: 273,
      workForceUtilization: {
        total: 40,
        persons: [
          {
            firstName: "Dave",
            lastName: "Deportes",
          },
          {
            firstName: "Eny",
            lastName: "Ellior",
          },
        ],
      },
    },
  },
];

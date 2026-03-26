export interface MathLevel {
  level: number
  pairs: { left: string; right: string }[]
}

export const mathLevels: MathLevel[] = [
  {
    level: 1,
    pairs: [
      { left: "2 × 1", right: "2" },
      { left: "2 × 2", right: "4" },
      { left: "2 × 3", right: "6" },
      { left: "2 × 4", right: "8" },
      { left: "2 × 5", right: "10" },
      { left: "2 × 6", right: "12" },
      { left: "2 × 7", right: "14" },
      { left: "2 × 8", right: "16" },
      { left: "2 × 9", right: "18" },
      { left: "2 × 10", right: "20" }
    ]
  },
  {
    level: 2,
    pairs: [
      { left: "3 × 1", right: "3" },
      { left: "3 × 2", right: "6" },
      { left: "3 × 3", right: "9" },
      { left: "3 × 4", right: "12" },
      { left: "3 × 5", right: "15" },
      { left: "3 × 6", right: "18" },
      { left: "3 × 7", right: "21" },
      { left: "3 × 8", right: "24" },
      { left: "3 × 9", right: "27" },
      { left: "3 × 10", right: "30" }
    ]
  },
  {
    level: 3,
    pairs: [
      { left: "4 × 1", right: "4" },
      { left: "4 × 2", right: "8" },
      { left: "4 × 3", right: "12" },
      { left: "4 × 4", right: "16" },
      { left: "4 × 5", right: "20" },
      { left: "4 × 6", right: "24" },
      { left: "4 × 7", right: "28" },
      { left: "4 × 8", right: "32" },
      { left: "4 × 9", right: "36" },
      { left: "4 × 10", right: "40" }
    ]
  },
  {
    level: 4,
    pairs: [
      { left: "5 × 1", right: "5" },
      { left: "5 × 2", right: "10" },
      { left: "5 × 3", right: "15" },
      { left: "5 × 4", right: "20" },
      { left: "5 × 5", right: "25" },
      { left: "5 × 6", right: "30" },
      { left: "5 × 7", right: "35" },
      { left: "5 × 8", right: "40" },
      { left: "5 × 9", right: "45" },
      { left: "5 × 10", right: "50" }
    ]
  },
  {
    level: 5,
    pairs: [
      { left: "6 × 1", right: "6" },
      { left: "6 × 2", right: "12" },
      { left: "6 × 3", right: "18" },
      { left: "6 × 4", right: "24" },
      { left: "6 × 5", right: "30" },
      { left: "6 × 6", right: "36" },
      { left: "6 × 7", right: "42" },
      { left: "6 × 8", right: "48" },
      { left: "6 × 9", right: "54" },
      { left: "6 × 10", right: "60" }
    ]
  },
  {
    level: 6,
    pairs: [
      { left: "7 × 1", right: "7" },
      { left: "7 × 2", right: "14" },
      { left: "7 × 3", right: "21" },
      { left: "7 × 4", right: "28" },
      { left: "7 × 5", right: "35" },
      { left: "7 × 6", right: "42" },
      { left: "7 × 7", right: "49" },
      { left: "7 × 8", right: "56" },
      { left: "7 × 9", right: "63" },
      { left: "7 × 10", right: "70" }
    ]
  },
  {
    level: 7,
    pairs: [
      { left: "8 × 1", right: "8" },
      { left: "8 × 2", right: "16" },
      { left: "8 × 3", right: "24" },
      { left: "8 × 4", right: "32" },
      { left: "8 × 5", right: "40" },
      { left: "8 × 6", right: "48" },
      { left: "8 × 7", right: "56" },
      { left: "8 × 8", right: "64" },
      { left: "8 × 9", right: "72" },
      { left: "8 × 10", right: "80" }
    ]
  },
  {
    level: 8,
    pairs: [
      { left: "9 × 1", right: "9" },
      { left: "9 × 2", right: "18" },
      { left: "9 × 3", right: "27" },
      { left: "9 × 4", right: "36" },
      { left: "9 × 5", right: "45" },
      { left: "9 × 6", right: "54" },
      { left: "9 × 7", right: "63" },
      { left: "9 × 8", right: "72" },
      { left: "9 × 9", right: "81" },
      { left: "9 × 10", right: "90" }
    ]
  },
  {
    level: 9,
    pairs: [
      { left: "10 × 1", right: "10" },
      { left: "10 × 2", right: "20" },
      { left: "10 × 3", right: "30" },
      { left: "10 × 4", right: "40" },
      { left: "10 × 5", right: "50" },
      { left: "10 × 6", right: "60" },
      { left: "10 × 7", right: "70" },
      { left: "10 × 8", right: "80" },
      { left: "10 × 9", right: "90" },
      { left: "10 × 10", right: "100" }
    ]
  },
  {
    level: 10,
    pairs: [
      { left: "11 × 2", right: "22" },
      { left: "11 × 3", right: "33" },
      { left: "11 × 4", right: "44" },
      { left: "11 × 5", right: "55" },
      { left: "11 × 6", right: "66" },
      { left: "11 × 7", right: "77" },
      { left: "11 × 8", right: "88" },
      { left: "11 × 9", right: "99" },
      { left: "12 × 2", right: "24" },
      { left: "12 × 3", right: "36" }
    ]
  }
]

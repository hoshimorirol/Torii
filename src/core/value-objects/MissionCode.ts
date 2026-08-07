export class MissionCode {
  static generate(year: number, sequence: number): string {
    return `EXP-${year}-${String(sequence).padStart(3, '0')}`;
  }
}